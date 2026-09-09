export type CollaborationType =
  | "gifted"
  | "affiliate"
  | "paid"
  | "ugc";

export type CollaboratorApplicationStatus =
  | "pending"
  | "under_review"
  | "approved"
  | "rejected";

export interface CollaboratorApplication {
  id: string;

  full_name: string;
  email: string;
  phone: string | null;

  instagram_username: string;
  instagram_url: string | null;
  youtube_url: string | null;
  other_social_url: string | null;

  follower_count: number | null;
  average_reel_views: number | null;

  content_category: string | null;

  collaboration_type: CollaborationType;

  why_collaborate: string | null;
  portfolio_url: string | null;

  status: CollaboratorApplicationStatus;

  admin_notes: string | null;

  reviewed_at: string | null;
  reviewed_by: string | null;

  created_at: string;
  updated_at: string;
}
export type CollaboratorProfileStatus =
  | "active"
  | "inactive"
  | "blacklisted";

export interface CollaboratorProfile {
  id: string;

  application_id: string | null;

  full_name: string;
  email: string;
  phone: string | null;

  instagram_username: string;
  instagram_url: string | null;

  youtube_url: string | null;
  other_social_url: string | null;

  follower_count: number | null;
  average_reel_views: number | null;

  content_category: string | null;

  collaboration_type: CollaborationType;

  portfolio_url: string | null;

  status: CollaboratorProfileStatus;

  admin_notes: string | null;

  total_collaborations: number;
  total_deliverables: number;
  total_orders: number;
  total_revenue: number;

  affiliate_code: string | null;

  approved_at: string | null;
  last_collaboration_at: string | null;

  created_at: string;
  updated_at: string;
}
export type CollaborationStatus =
  | "planned"
  | "active"
  | "completed"
  | "cancelled";

export interface CollaborationProduct {
  product_id: string;
  quantity: number;
}

export interface Collaboration {
  id: string;

  collaborator_id: string;

  campaign_name: string;

  collaboration_type: CollaborationType;

  status: CollaborationStatus;

  start_date: string | null;
  end_date: string | null;

  products: CollaborationProduct[];

  deliverables_expected: number;
  deliverables_completed: number;

  reel_views: number;
  likes: number;
  comments: number;
  shares: number;

  orders_generated: number;
  revenue_generated: number;
  commission_amount: number;

  notes: string | null;

  created_at: string;
  updated_at: string;
}
export type CollaborationDeliverableType =
  | "reel"
  | "story"
  | "post"
  | "ugc"
  | "youtube"
  | "short"
  | "other";

export type CollaborationDeliverableStatus =
  | "pending"
  | "in_progress"
  | "published"
  | "approved"
  | "rejected";

export interface CollaborationDeliverable {
  id: string;

  collaboration_id: string;

  deliverable_type: CollaborationDeliverableType;

  title: string | null;

  content_url: string | null;

  status: CollaborationDeliverableStatus;

  published_at: string | null;

  notes: string | null;

  created_at: string;
  updated_at: string;
}