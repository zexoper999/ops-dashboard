import type { MemberGrade, MemberStatus } from "@/types";

export const MEMBER_GRADE_OPTIONS: {
  label: string;
  value: MemberGrade | "";
}[] = [
  { label: "전체 등급", value: "" },
  { label: "VIP", value: "VIP" },
  { label: "GOLD", value: "GOLD" },
  { label: "SILVER", value: "SILVER" },
  { label: "일반", value: "GENERAL" },
];

export const MEMBER_STATUS_OPTIONS: {
  label: string;
  value: MemberStatus | "";
}[] = [
  { label: "전체 상태", value: "" },
  { label: "활성", value: "ACTIVE" },
  { label: "휴면", value: "DORMANT" },
  { label: "정지", value: "SUSPENDED" },
];

export const GRADE_STYLE: Record<MemberGrade, string> = {
  VIP: "bg-purple-100 text-purple-700",
  GOLD: "bg-yellow-100 text-yellow-700",
  SILVER: "bg-gray-100 text-gray-600",
  GENERAL: "bg-blue-50 text-blue-600",
};

export const STATUS_STYLE: Record<MemberStatus, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  DORMANT: "bg-yellow-100 text-yellow-700",
  SUSPENDED: "bg-red-100 text-red-700",
};

export const STATUS_LABEL: Record<MemberStatus, string> = {
  ACTIVE: "활성",
  DORMANT: "휴면",
  SUSPENDED: "정지",
};
