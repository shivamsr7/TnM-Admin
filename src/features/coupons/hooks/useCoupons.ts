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
  CouponTargetType,
  CouponTargetMode,
} from "../types/coupon.types";

export interface CouponRulesPayload {
  targets: Array<{
    target_type: CouponTargetType;
    target_id: string;
    target_mode: CouponTargetMode;
  }>;
  customerIds: string[];
  membershipTierIds: string[];
}

export interface CouponSubmitPayload {
  data: CouponFormData;
  rules: CouponRulesPayload;
}

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
      payload: CouponSubmitPayload
    ) =>
      couponService.createWithRules(
        payload.data,
        payload.rules
      ),

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
      rules,
    }: {
      id: string;
      data: CouponFormData;
      rules: CouponRulesPayload;
    }) =>
      couponService.updateWithRules(
        id,
        data,
        rules
      ),

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