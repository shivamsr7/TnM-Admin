import { useQuery } from "@tanstack/react-query";

import { homepageSectionsService } from "../services/homepageSections.service";

export function useHomepageSections() {
  return useQuery({
    queryKey: ["homepage-sections"],

    queryFn: () =>
      homepageSectionsService.getSections(),
  });
}