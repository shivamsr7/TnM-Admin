import { useQuery } from "@tanstack/react-query";

import { faqService } from "../services/faq.service";


export function useFAQs() {
  return useQuery({
    queryKey: ["faqs"],
    queryFn: () =>
      faqService.getAll(),
  });
}


export function useFAQ(id: string) {
  return useQuery({
    queryKey: ["faq", id],

    queryFn: () =>
      faqService.getById(id),

    enabled: !!id,
  });
}