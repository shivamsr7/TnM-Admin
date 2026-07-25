export interface FeaturedCollection {
  id: string;

  collection_id: string;

  display_order: number;

  is_active: boolean;

  created_at: string;

  updated_at: string;

  collection?: {
  id: string;
  name: string;
  slug: string;
  thumbnail_image: string | null;
};
}

export interface AddFeaturedCollectionPayload {
  collection_id: string;
}