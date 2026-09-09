import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { collaboratorService } from "../services/collaborator.service";

import type {
  CreateCollaborationData,
  UpdateCollaborationData,
} from "../services/collaborator.service";

export const collaborationsQueryKey = (
  collaboratorId?: string
) => [
  "collaborations",
  collaboratorId,
];

export function useCollaborations(
  collaboratorId?: string
) {
  return useQuery({
    queryKey:
      collaborationsQueryKey(
        collaboratorId
      ),

    queryFn: () => {
      if (!collaboratorId) {
        return Promise.resolve([]);
      }

      return collaboratorService.getByCollaborator(
        collaboratorId
      );
    },

    enabled: Boolean(
      collaboratorId
    ),
  });
}

export function useCreateCollaboration() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      payload: CreateCollaborationData
    ) =>
      collaboratorService.create(
        payload
      ),

    onSuccess: (
      data
    ) => {
      queryClient.invalidateQueries({
        queryKey:
          collaborationsQueryKey(
            data.collaborator_id
          ),
      });

      queryClient.invalidateQueries({
        queryKey: [
          "creator-profiles",
        ],
      });
    },
  });
}

export function useUpdateCollaboration() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: UpdateCollaborationData;
    }) =>
      collaboratorService.update(
        id,
        updates
      ),

    onSuccess: (
      data
    ) => {
      queryClient.invalidateQueries({
        queryKey:
          collaborationsQueryKey(
            data.collaborator_id
          ),
      });

      queryClient.invalidateQueries({
        queryKey: [
          "creator-profiles",
        ],
      });
    },
  });
}

export function useDeleteCollaboration() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      id: string
    ) =>
      collaboratorService.delete(
        id
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "collaborations",
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "creator-profiles",
        ],
      });
    },
  });
}