export interface Order {
  id: string;
  customerName: string;
  amount: number;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  createdAt: string;
}

export type MemberGrade = "VIP" | "GOLD" | "SILVER" | "GENERAL";
export type MemberStatus = "ACTIVE" | "DORMANT" | "SUSPENDED";

export interface Member {
  id: string;
  // 기본 정보
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: "MALE" | "FEMALE";
  // 등급/상태
  grade: MemberGrade;
  status: MemberStatus;
  // 주소
  postcode: string;
  address: string;
  addressDetail: string;
  // 구매 통계
  totalOrderCount: number;
  totalOrderAmount: number;
  lastOrderDate: string;
  // 마케팅
  marketingAgree: boolean;
  smsAgree: boolean;
  emailAgree: boolean;
  // 메모
  memo: string;
  // 시스템
  createdAt: string;
  updatedAt: string;
}

// API 응답 공통 타입
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}
