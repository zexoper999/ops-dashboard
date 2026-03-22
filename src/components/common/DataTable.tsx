import { useMemo, type ReactNode } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { formatDate, formatAmount } from "@/utils/format";

// ── 타입 정의 ──────────────────────────────────────────────

export interface BadgeConfig {
  label: string;
  className: string;
  dot?: string;
}

export type ColType =
  | "text"
  | "number"
  | "currency"
  | "date"
  | "mono"
  | "badge"
  | "actions";

export interface ColDef<T> {
  key: keyof T | string;
  header: string;
  type: ColType;
  /** badge 타입 전용: 값 → 라벨/스타일 매핑 */
  badgeMap?: Record<string, BadgeConfig>;
  /** actions 타입 전용 */
  onAction?: (row: T) => void;
  actionLabel?: string;
  /** number 타입 전용: 단위 접미사 */
  suffix?: string;
  /** type 기반 렌더링을 완전히 대체하는 커스텀 렌더러 */
  render?: (value: unknown, row: T) => ReactNode;
  /** 컬럼 헤더 클릭으로 정렬 가능 여부 */
  sortable?: boolean;
}

interface DataTableProps<T extends object> {
  columns: ColDef<T>[];
  data: T[] | undefined;
  isLoading?: boolean;
  isError?: boolean;
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
  emptyMessage?: string;
  /** 현재 정렬 중인 컬럼 key */
  sortKey?: string;
  /** 현재 정렬 방향 */
  sortDir?: "asc" | "desc";
  /** 헤더 클릭 시 호출 — 컬럼 key 전달 */
  onSort?: (key: string) => void;
}

// ── 정렬 아이콘 ────────────────────────────────────────────

function SortIcon({ active, dir }: { active: boolean; dir?: string }) {
  if (!active)
    return <ChevronsUpDown size={12} className="text-gray-300 group-hover:text-gray-400 transition-colors" />;
  return dir === "asc"
    ? <ChevronUp size={12} className="text-blue-500" />
    : <ChevronDown size={12} className="text-blue-500" />;
}

// ── 셀 렌더러 ──────────────────────────────────────────────

function renderCell<T>(col: ColDef<T>, value: unknown, row: T): ReactNode {
  // 커스텀 렌더러가 있으면 우선 사용
  if (col.render) return col.render(value, row);

  switch (col.type) {
    case "text":
      return <span className="text-gray-800">{String(value ?? "")}</span>;

    case "number":
      return (
        <span className="text-gray-800">
          {Number(value).toLocaleString()}
          {col.suffix && (
            <span className="text-gray-400 ml-0.5 text-xs">{col.suffix}</span>
          )}
        </span>
      );

    case "currency":
      return (
        <span className="font-semibold text-gray-900">
          {formatAmount(Number(value))}
        </span>
      );

    case "date":
      return (
        <span className="text-sm text-gray-500">
          {formatDate(String(value))}
        </span>
      );

    case "mono":
      return (
        <span className="font-mono text-xs text-gray-400">
          #{String(value).slice(0, 8).toUpperCase()}
        </span>
      );

    case "badge": {
      const config = col.badgeMap?.[String(value)];
      if (!config)
        return <span className="text-gray-500">{String(value)}</span>;
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.className}`}
        >
          {config.dot && (
            <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
          )}
          {config.label}
        </span>
      );
    }

    case "actions":
      return (
        <button
          onClick={() => col.onAction?.(row)}
          className="px-3 py-1 text-sm text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
        >
          {col.actionLabel ?? "상세보기"}
        </button>
      );

    default:
      return <span>{String(value ?? "")}</span>;
  }
}

// ── DataTable 컴포넌트 ──────────────────────────────────────

/**
 * 범용 데이터 테이블 컴포넌트 (TanStack Table 기반)
 *
 * ColDef 배열만 넘기면 타입별 셀 렌더링(badge, currency, date 등),
 * 커스텀 렌더러(render), 정렬 아이콘, 로딩/에러/빈 상태,
 * 페이지네이션을 자동 처리합니다.
 */
export function DataTable<T extends object>({
  columns: colDefs,
  data,
  isLoading,
  isError,
  page,
  totalPages,
  total,
  onPageChange,
  emptyMessage = "검색 결과가 없습니다.",
  sortKey,
  sortDir,
  onSort,
}: DataTableProps<T>) {
  // ColDef → TanStack ColumnDef 변환
  // index prefix로 동일 key 컬럼이 여러 개여도 ID 충돌 방지
  const columns = useMemo<ColumnDef<T>[]>(
    () =>
      colDefs.map((col, index) => ({
        id: `${index}_${String(col.key)}`,
        header: col.header,
        accessorFn: (row: T) =>
          col.type === "actions" ? null : (row[col.key as keyof T] as unknown),
        cell: (info) => renderCell(col, info.getValue(), info.row.original),
      })),
    [colDefs],
  );

  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    rowCount: total,
  });

  const start = total > 0 ? (page - 1) * 10 + 1 : 0;
  const end   = Math.min(page * 10, total);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header, hIndex) => {
                  const col = colDefs[hIndex];
                  const isSortActive = col?.sortable && sortKey === String(col.key);

                  return (
                    <th
                      key={header.id}
                      onClick={() => col?.sortable && onSort?.(String(col.key))}
                      className={`px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap group ${
                        col?.sortable ? "cursor-pointer select-none hover:bg-gray-100 transition-colors" : ""
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {col?.sortable && (
                          <SortIcon
                            active={!!isSortActive}
                            dir={isSortActive ? sortDir : undefined}
                          />
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              <tr>
                <td
                  colSpan={colDefs.length}
                  className="text-center py-14 text-gray-400 text-sm"
                >
                  불러오는 중...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td
                  colSpan={colDefs.length}
                  className="text-center py-14 text-red-400 text-sm"
                >
                  데이터를 불러오지 못했습니다.
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={colDefs.length}
                  className="text-center py-14 text-gray-400 text-sm"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-50/60 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-5 py-4 whitespace-nowrap">
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
      <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
        <span className="text-sm text-gray-500">
          {total > 0 ? `총 ${total}건 중 ${start}–${end}건` : "0건"}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            이전
          </button>
          <span className="px-3 py-1 text-sm text-gray-600">
            {page} / {totalPages || 1}
          </span>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= (totalPages || 1)}
            className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
}
