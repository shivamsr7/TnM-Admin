import { useQuery } from "@tanstack/react-query";

import { featuredCollectionsService } from "../services/featuredCollections.service";

export function useFeaturedCollections() {
  return useQuery({
    queryKey: ["featured-collections"],

    queryFn: () =>
      featuredCollectionsService.getFeaturedCollections(),
  });
}