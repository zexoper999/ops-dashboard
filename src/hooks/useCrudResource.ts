import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import type { PaginatedResponse } from "@/types";

// 필터 객체를 URLSearchParams 문자열로 변환 (빈 값 제외)
const buildParams = (filters: Record<string, string | number>): string => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== "" && value !== null && value !== undefined) {
      params.set(key, String(value));
    }
  });
  return params.toString();
};

/**
 * 리소스 CRUD 범용 훅
 *
 * - list  : 목록 조회 (필터 + 서버사이드 페이지네이션)
 * - detail: 단건 조회 (detailId 있을 때만 호출)
 * - create: 등록 mutation
 * - update: 수정 mutation  { id, data }
 * - remove: 삭제 mutation  id
 *
 * @example
 * const { list, detail, update } = useCrudResource<Order, OrderFilters>(
 *   "orders", filters, selectedOrderId
 * );
 */
export function useCrudResource<
  T,
  F extends Record<string, string | number> = Record<string, string | number>,
>(resource: string, filters: F, detailId: string | null = null) {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: [resource] });

  // 목록 조회
  const list = useQuery<PaginatedResponse<T>>({
    queryKey: [resource, "list", filters],
    queryFn: () => api.get(`/api/${resource}?${buildParams(filters)}`),
    placeholderData: (prev) => prev,
  });

  // 단건 조회 (detailId 없으면 비활성)
  const detail = useQuery<T>({
    queryKey: [resource, "detail", detailId],
    queryFn: () => api.get(`/api/${resource}/${detailId}`),
    enabled: !!detailId,
  });

  // 등록
  const create = useMutation<T, Error, Partial<T>>({
    mutationFn: (data) => api.post(`/api/${resource}`, data),
    onSuccess: invalidate,
  });

  // 수정
  const update = useMutation<T, Error, { id: string; data: Partial<T> }>({
    mutationFn: ({ id, data }) => api.patch(`/api/${resource}/${id}`, data),
    onSuccess: invalidate,
  });

  // 삭제
  const remove = useMutation<void, Error, string>({
    mutationFn: (id) => api.delete(`/api/${resource}/${id}`),
    onSuccess: invalidate,
  });

  return { list, detail, create, update, remove };
}
