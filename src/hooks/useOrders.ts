import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import type { Order } from "@/types";

interface OrderResponse {
  data: Order[];
  total: number;
  page: number;
  totalPages: number;
}

// API 호출 함수
const fetchOrders = async (page: number): Promise<OrderResponse> => {
  return await api.get(`/api/orders?page=${page}`);
};

// React Query 커스텀 훅
export const useOrders = (page: number = 1) => {
  return useQuery({
    queryKey: ["orders", page], // 이 키(Key)를 기준으로 캐싱됨 (페이지 번호가 바뀌면 새로 요청)
    queryFn: () => fetchOrders(page),
    // staletime은 App.tsx에서 전역으로 설정
  });
};
