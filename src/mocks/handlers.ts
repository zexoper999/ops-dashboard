import { http, HttpResponse } from "msw";
import { faker } from "@faker-js/faker";
import type { Order, Member, MemberGrade, MemberStatus } from "@/types";

// ── 한국어 이름 생성 ────────────────────────────────────────
const KR_LAST = [
  "김",
  "이",
  "박",
  "최",
  "정",
  "강",
  "조",
  "윤",
  "장",
  "임",
  "한",
  "오",
  "서",
  "신",
  "권",
];
const KR_FIRST = [
  "지수",
  "민준",
  "서연",
  "예준",
  "지원",
  "도윤",
  "수아",
  "주원",
  "하은",
  "지훈",
  "예은",
  "민서",
  "현준",
  "수민",
  "지아",
  "유준",
  "채원",
  "준혁",
  "소윤",
  "태양",
  "민지",
  "시우",
  "유나",
  "지호",
  "성민",
];
const KR_DOMAINS = [
  "naver.com",
  "kakao.com",
  "gmail.com",
  "daum.net",
  "hanmail.net",
];

const krName = () =>
  faker.helpers.arrayElement(KR_LAST) + faker.helpers.arrayElement(KR_FIRST);

const krEmail = (name: string) =>
  `${name.toLowerCase()}${faker.string.numeric(3)}@${faker.helpers.arrayElement(KR_DOMAINS)}`;

// ── 주문 목업 데이터 ────────────────────────────────────────
const mockOrders: Order[] = Array.from({ length: 50 }).map(() => {
  const name = krName();
  return {
    id: faker.string.uuid(),
    customerName: name,
    amount: faker.number.int({ min: 15000, max: 380000 }),
    status: faker.helpers.weightedArrayElement([
      { weight: 3, value: "PENDING" as const },
      { weight: 4, value: "CONFIRMED" as const },
      { weight: 5, value: "COMPLETED" as const },
      { weight: 2, value: "CANCELLED" as const },
    ]),
    createdAt: faker.date.recent({ days: 30 }).toISOString(),
  };
});

// ── 회원 목업 데이터 (1000명) ───────────────────────────────
const mockMembers: Member[] = Array.from({ length: 17265 }).map(() => {
  const name = krName();
  return {
    id: faker.string.uuid(),
    name,
    email: krEmail(name),
    phone: `010-${faker.string.numeric(4)}-${faker.string.numeric(4)}`,
    birthDate: faker.date
      .birthdate({ min: 20, max: 55, mode: "age" })
      .toISOString()
      .split("T")[0],
    gender: faker.helpers.arrayElement<"MALE" | "FEMALE">(["MALE", "FEMALE"]),
    grade: faker.helpers.weightedArrayElement([
      { weight: 10, value: "GENERAL" as MemberGrade },
      { weight: 4, value: "SILVER" as MemberGrade },
      { weight: 2, value: "GOLD" as MemberGrade },
      { weight: 1, value: "VIP" as MemberGrade },
    ]),
    status: faker.helpers.weightedArrayElement([
      { weight: 7, value: "ACTIVE" as MemberStatus },
      { weight: 2, value: "DORMANT" as MemberStatus },
      { weight: 1, value: "SUSPENDED" as MemberStatus },
    ]),
    postcode: faker.location.zipCode("####-###"),
    address: faker.location.streetAddress(),
    addressDetail: faker.location.secondaryAddress(),
    totalOrderCount: faker.number.int({ min: 0, max: 60 }),
    totalOrderAmount: faker.number.int({ min: 0, max: 6000000 }),
    lastOrderDate: faker.date.recent({ days: 90 }).toISOString(),
    marketingAgree: faker.datatype.boolean(),
    smsAgree: faker.datatype.boolean(),
    emailAgree: faker.datatype.boolean(),
    memo:
      faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.3 }) ??
      "",
    createdAt: faker.date.past({ years: 2 }).toISOString(),
    updatedAt: faker.date.recent({ days: 30 }).toISOString(),
  };
});

// ── 정렬 헬퍼 ────────────────────────────────────────────────
function sortMembers(
  list: Member[],
  sortBy: string,
  sortDir: string,
): Member[] {
  const dir = sortDir === "desc" ? -1 : 1;
  return [...list].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return dir * a.name.localeCompare(b.name);
      case "totalOrderAmount":
        return dir * (a.totalOrderAmount - b.totalOrderAmount);
      case "totalOrderCount":
        return dir * (a.totalOrderCount - b.totalOrderCount);
      case "createdAt":
        return (
          dir *
          (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        );
      default:
        return 0;
    }
  });
}

export const handlers = [
  // ── 주문 목록 ───────────────────────────────────────────────
  http.get("/api/orders", ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page")) || 1;
    const status = url.searchParams.get("status") || "";
    const search = url.searchParams.get("search") || "";
    const limit = 10;

    let filtered = mockOrders;
    if (status) filtered = filtered.filter((o) => o.status === status);
    if (search)
      filtered = filtered.filter((o) => o.customerName.includes(search));

    const start = (page - 1) * limit;
    return HttpResponse.json({
      data: filtered.slice(start, start + limit),
      total: filtered.length,
      page,
      totalPages: Math.ceil(filtered.length / limit),
    });
  }),

  // ── 주문 단건 ───────────────────────────────────────────────
  http.get("/api/orders/:id", ({ params }) => {
    const order = mockOrders.find((o) => o.id === params.id);
    if (!order) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(order);
  }),

  // ── 주문 상태 변경 ──────────────────────────────────────────
  http.patch("/api/orders/:id", async ({ params, request }) => {
    const body = (await request.json()) as Partial<Order>;
    const index = mockOrders.findIndex((o) => o.id === params.id);
    if (index === -1) return new HttpResponse(null, { status: 404 });
    mockOrders[index] = { ...mockOrders[index], ...body };
    return HttpResponse.json(mockOrders[index]);
  }),

  // ── 회원 통계 ───────────────────────────────────────────────
  http.get("/api/members/stats", () => {
    const now = new Date();
    const thisMonth = mockMembers.filter((m) => {
      const d = new Date(m.createdAt);
      return (
        d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
      );
    }).length;

    return HttpResponse.json({
      total: mockMembers.length,
      active: mockMembers.filter((m) => m.status === "ACTIVE").length,
      vipGold: mockMembers.filter(
        (m) => m.grade === "VIP" || m.grade === "GOLD",
      ).length,
      thisMonth,
    });
  }),

  // ── 회원 목록 (필터 + 정렬 + 페이지네이션) ─────────────────
  http.get("/api/members", ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page")) || 1;
    const limit = 10;
    const search = url.searchParams.get("search") || "";
    const grade = url.searchParams.get("grade") || "";
    const status = url.searchParams.get("status") || "";
    const sortBy = url.searchParams.get("sortBy") || "";
    const sortDir = url.searchParams.get("sortDir") || "asc";

    let filtered = mockMembers;
    if (search)
      filtered = filtered.filter(
        (m) =>
          m.name.includes(search) ||
          m.email.toLowerCase().includes(search.toLowerCase()) ||
          m.phone.includes(search),
      );
    if (grade) filtered = filtered.filter((m) => m.grade === grade);
    if (status) filtered = filtered.filter((m) => m.status === status);
    if (sortBy) filtered = sortMembers(filtered, sortBy, sortDir);

    const start = (page - 1) * limit;
    return HttpResponse.json({
      data: filtered.slice(start, start + limit),
      total: filtered.length,
      page,
      totalPages: Math.ceil(filtered.length / limit),
    });
  }),

  // ── 회원 등록 ───────────────────────────────────────────────
  http.post("/api/members", async ({ request }) => {
    const body = (await request.json()) as Partial<Member>;
    const newMember: Member = {
      id: faker.string.uuid(),
      name: body.name ?? "",
      email: body.email ?? "",
      phone: body.phone ?? "",
      grade: (body.grade as MemberGrade) ?? "GENERAL",
      status: "ACTIVE",
      birthDate: "",
      gender: "MALE",
      postcode: "",
      address: "",
      addressDetail: "",
      totalOrderCount: 0,
      totalOrderAmount: 0,
      lastOrderDate: new Date().toISOString(),
      marketingAgree: false,
      smsAgree: false,
      emailAgree: false,
      memo: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockMembers.unshift(newMember);
    return HttpResponse.json(newMember, { status: 201 });
  }),

  // ── 회원 단건 ───────────────────────────────────────────────
  http.get("/api/members/:id", ({ params }) => {
    const member = mockMembers.find((m) => m.id === params.id);
    if (!member) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(member);
  }),

  // ── 회원 수정 ───────────────────────────────────────────────
  http.patch("/api/members/:id", async ({ params, request }) => {
    const body = (await request.json()) as Partial<Member>;
    const index = mockMembers.findIndex((m) => m.id === params.id);
    if (index === -1) return new HttpResponse(null, { status: 404 });
    mockMembers[index] = {
      ...mockMembers[index],
      ...body,
      updatedAt: new Date().toISOString(),
    };
    return HttpResponse.json(mockMembers[index]);
  }),

  // ── 에러 시뮬레이션 ─────────────────────────────────────────
  http.get("/api/error/500", () => new HttpResponse(null, { status: 500 })),
];
