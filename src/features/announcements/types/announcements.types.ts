export interface Announcement {
  id: string;
  message: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface AnnouncementInput {
  message: string;
  is_active: boolean;
  display_order: number;
}