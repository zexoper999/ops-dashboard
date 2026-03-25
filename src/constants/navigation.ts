import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Zap,
  // BookOpen,
  // Tv,
  Pill,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavItem = {
  path: string;
  label: string;
  icon: LucideIcon;
};

export const NAV_ITEMS: NavItem[] = [
  { path: "/", label: "대시보드", icon: LayoutDashboard },
  { path: "/orders", label: "주문 관리", icon: ShoppingCart },
  { path: "/members", label: "회원 관리", icon: Users },
  { path: "/error-simulator", label: "에러 시뮬레이터", icon: Zap },
  { path: "/drug-search", label: "약 성분·용도 검색", icon: Pill },
];
