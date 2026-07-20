import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  couponService,
} from "../services/coupon.service";

import type {
  CouponFormData,
} from "../types/coupon.types";

export function useCoupons() {
  return useQuery({
    queryKey: ["coupons"],
    queryFn: couponService.getAll,
  });
}

export function useCoupon(id?: string) {
  return useQuery({
    queryKey: ["coupon", id],
    queryFn: () =>
      couponService.getById(id!),
    enabled: !!id,
  });
}

export function useCreateCoupon() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (
      data: CouponFormData
    ) => couponService.create(data),

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["coupons"],
      });
    },
  });
}

export function useUpdateCoupon() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: CouponFormData;
    }) =>
      couponService.update(id, data),

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["coupons"],
      });
    },
  });
}

export function useDeleteCoupon() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      couponService.delete(id),

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["coupons"],
      });
    },
  });
}