import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useCrudResource } from "@/hooks/useCrudResource";
import { DataTable, type ColDef } from "@/components/common/DataTable";
import { useMemberStore } from "@/stores/memberStore";
import SlidePanel from "@/components/common/SlidePanel";
import MemberForm from "@/components/common/MemberForm";
import {
  MEMBER_GRADE_OPTIONS,
  MEMBER_STATUS_OPTIONS,
  MEMBER_GRADE_BADGE_MAP,
  MEMBER_STATUS_BADGE_MAP,
} from "@/constants/member";
import type { Member } from "@/types";

type MemberFilters = {
  page: number;
  search: string;
  grade: string;
  status: string;
};

// 컬럼 정의: ColDef 배열 하나로 TanStack Table 보일러플레이트 대체
const BASE_COLUMNS: ColDef<Member>[] = [
  { key: "name",             header: "이름",    type: "text" },
  { key: "email",            header: "이메일",  type: "text" },
  { key: "phone",            header: "연락처",  type: "text" },
  { key: "grade",            header: "등급",    type: "badge", badgeMap: MEMBER_GRADE_BADGE_MAP },
  { key: "status",           header: "상태",    type: "badge", badgeMap: MEMBER_STATUS_BADGE_MAP },
  { key: "totalOrderAmount", header: "총 구매액", type: "currency" },
  { key: "totalOrderCount",  header: "구매횟수", type: "number", suffix: "회" },
];

export default function Members() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo<MemberFilters>(
    () => ({
      page:   Number(searchParams.get("page")) || 1,
      search: searchParams.get("search") || "",
      grade:  searchParams.get("grade") || "",
      status: searchParams.get("status") || "",
    }),
    [searchParams],
  );

  const updateFilter = useCallback(
    (key: string, value: string) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set(key, value);
        else next.delete(key);
        if (key !== "page") next.set("page", "1");
        return next;
      });
    },
    [setSearchParams],
  );

  const resetFilters = useCallback(() => setSearchParams({}), [setSearchParams]);

  const { selectedMemberId, isPanelOpen, openPanel, closePanel } = useMemberStore();

  // useCrudResource 하나로 목록·단건·뮤테이션 모두 처리
  const { list, detail, update } = useCrudResource<Member, MemberFilters>(
    "members",
    filters,
    selectedMemberId,
  );

  const columns = useMemo<ColDef<Member>[]>(
    () => [
      ...BASE_COLUMNS,
      {
        key: "id",
        header: "상세",
        type: "actions",
        onAction: (row) => openPanel(row.id),
      },
    ],
    [openPanel],
  );

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">회원 관리</h2>
        <p className="text-sm text-gray-400 mt-1">총 {list.data?.total ?? 0}명</p>
      </div>

      {/* 복합 필터 */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="이름 / 이메일 / 연락처 검색"
          value={filters.search}
          onChange={(e) => updateFilter("search", e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-60 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <select
          value={filters.grade}
          onChange={(e) => updateFilter("grade", e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {MEMBER_GRADE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <select
          value={filters.status}
          onChange={(e) => updateFilter("status", e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {MEMBER_STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {(filters.search || filters.grade || filters.status) && (
          <button
            onClick={resetFilters}
            className="px-3 py-2 text-sm text-gray-500 hover:text-red-500 transition-colors"
          >
            ✕ 초기화
          </button>
        )}
      </div>

      {/* DataTable이 TanStack Table + 페이지네이션 + 상태 처리를 모두 담당 */}
      <DataTable<Member>
        columns={columns}
        data={list.data?.data}
        isLoading={list.isLoading}
        isError={list.isError}
        page={filters.page}
        totalPages={list.data?.totalPages ?? 1}
        total={list.data?.total ?? 0}
        onPageChange={(p) => updateFilter("page", String(p))}
        emptyMessage="검색 조건에 맞는 회원이 없습니다."
      />

      <SlidePanel isOpen={isPanelOpen} onClose={closePanel} title="회원 상세 / 수정">
        {detail.data && (
          <MemberForm
            member={detail.data}
            onUpdate={(data) =>
              update.mutate(
                { id: detail.data!.id, data },
                { onSuccess: closePanel },
              )
            }
            isPending={update.isPending}
            onClose={closePanel}
          />
        )}
      </SlidePanel>
    </div>
  );
}
