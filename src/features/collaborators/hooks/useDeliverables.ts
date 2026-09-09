import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  collaboratorService,
  type CreateCollaborationDeliverableData,
  type UpdateCollaborationDeliverableData,
} from "../services/collaborator.service";

export const deliverablesQueryKey = (
  collaborationId?: string
) => ["collaboration-deliverables", collaborationId];

export function useDeliverables(
  collaborationId?: string
) {
  return useQuery({
    queryKey:
      deliverablesQueryKey(collaborationId),

    queryFn: () => {
      if (!collaborationId) {
        return Promise.resolve([]);
      }

      return collaboratorService.getDeliverables(
        collaborationId
      );
    },

    enabled: Boolean(collaborationId),
  });
}

export function useCreateDeliverable() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      payload: CreateCollaborationDeliverableData
    ) =>
      collaboratorService.createDeliverable(
        payload
      ),

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: deliverablesQueryKey(
          data.collaboration_id
        ),
      });

      queryClient.invalidateQueries({
        queryKey: ["collaborations"],
      });

      queryClient.invalidateQueries({
        queryKey: ["creator-profiles"],
      });
    },
  });
}

export function useUpdateDeliverable() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      collaborationId: string;
      updates: UpdateCollaborationDeliverableData;
    }) =>
      collaboratorService.updateDeliverable(
        id,
        updates
      ),

    onSuccess: (
      _data,
      variables
    ) => {
      queryClient.invalidateQueries({
        queryKey: deliverablesQueryKey(
          variables.collaborationId
        ),
      });

      queryClient.invalidateQueries({
        queryKey: ["collaborations"],
      });

      queryClient.invalidateQueries({
        queryKey: ["creator-profiles"],
      });
    },
  });
}

export function useDeleteDeliverable() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
    }: {
      id: string;
      collaborationId: string;
    }) =>
      collaboratorService.deleteDeliverable(
        id
      ),

    onSuccess: (
      _data,
      variables
    ) => {
      queryClient.invalidateQueries({
        queryKey: deliverablesQueryKey(
          variables.collaborationId
        ),
      });

      queryClient.invalidateQueries({
        queryKey: ["collaborations"],
      });

      queryClient.invalidateQueries({
        queryKey: ["creator-profiles"],
      });
    },
  });
}