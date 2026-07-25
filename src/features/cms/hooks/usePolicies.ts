import { useQuery } from "@tanstack/react-query";

import { policyService } from "../services/policy.service";


export function usePolicies() {
  return useQuery({
    queryKey: ["policies"],

    queryFn: () =>
      policyService.getAll(),
  });
}


export function usePolicy(id: string) {
  return useQuery({
    queryKey: ["policy", id],

    queryFn: () =>
      policyService.getById(id),

    enabled: !!id,
  });
}


export function usePolicyBySlug(
  slug: string
) {
  return useQuery({
    queryKey: [
      "policy",
      slug,
    ],

    queryFn: () =>
      policyService.getBySlug(slug),

    enabled: !!slug,
  });
}