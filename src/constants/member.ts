import type { MemberGrade, MemberStatus } from "@/types";
import type { BadgeConfig } from "@/components/common/DataTable";

export const MEMBER_GRADE_OPTIONS: { label: string; value: MemberGrade | "" }[] = [
  { label: "전체 등급", value: "" },
  { label: "VIP", value: "VIP" },
  { label: "GOLD", value: "GOLD" },
  { label: "SILVER", value: "SILVER" },
  { label: "일반", value: "GENERAL" },
];

export const MEMBER_STATUS_OPTIONS: { label: string; value: MemberStatus | "" }[] = [
  { label: "전체 상태", value: "" },
  { label: "활성", value: "ACTIVE" },
  { label: "휴면", value: "DORMANT" },
  { label: "정지", value: "SUSPENDED" },
];

// badge 타입 렌더러가 참조하는 통합 맵
export const MEMBER_GRADE_BADGE_MAP: Record<MemberGrade, BadgeConfig> = {
  VIP:     { label: "VIP",  className: "bg-purple-100 text-purple-700" },
  GOLD:    { label: "GOLD", className: "bg-yellow-100 text-yellow-700" },
  SILVER:  { label: "SILVER", className: "bg-gray-100 text-gray-600" },
  GENERAL: { label: "일반", className: "bg-blue-50 text-blue-600" },
};

export const MEMBER_STATUS_BADGE_MAP: Record<MemberStatus, BadgeConfig> = {
  ACTIVE:    { label: "활성", className: "bg-green-100 text-green-700",  dot: "bg-green-500" },
  DORMANT:   { label: "휴면", className: "bg-yellow-100 text-yellow-700", dot: "bg-yellow-500" },
  SUSPENDED: { label: "정지", className: "bg-red-100 text-red-700",     dot: "bg-red-500" },
};
