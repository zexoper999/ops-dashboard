import type { Order } from "@/types";

export const ORDER_STATUS_OPTIONS: { label: string; value: Order["status"] | "" }[] = [
  { label: "전체 상태", value: "" },
  { label: "대기", value: "PENDING" },
  { label: "확인", value: "CONFIRMED" },
  { label: "완료", value: "COMPLETED" },
  { label: "취소", value: "CANCELLED" },
];

export const ORDER_STATUS_LABEL: Record<Order["status"], string> = {
  PENDING: "대기",
  CONFIRMED: "확인",
  COMPLETED: "완료",
  CANCELLED: "취소",
};

export const ORDER_STATUS_STYLE: Record<Order["status"], string> = {
  PENDING: "bg-amber-50 text-amber-700",
  CONFIRMED: "bg-blue-50 text-blue-600",
  COMPLETED: "bg-emerald-50 text-emerald-700",
  CANCELLED: "bg-red-50 text-red-600",
};

export const ORDER_STATUS_DOT: Record<Order["status"], string> = {
  PENDING: "bg-amber-400",
  CONFIRMED: "bg-blue-500",
  COMPLETED: "bg-emerald-500",
  CANCELLED: "bg-red-500",
};

// ERP 비즈니스 룰: 상태별 전환 가능한 다음 상태
export const STATUS_TRANSITIONS: Record<Order["status"], Order["status"][]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
};
