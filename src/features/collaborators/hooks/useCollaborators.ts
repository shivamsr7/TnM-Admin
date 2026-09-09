import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { collaboratorService } from "../services/collaborator.service";

import type {
  CollaboratorApplicationStatus,
} from "../types/collaborator.types";

/*
 * =========================================================
 * QUERY KEYS
 * =========================================================
 */

export const collaboratorsQueryKey = [
  "collaborators",
];

export const creatorProfilesQueryKey = [
  "creator-profiles",
];

/*
 * =========================================================
 * COLLABORATOR APPLICATIONS
 * =========================================================
 */

export function useCollaborators() {
  return useQuery({
    queryKey: collaboratorsQueryKey,
    queryFn: () =>
      collaboratorService.getAll(),
  });
}

/*
 * =========================================================
 * APPROVED CREATOR PROFILES
 * =========================================================
 */

export function useCreatorProfiles() {
  return useQuery({
    queryKey: creatorProfilesQueryKey,
    queryFn: () =>
      collaboratorService.getAllCreators(),
  });
}

/*
 * =========================================================
 * UPDATE APPLICATION STATUS
 * =========================================================
 */

export function useUpdateCollaboratorStatus() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
      adminNotes,
    }: {
      id: string;
      status: CollaboratorApplicationStatus;
      adminNotes: string | null;
    }) =>
      collaboratorService.updateStatus(
        id,
        status,
        adminNotes
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          collaboratorsQueryKey,
      });

      queryClient.invalidateQueries({
        queryKey:
          creatorProfilesQueryKey,
      });
    },
  });
}

/*
 * =========================================================
 * UPDATE CREATOR PROFILE
 * =========================================================
 */

export function useUpdateCreator() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: {
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
      };
    }) =>
      collaboratorService.updateCreator(
        id,
        updates
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          creatorProfilesQueryKey,
      });
    },
  });
}