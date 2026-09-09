import { supabase } from "@/lib/supabase";

import { notificationService } from "@/features/notifications/services/notification.service";

import type {
  Collaboration,
  CollaborationStatus,
  CollaborationProduct,
  CollaborationType,
  CollaboratorApplication,
  CollaboratorApplicationStatus,
  CollaboratorProfile,
  CollaborationDeliverable,
  CollaborationDeliverableType,
  CollaborationDeliverableStatus,
} from "../types/collaborator.types";

/*
 * =========================================================
 * COLLABORATION TYPES
 * =========================================================
 */

export interface CreateCollaborationData {
  collaborator_id: string;
  campaign_name: string;
  collaboration_type: CollaborationType;
  status?: CollaborationStatus;
  start_date?: string | null;
  end_date?: string | null;
  products?: CollaborationProduct[];
  deliverables_expected?: number;
  notes?: string | null;
}

export interface UpdateCollaborationData {
  campaign_name?: string;
  collaboration_type?: CollaborationType;
  status?: CollaborationStatus;
  start_date?: string | null;
  end_date?: string | null;
  products?: CollaborationProduct[];
  deliverables_expected?: number;
  deliverables_completed?: number;
  reel_views?: number;
  likes?: number;
  comments?: number;
  shares?: number;
  orders_generated?: number;
  revenue_generated?: number;
  commission_amount?: number;
  notes?: string | null;
}



/*
 * =========================================================
 * DELIVERABLE TYPES
 * =========================================================
 */

export interface CreateCollaborationDeliverableData {
  collaboration_id: string;
  deliverable_type: CollaborationDeliverableType;
  title?: string | null;
  content_url?: string | null;
  status?: CollaborationDeliverableStatus;
  published_at?: string | null;
  notes?: string | null;
}

export interface UpdateCollaborationDeliverableData {
  deliverable_type?: CollaborationDeliverableType;
  title?: string | null;
  content_url?: string | null;
  status?: CollaborationDeliverableStatus;
  published_at?: string | null;
  notes?: string | null;
}

/*
 * =========================================================
 * CREATOR PROFILE UPDATE
 * =========================================================
 */

export interface UpdateCreatorData {
  full_name?: string;
  email?: string;
  phone?: string | null;

  instagram_username?: string;
  instagram_url?: string | null;
  youtube_url?: string | null;
  other_social_url?: string | null;

  follower_count?: number | null;
  average_reel_views?: number | null;

  content_category?: string | null;

  collaboration_type?:
    | "gifted"
    | "affiliate"
    | "paid"
    | "ugc";

  portfolio_url?: string | null;

  status?:
    | "active"
    | "inactive"
    | "blacklisted";

  admin_notes?: string | null;

  affiliate_code?: string | null;
}

/*
 * =========================================================
 * SERVICE
 * =========================================================
 */

class CollaborationService {
  /*
   * =======================================================
   * COLLABORATOR APPLICATIONS
   * =======================================================
   */

  /**
   * Get all collaborator applications.
   */
  async getAll(): Promise<CollaboratorApplication[]> {
    const { data, error } = await supabase
      .from("collaborator_applications")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(
        "Failed to fetch collaborator applications:",
        error
      );

      throw error;
    }

    return (data ?? []) as CollaboratorApplication[];
  }

  /**
   * Update collaborator application status.
   *
   * When an application is approved, a permanent
   * collaborator profile is created automatically.
   */
  async updateStatus(
    id: string,
    status: CollaboratorApplicationStatus,
    adminNotes: string | null
  ): Promise<CollaboratorApplication> {
    const {
      data: {
        user,
      },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error(
        "You must be logged in to update collaborator status."
      );
    }

    /*
     * Get the application first so we can create the
     * permanent creator profile if it gets approved.
     */
    const { data: application, error: applicationError } =
      await supabase
        .from("collaborator_applications")
        .select("*")
        .eq("id", id)
        .single();

    if (applicationError) {
      console.error(
        "Failed to fetch collaborator application:",
        applicationError
      );

      throw applicationError;
    }

    const { data, error } = await supabase
      .from("collaborator_applications")
      .update({
        status,
        admin_notes: adminNotes,
        reviewed_at: new Date().toISOString(),
        reviewed_by: user.id,
      })
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      console.error(
        "Failed to update collaborator status:",
        error
      );

      throw error;
    }

    /*
     * =====================================================
     * APPROVAL → PERMANENT CREATOR PROFILE
     * =====================================================
     */

    if (status === "approved") {
      const {
        data: existingCreator,
        error: existingCreatorError,
      } = await supabase
        .from("collaborators")
        .select("id")
        .eq("application_id", id)
        .maybeSingle();

      if (existingCreatorError) {
        console.error(
          "Failed to check existing creator profile:",
          existingCreatorError
        );

        throw existingCreatorError;
      }

      /*
       * Only create the permanent profile if one doesn't
       * already exist.
       */
      if (!existingCreator) {
        const { error: creatorError } =
          await supabase
            .from("collaborators")
            .insert({
              application_id: application.id,

              full_name:
                application.full_name,

              email:
                application.email,

              phone:
                application.phone,

              instagram_username:
                application.instagram_username,

              instagram_url:
                application.instagram_url,

              youtube_url:
                application.youtube_url,

              other_social_url:
                application.other_social_url,

              follower_count:
                application.follower_count,

              average_reel_views:
                application.average_reel_views,

              content_category:
                application.content_category,

              collaboration_type:
                application.collaboration_type,

              portfolio_url:
                application.portfolio_url,

              status: "active",

              admin_notes:
                adminNotes ??
                application.admin_notes,

              total_collaborations: 0,
              total_deliverables: 0,
              total_orders: 0,
              total_revenue: 0,

              affiliate_code: null,

              approved_at:
                new Date().toISOString(),

              last_collaboration_at: null,
            });

        if (creatorError) {
          console.error(
            "Failed to create creator profile:",
            creatorError
          );

          throw creatorError;
        }
      }
    }

    /*
     * =====================================================
     * STATUS EMAIL
     * =====================================================
     */

    if (
      status === "under_review" ||
      status === "approved" ||
      status === "rejected"
    ) {
      try {
        await notificationService.sendCollaboratorStatusEmail({
          to: application.email,

          collaboratorName:
            application.full_name,

          instagramUsername:
            application.instagram_username,

          collaborationType:
            application.collaboration_type,

          contentCategory:
            application.content_category,

          status,
        });
      } catch (emailError) {
        /*
         * Email failure should NOT make the status update
         * fail because the database update already succeeded.
         */
        console.error(
          "Failed to send collaborator status email:",
          emailError
        );
      }
    }

    return data as CollaboratorApplication;
  }

  /*
   * =======================================================
   * PERMANENT CREATOR PROFILES
   * =======================================================
   */

  /**
   * Get all approved/permanent creator profiles.
   */
  async getAllCreators(): Promise<CollaboratorProfile[]> {
    const { data, error } = await supabase
      .from("collaborators")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(
        "Failed to fetch creator profiles:",
        error
      );

      throw error;
    }

    return (data ?? []) as CollaboratorProfile[];
  }

  /**
   * Update a permanent creator profile.
   */
  async updateCreator(
    id: string,
    updates: UpdateCreatorData
  ): Promise<CollaboratorProfile> {
    const {
      data: {
        user,
      },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error(
        "You must be logged in to update creator profile."
      );
    }

    const { data, error } = await supabase
      .from("collaborators")
      .update(updates)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      console.error(
        "Failed to update creator profile:",
        error
      );

      throw error;
    }

    return data as CollaboratorProfile;
  }

  /*
   * =======================================================
   * COLLABORATION HISTORY
   * =======================================================
   */

  /**
   * Get all collaborations for a specific creator.
   */
  async getByCollaborator(
    collaboratorId: string
  ): Promise<Collaboration[]> {
    const { data, error } = await supabase
      .from("collaborations")
      .select("*")
      .eq("collaborator_id", collaboratorId)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(
        "Failed to fetch collaborations:",
        error
      );

      throw error;
    }

    return (data ?? []) as Collaboration[];
  }

  /**
   * Get a single collaboration.
   */
  async getById(
    id: string
  ): Promise<Collaboration> {
    const { data, error } = await supabase
      .from("collaborations")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(
        "Failed to fetch collaboration:",
        error
      );

      throw error;
    }

    return data as Collaboration;
  }

  /**
   * Create a new collaboration.
   */
  async create(
    payload: CreateCollaborationData
  ): Promise<Collaboration> {
    const { data, error } = await supabase
      .from("collaborations")
      .insert({
        collaborator_id:
          payload.collaborator_id,

        campaign_name:
          payload.campaign_name,

        collaboration_type:
          payload.collaboration_type,

        status:
          payload.status ?? "planned",

        start_date:
          payload.start_date ?? null,

        end_date:
          payload.end_date ?? null,

        products:
          payload.products ?? [],

        deliverables_expected:
          payload.deliverables_expected ?? 0,

        notes:
          payload.notes ?? null,
      })
      .select("*")
      .single();

    if (error) {
      console.error(
        "Failed to create collaboration:",
        error
      );

      throw error;
    }

    return data as Collaboration;
  }

  /**
   * Update a collaboration.
   */
  async update(
    id: string,
    updates: UpdateCollaborationData
  ): Promise<Collaboration> {
    const { data, error } = await supabase
      .from("collaborations")
      .update(updates)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      console.error(
        "Failed to update collaboration:",
        error
      );

      throw error;
    }

    return data as Collaboration;
  }

  /*
   * =======================================================
   * COLLABORATION DELIVERABLES
   * =======================================================
   */

  /**
   * Get all deliverables for a collaboration.
   */
  async getDeliverables(
    collaborationId: string
  ): Promise<CollaborationDeliverable[]> {
    const { data, error } = await supabase
      .from("collaboration_deliverables")
      .select("*")
      .eq("collaboration_id", collaborationId)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(
        "Failed to fetch collaboration deliverables:",
        error
      );

      throw error;
    }

    return (data ?? []) as CollaborationDeliverable[];
  }

  /**
   * Create a deliverable.
   */
  async createDeliverable(
    payload: CreateCollaborationDeliverableData
  ): Promise<CollaborationDeliverable> {
    const { data, error } = await supabase
      .from("collaboration_deliverables")
      .insert({
        collaboration_id: payload.collaboration_id,
        deliverable_type: payload.deliverable_type,
        title: payload.title ?? null,
        content_url: payload.content_url ?? null,
        status: payload.status ?? "pending",
        published_at: payload.published_at ?? null,
        notes: payload.notes ?? null,
      })
      .select("*")
      .single();

    if (error) {
      console.error(
        "Failed to create collaboration deliverable:",
        error
      );

      throw error;
    }

    return data as CollaborationDeliverable;
  }

  /**
   * Update a deliverable.
   */
  async updateDeliverable(
    id: string,
    updates: UpdateCollaborationDeliverableData
  ): Promise<CollaborationDeliverable> {
    const { data, error } = await supabase
      .from("collaboration_deliverables")
      .update(updates)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      console.error(
        "Failed to update collaboration deliverable:",
        error
      );

      throw error;
    }

    return data as CollaborationDeliverable;
  }

  /**
   * Delete a deliverable.
   */
  async deleteDeliverable(
    id: string
  ): Promise<void> {
    const { error } = await supabase
      .from("collaboration_deliverables")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(
        "Failed to delete collaboration deliverable:",
        error
      );

      throw error;
    }
  }

  /**
   * Delete a collaboration.
   */
  async delete(
    id: string
  ): Promise<void> {
    const { error } = await supabase
      .from("collaborations")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(
        "Failed to delete collaboration:",
        error
      );

      throw error;
    }
  }
}

/*
 * =========================================================
 * EXPORT
 * =========================================================
 */

export const collaboratorService =
  new CollaborationService();