import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useCrudResource } from "@/hooks/useCrudResource";
import { DataTable, type ColDef } from "@/components/common/DataTable";
import { useOrderStore } from "@/stores/orderStore";
import SlidePanel from "@/components/common/SlidePanel";
import {
  ORDER_STATUS_OPTIONS,
  ORDER_BADGE_MAP,
  STATUS_TRANSITIONS,
} from "@/constants/order";
import { formatDate, formatAmount } from "@/utils/format";
import { maskName } from "@/utils/mask";
import type { Order } from "@/types";

type OrderFilters = { page: number; status: string; search: string };

// 컬럼 정의: ColDef 배열 하나로 TanStack Table 보일러플레이트 대체
const BASE_COLUMNS: ColDef<Order>[] = [
  { key: "id",           header: "주문 ID",  type: "mono" },
  { key: "customerName", header: "고객명", type: "text",
    render: (_v, row) => <span className="font-medium text-gray-900">{maskName(row.customerName)}</span> },
  { key: "amount",       header: "결제금액", type: "currency" },
  { key: "status",       header: "상태",     type: "badge", badgeMap: ORDER_BADGE_MAP },
  { key: "createdAt",    header: "주문일시", type: "date" },
];

export default function Orders() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo<OrderFilters>(
    () => ({
      page:   Number(searchParams.get("page")) || 1,
      status: searchParams.get("status") || "",
      search: searchParams.get("search") || "",
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

  const { selectedOrderId, isPanelOpen, openPanel, closePanel } = useOrderStore();

  // useCrudResource 하나로 목록·단건·뮤테이션 모두 처리
  const { list, detail, update } = useCrudResource<Order, OrderFilters>(
    "orders",
    filters,
    selectedOrderId,
  );

  // actions 컬럼은 openPanel 참조가 필요해 useMemo 안에서 생성
  const columns = useMemo<ColDef<Order>[]>(
    () => [
      ...BASE_COLUMNS,
      {
        key: "_actions",
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
        <h2 className="text-2xl font-bold text-gray-900">주문 관리</h2>
        <p className="text-sm text-gray-400 mt-1">총 {list.data?.total ?? 0}건</p>
      </div>

      {/* 필터 */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="고객명 검색"
          value={filters.search}
          onChange={(e) => updateFilter("search", e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-52 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
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
        {(filters.search || filters.status) && (
          <button
            onClick={resetFilters}
            className="px-3 py-2 text-sm text-gray-500 hover:text-red-500 transition-colors"
          >
            ✕ 초기화
          </button>
        )}
      </div>

      {/* DataTable이 TanStack Table + 페이지네이션 + 상태 처리를 모두 담당 */}
      <DataTable<Order>
        columns={columns}
        data={list.data?.data}
        isLoading={list.isLoading}
        isError={list.isError}
        page={filters.page}
        totalPages={list.data?.totalPages ?? 1}
        total={list.data?.total ?? 0}
        onPageChange={(p) => updateFilter("page", String(p))}
      />

      <SlidePanel isOpen={isPanelOpen} onClose={closePanel} title="주문 상세">
        {detail.data && (
          <OrderDetail
            order={detail.data}
            onStatusChange={(id, status) =>
              update.mutate({ id, data: { status } })
            }
            isPending={update.isPending}
          />
        )}
      </SlidePanel>
    </div>
  );
}

// ── 주문 상세 + 상태 변경 패널 ────────────────────────────

function OrderDetail({
  order,
  onStatusChange,
  isPending,
}: {
  order: Order;
  onStatusChange: (id: string, status: Order["status"]) => void;
  isPending: boolean;
}) {
  const { label, className, dot } = ORDER_BADGE_MAP[order.status];
  const nextStatuses = STATUS_TRANSITIONS[order.status];

  return (
    <div className="p-6 space-y-6">
      <section className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
          주문 정보
        </h4>
        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
          <InfoRow label="주문 ID" value={`#${order.id.slice(0, 8).toUpperCase()}`} mono />
          <InfoRow label="고객명"  value={maskName(order.customerName)} />
          <InfoRow label="결제금액" value={formatAmount(order.amount)} />
          <InfoRow label="주문일시" value={formatDate(order.createdAt)} />
        </div>
      </section>

      <section className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
          현재 상태
        </h4>
        <span
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${className}`}
        >
          <span className={`w-2 h-2 rounded-full ${dot}`} />
          {label}
        </span>
      </section>

      {nextStatuses.length > 0 ? (
        <section className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            상태 변경
          </h4>
          <div className="flex gap-2 flex-wrap">
            {nextStatuses.map((status) => (
              <button
                key={status}
                onClick={() => onStatusChange(order.id, status)}
                disabled={isPending}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  status === "CANCELLED"
                    ? "border-red-300 text-red-600 hover:bg-red-50"
                    : "border-blue-300 text-blue-600 hover:bg-blue-50"
                }`}
              >
                {isPending ? "처리 중..." : `→ ${ORDER_BADGE_MAP[status].label}`}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400">
            완료 또는 취소된 주문은 상태를 변경할 수 없습니다.
          </p>
        </section>
      ) : (
        <p className="text-sm text-gray-400 bg-gray-50 rounded-xl p-4 text-center">
          더 이상 상태를 변경할 수 없는 주문입니다.
        </p>
      )}
    </div>
  );
}

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
