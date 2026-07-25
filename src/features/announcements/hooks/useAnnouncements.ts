import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { announcementService } from "../services/announcement.service";
import type { AnnouncementInput } from "../types/announcements.types";

const QUERY_KEY = ["announcements"];

export function useAnnouncements() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: announcementService.getAll,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AnnouncementInput) =>
      announcementService.create(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
      });
    },
  });
}

export function useUpdateAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: AnnouncementInput;
    }) => announcementService.update(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
      });
    },
  });
}

export function useDeleteAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      announcementService.delete(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
      });
    },
  });
}

export function useToggleAnnouncementStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      is_active,
    }: {
      id: string;
      is_active: boolean;
    }) =>
      announcementService.toggleStatus(id, is_active),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
      });
    },
  });
}