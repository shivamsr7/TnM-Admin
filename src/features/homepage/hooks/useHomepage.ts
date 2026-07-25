import { useQuery } from "@tanstack/react-query";
import { homepageService } from "../services/homepage.service";

export function useHomepage() {
  const bannersQuery = useQuery({
    queryKey: ["homepage-banners"],
    queryFn: () => homepageService.getBanners(),
  });

  return {
    bannersQuery,
  };
}