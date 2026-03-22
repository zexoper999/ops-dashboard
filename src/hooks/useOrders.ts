import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import type { Order, PaginatedResponse } from "@/types";

export interface OrderFilters {
  page: number;
  status: string;
  search: string;
}

// API 호출 함수
const fetchOrders = (filters: OrderFilters): Promise<PaginatedResponse<Order>> => {
  const params = new URLSearchParams();
  params.set("page", String(filters.page));
  if (filters.status) params.set("status", filters.status);
  if (filters.search) params.set("search", filters.search);
  return api.get(`/api/orders?${params.toString()}`);
};

const fetchOrder = (id: string): Promise<Order> => api.get(`/api/orders/${id}`);

const updateOrderStatus = ({
  id,
  status,
}: {
  id: string;
  status: Order["status"];
}): Promise<Order> => api.patch(`/api/orders/${id}`, { status });

// 주문 목록 훅 (필터 + 서버사이드 페이지네이션)
export const useOrders = (filters: OrderFilters) => {
  return useQuery({
    queryKey: ["orders", filters],
    queryFn: () => fetchOrders(filters),
    placeholderData: (prev) => prev, // 페이지/필터 전환 시 깜빡임 방지
  });
};

// 주문 단건 훅 (패널 오픈 시에만 호출)
export const useOrder = (id: string | null) => {
  return useQuery({
    queryKey: ["order", id],
    queryFn: () => fetchOrder(id!),
    enabled: !!id,
  });
};

// 주문 상태 변경 훅
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: () => {
      // 목록 + 단건 캐시 동시 무효화
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order"] });
    },
  });
};
