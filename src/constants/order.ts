import type { Order } from "@/types";
import type { BadgeConfig } from "@/components/common/DataTable";

export const ORDER_STATUS_OPTIONS: { label: string; value: Order["status"] | "" }[] = [
  { label: "전체 상태", value: "" },
  { label: "대기", value: "PENDING" },
  { label: "확인", value: "CONFIRMED" },
  { label: "완료", value: "COMPLETED" },
  { label: "취소", value: "CANCELLED" },
];

// badge 타입 렌더러가 참조하는 통합 맵 (label + className + dot)
export const ORDER_BADGE_MAP: Record<Order["status"], BadgeConfig> = {
  PENDING:   { label: "대기", className: "bg-amber-50 text-amber-700",   dot: "bg-amber-400" },
  CONFIRMED: { label: "확인", className: "bg-blue-50 text-blue-600",     dot: "bg-blue-500" },
  COMPLETED: { label: "완료", className: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
  CANCELLED: { label: "취소", className: "bg-red-50 text-red-600",       dot: "bg-red-500" },
};

// ERP 비즈니스 룰: 상태별 전환 가능한 다음 상태
export const STATUS_TRANSITIONS: Record<Order["status"], Order["status"][]> = {
  PENDING:   ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
};
