import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { useMembers, useMember } from "@/hooks/useMembers";
import SlidePanel from "@/components/common/SlidePanel";
import MemberForm from "@/components/common/MemberForm";
import { useMemberStore } from "@/stores/memberStore";
import {
  MEMBER_GRADE_OPTIONS,
  MEMBER_STATUS_OPTIONS,
  GRADE_STYLE,
  STATUS_STYLE,
  STATUS_LABEL,
} from "@/constants/member";
import type { Member } from "@/types";

const columnHelper = createColumnHelper<Member>();

export default function Members() {
  // !! 필터 상태를 URL 쿼리스트링으로 관리
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(
    () => ({
      page: Number(searchParams.get("page")) || 1,
      search: searchParams.get("search") || "",
      grade: searchParams.get("grade") || "",
      status: searchParams.get("status") || "",
    }),
    [searchParams],
  );

  const updateFilter = useCallback(
    (key: string, value: string) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (value) {
          next.set(key, value);
        } else {
          next.delete(key);
        }
        // 필터 변경 시 페이지를 1로 리셋
        if (key !== "page") next.set("page", "1");
        return next;
      });
    },
    [setSearchParams],
  );

  const resetFilters = useCallback(() => {
    setSearchParams({});
  }, [setSearchParams]);

  // !! TanStack Query로 데이터 패칭 (필터 바뀌면 자동 재요청)
  const { data, isLoading, isError } = useMembers(filters);

  // !! Zustand로 패널 상태 관리
  const { openPanel, closePanel, isPanelOpen, selectedMemberId } =
    useMemberStore();

  // !! 선택된 회원 단건 조회 (id 있을 때만 요청)
  const { data: selectedMember } = useMember(selectedMemberId);

  // !! TanStack Table 컬럼 정의
  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: "이름",
        cell: (info) => (
          <span className="font-medium text-gray-900">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("email", {
        header: "이메일",
        cell: (info) => (
          <span className="text-gray-500 text-sm">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("phone", {
        header: "연락처",
      }),
      columnHelper.accessor("grade", {
        header: "등급",
        cell: (info) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${GRADE_STYLE[info.getValue()]}`}
          >
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("status", {
        header: "상태",
        cell: (info) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_STYLE[info.getValue()]}`}
          >
            {STATUS_LABEL[info.getValue()]}
          </span>
        ),
      }),
      columnHelper.accessor("totalOrderAmount", {
        header: "총 구매액",
        cell: (info) => (
          <span className="font-medium">
            {info.getValue().toLocaleString()}원
          </span>
        ),
      }),
      columnHelper.accessor("totalOrderCount", {
        header: "구매횟수",
        cell: (info) => <span>{info.getValue()}회</span>,
      }),
      columnHelper.display({
        id: "actions",
        header: "상세",
        cell: (info) => (
          <button
            onClick={() => openPanel(info.row.original.id)}
            className="px-3 py-1 text-sm text-blue-600 border border-blue-300 rounded hover:bg-blue-50 transition-colors"
          >
            상세보기
          </button>
        ),
      }),
    ],
    [openPanel],
  );

  const table = useReactTable({
    data: data?.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true, // 서버사이드 페이지네이션
    rowCount: data?.total ?? 0,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">회원 관리</h2>
        <span className="text-sm text-gray-500">총 {data?.total ?? 0}명</span>
      </div>

      {/* 복합 필터 영역 */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 flex flex-wrap gap-3 items-center">
        {/* 검색 */}
        <input
          type="text"
          placeholder="이름 / 이메일 / 연락처 검색"
          value={filters.search}
          onChange={(e) => updateFilter("search", e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-60 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* 등급 필터 */}
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

        {/* 상태 필터 */}
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

        {/* 필터 초기화 */}
        {(filters.search || filters.grade || filters.status) && (
          <button
            onClick={resetFilters}
            className="px-3 py-2 text-sm text-gray-500 hover:text-red-500 transition-colors"
          >
            ✕ 초기화
          </button>
        )}
      </div>

      {/* !! TanStack Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-gray-600 font-semibold whitespace-nowrap"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="text-center py-12 text-gray-400"
                  >
                    불러오는 중...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="text-center py-12 text-red-400"
                  >
                    데이터를 불러오지 못했습니다.
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="text-center py-12 text-gray-400"
                  >
                    검색 결과가 없습니다.
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3 whitespace-nowrap">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
          <span className="text-sm text-gray-500">
            {data?.total ?? 0}명 중 {(filters.page - 1) * 10 + 1} -{" "}
            {Math.min(filters.page * 10, data?.total ?? 0)}명
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => updateFilter("page", String(filters.page - 1))}
              disabled={filters.page <= 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              이전
            </button>
            <span className="px-3 py-1 text-sm text-gray-600">
              {filters.page} / {data?.totalPages ?? 1}
            </span>
            <button
              onClick={() => updateFilter("page", String(filters.page + 1))}
              disabled={filters.page >= (data?.totalPages ?? 1)}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              다음
            </button>
          </div>
        </div>
      </div>

      {/* !! 패널 렌더링 (선택된 회원이 있을 때만) */}
      <SlidePanel
        isOpen={isPanelOpen}
        onClose={closePanel}
        title="회원 상세 / 수정"
      >
        {selectedMember && <MemberForm member={selectedMember} />}
      </SlidePanel>
    </div>
  );
}
