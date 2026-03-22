import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { useOrders, useOrder, useUpdateOrderStatus } from "@/hooks/useOrders";
import { useOrderStore } from "@/stores/orderStore";
import SlidePanel from "@/components/common/SlidePanel";
import {
  ORDER_STATUS_OPTIONS,
  ORDER_STATUS_LABEL,
  ORDER_STATUS_STYLE,
  ORDER_STATUS_DOT,
  STATUS_TRANSITIONS,
} from "@/constants/order";
import { formatDate, formatAmount } from "@/utils/format";
import type { Order } from "@/types";

const columnHelper = createColumnHelper<Order>();

export default function Orders() {
  // 필터 상태를 URL 쿼리스트링으로 관리 (북마크·공유 가능)
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(
    () => ({
      page: Number(searchParams.get("page")) || 1,
      status: searchParams.get("status") || "",
      search: searchParams.get("search") || "",
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
        if (key !== "page") next.set("page", "1");
        return next;
      });
    },
    [setSearchParams],
  );

  const resetFilters = useCallback(() => {
    setSearchParams({});
  }, [setSearchParams]);

  // React Query로 데이터 패칭 (필터 변경 시 자동 재요청)
  const { data, isLoading, isError } = useOrders(filters);

  // Zustand로 슬라이드 패널 상태 관리
  const { openPanel, closePanel, isPanelOpen, selectedOrderId } =
    useOrderStore();

  // 선택된 주문 단건 조회 (패널 열릴 때만 요청)
  const { data: selectedOrder } = useOrder(selectedOrderId);

  // TanStack Table 컬럼 정의
  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: "주문 ID",
        cell: (info) => (
          <span className="font-mono text-xs text-gray-400">
            #{info.getValue().slice(0, 8).toUpperCase()}
          </span>
        ),
      }),
      columnHelper.accessor("customerName", {
        header: "고객명",
        cell: (info) => (
          <span className="font-medium text-gray-900">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("amount", {
        header: "결제금액",
        cell: (info) => (
          <span className="font-semibold text-gray-900">
            {formatAmount(info.getValue())}
          </span>
        ),
      }),
      columnHelper.accessor("status", {
        header: "상태",
        cell: (info) => {
          const status = info.getValue();
          return (
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${ORDER_STATUS_STYLE[status]}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${ORDER_STATUS_DOT[status]}`}
              />
              {ORDER_STATUS_LABEL[status]}
            </span>
          );
        },
      }),
      columnHelper.accessor("createdAt", {
        header: "주문일시",
        cell: (info) => (
          <span className="text-sm text-gray-500">
            {formatDate(info.getValue())}
          </span>
        ),
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
    manualPagination: true,
    rowCount: data?.total ?? 0,
  });

  return (
    <div className="space-y-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">주문 관리</h2>
          <p className="text-sm text-gray-400 mt-1">총 {data?.total ?? 0}건</p>
        </div>
      </div>

      {/* 필터 영역 */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-wrap gap-3 items-center">
        {/* 고객명 검색 */}
        <input
          type="text"
          placeholder="고객명 검색"
          value={filters.search}
          onChange={(e) => updateFilter("search", e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-52 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* 상태 필터 */}
        <select
          value={filters.status}
          onChange={(e) => updateFilter("status", e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {ORDER_STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* 필터 초기화 */}
        {(filters.search || filters.status) && (
          <button
            onClick={resetFilters}
            className="px-3 py-2 text-sm text-gray-500 hover:text-red-500 transition-colors"
          >
            ✕ 초기화
          </button>
        )}
      </div>

      {/* TanStack Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
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
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="text-center py-14 text-gray-400 text-sm"
                  >
                    불러오는 중...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="text-center py-14 text-red-400 text-sm"
                  >
                    데이터를 불러오지 못했습니다.
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="text-center py-14 text-gray-400 text-sm"
                  >
                    검색 결과가 없습니다.
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
            {data?.total ?? 0}건 중 {(filters.page - 1) * 10 + 1}–
            {Math.min(filters.page * 10, data?.total ?? 0)}건
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => updateFilter("page", String(filters.page - 1))}
              disabled={filters.page <= 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              이전
            </button>
            <span className="px-3 py-1 text-sm text-gray-600">
              {filters.page} / {data?.totalPages ?? 1}
            </span>
            <button
              onClick={() => updateFilter("page", String(filters.page + 1))}
              disabled={filters.page >= (data?.totalPages ?? 1)}
              className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              다음
            </button>
          </div>
        </div>
      </div>

      {/* 주문 상세 슬라이드 패널 */}
      <SlidePanel
        isOpen={isPanelOpen}
        onClose={closePanel}
        title="주문 상세"
      >
        {selectedOrder && <OrderDetail order={selectedOrder} />}
      </SlidePanel>
    </div>
  );
}

// 주문 상세 + 상태 변경 패널
function OrderDetail({ order }: { order: Order }) {
  const { mutate: updateStatus, isPending } = useUpdateOrderStatus();
  const nextStatuses = STATUS_TRANSITIONS[order.status];

  const handleStatusChange = (status: Order["status"]) => {
    updateStatus({ id: order.id, status });
  };

  return (
    <div className="p-6 space-y-6">
      {/* 주문 기본 정보 */}
      <section className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
          주문 정보
        </h4>
        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
          <InfoRow label="주문 ID" value={`#${order.id.slice(0, 8).toUpperCase()}`} mono />
          <InfoRow label="고객명" value={order.customerName} />
          <InfoRow label="결제금액" value={formatAmount(order.amount)} />
          <InfoRow label="주문일시" value={formatDate(order.createdAt)} />
        </div>
      </section>

      {/* 현재 상태 */}
      <section className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
          현재 상태
        </h4>
        <span
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${ORDER_STATUS_STYLE[order.status]}`}
        >
          <span className={`w-2 h-2 rounded-full ${ORDER_STATUS_DOT[order.status]}`} />
          {ORDER_STATUS_LABEL[order.status]}
        </span>
      </section>

      {/* 상태 변경 (ERP 핵심 액션) */}
      {nextStatuses.length > 0 && (
        <section className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            상태 변경
          </h4>
          <div className="flex gap-2 flex-wrap">
            {nextStatuses.map((status) => (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                disabled={isPending}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all disabled:opacity-50 disabled:cursor-not-allowed
                  ${status === "CANCELLED"
                    ? "border-red-300 text-red-600 hover:bg-red-50"
                    : "border-blue-300 text-blue-600 hover:bg-blue-50"
                  }`}
              >
                {isPending ? "처리 중..." : `→ ${ORDER_STATUS_LABEL[status]}`}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400">
            완료 또는 취소된 주문은 상태를 변경할 수 없습니다.
          </p>
        </section>
      )}

      {nextStatuses.length === 0 && (
        <p className="text-sm text-gray-400 bg-gray-50 rounded-xl p-4 text-center">
          더 이상 상태를 변경할 수 없는 주문입니다.
        </p>
      )}
    </div>
  );
}

// 상세 패널 내 정보 행 컴포넌트
function InfoRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-gray-500">{label}</span>
      <span className={`font-medium text-gray-800 ${mono ? "font-mono text-xs" : ""}`}>
        {value}
      </span>
    </div>
  );
}
