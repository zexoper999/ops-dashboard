import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import type { Member, PaginatedResponse } from "@/types";

export interface MemberFilters {
  page: number;
  search: string;
  grade: string;
  status: string;
}

// API
const fetchMembers = (
  filters: MemberFilters,
): Promise<PaginatedResponse<Member>> => {
  const params = new URLSearchParams();
  params.set("page", String(filters.page));
  if (filters.search) params.set("search", filters.search);
  if (filters.grade) params.set("grade", filters.grade);
  if (filters.status) params.set("status", filters.status);
  return api.get(`/api/members?${params.toString()}`);
};

const fetchMember = (id: string): Promise<Member> =>
  api.get(`/api/members/${id}`);

const updateMember = ({
  id,
  data,
}: {
  id: string;
  data: Partial<Member>;
}): Promise<Member> => api.patch(`/api/members/${id}`, data);

// 회원 목록 훅
export const useMembers = (filters: MemberFilters) => {
  return useQuery({
    queryKey: ["members", filters], // 필터 전체가 캐싱 키 → 필터 바뀌면 자동 재요청
    queryFn: () => fetchMembers(filters),
    placeholderData: (prev) => prev, // 페이지 전환 시 이전 데이터 유지 (깜빡임 방지)
  });
};

// 회원 단건 훅
export const useMember = (id: string | null) => {
  return useQuery({
    queryKey: ["member", id],
    queryFn: () => fetchMember(id!),
    enabled: !!id, // id가 있을 때만 요청 (패널 열릴 때만 호출)
  });
};

// 회원 수정 훅
export const useUpdateMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMember,
    onSuccess: () => {
      // 수정 성공 시 목록 + 단건 캐시 동시 무효화
      queryClient.invalidateQueries({ queryKey: ["members"] });
      queryClient.invalidateQueries({ queryKey: ["member"] });
    },
  });
};
