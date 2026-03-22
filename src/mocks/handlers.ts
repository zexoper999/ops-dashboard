import { http, HttpResponse } from "msw";
import { faker } from "@faker-js/faker";
import type { Order, Member, MemberGrade, MemberStatus } from "@/types";

// 주문 목업 데이터
const mockOrders: Order[] = Array.from({ length: 50 }).map(() => ({
  id: faker.string.uuid(),
  customerName: faker.person.fullName(),
  amount: faker.number.int({ min: 10000, max: 200000 }),
  status: faker.helpers.arrayElement<Order["status"]>([
    "PENDING",
    "CONFIRMED",
    "COMPLETED",
    "CANCELLED",
  ]),
  createdAt: faker.date.recent({ days: 30 }).toISOString(),
}));

// 회원 목업 데이터 (100명)
const mockMembers: Member[] = Array.from({ length: 100 }).map(() => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  phone: `010-${faker.string.numeric(4)}-${faker.string.numeric(4)}`,
  birthDate: faker.date
    .birthdate({ min: 20, max: 60, mode: "age" })
    .toISOString()
    .split("T")[0],
  gender: faker.helpers.arrayElement<"MALE" | "FEMALE">(["MALE", "FEMALE"]),
  grade: faker.helpers.arrayElement<MemberGrade>([
    "VIP",
    "GOLD",
    "SILVER",
    "GENERAL",
  ]),
  status: faker.helpers.arrayElement<MemberStatus>([
    "ACTIVE",
    "DORMANT",
    "SUSPENDED",
  ]),
  postcode: faker.location.zipCode(),
  address: faker.location.streetAddress(),
  addressDetail: faker.location.secondaryAddress(),
  totalOrderCount: faker.number.int({ min: 0, max: 50 }),
  totalOrderAmount: faker.number.int({ min: 0, max: 5000000 }),
  lastOrderDate: faker.date.recent({ days: 90 }).toISOString(),
  marketingAgree: faker.datatype.boolean(),
  smsAgree: faker.datatype.boolean(),
  emailAgree: faker.datatype.boolean(),
  memo:
    faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.3 }) ??
    "",
  createdAt: faker.date.past({ years: 2 }).toISOString(),
  updatedAt: faker.date.recent({ days: 30 }).toISOString(),
}));

export const handlers = [
  // 주문 목록 (상태 필터 + 고객명 검색 + 페이지네이션)
  http.get("/api/orders", ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page")) || 1;
    const status = url.searchParams.get("status") || "";
    const search = url.searchParams.get("search") || "";
    const limit = 10;

    let filtered = mockOrders;
    if (status) filtered = filtered.filter((o) => o.status === status);
    if (search)
      filtered = filtered.filter((o) =>
        o.customerName.toLowerCase().includes(search.toLowerCase()),
      );

    const start = (page - 1) * limit;
    return HttpResponse.json({
      data: filtered.slice(start, start + limit),
      total: filtered.length,
      page,
      totalPages: Math.ceil(filtered.length / limit),
    });
  }),

  // 주문 단건 조회
  http.get("/api/orders/:id", ({ params }) => {
    const order = mockOrders.find((o) => o.id === params.id);
    if (!order) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(order);
  }),

  // 주문 상태 변경
  http.patch("/api/orders/:id", async ({ params, request }) => {
    const body = (await request.json()) as Partial<Order>;
    const index = mockOrders.findIndex((o) => o.id === params.id);
    if (index === -1) return new HttpResponse(null, { status: 404 });
    mockOrders[index] = { ...mockOrders[index], ...body };
    return HttpResponse.json(mockOrders[index]);
  }),

  // 회원 목록
  http.get("/api/members", ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page")) || 1;
    const limit = 10;
    const search = url.searchParams.get("search") || "";
    const grade = url.searchParams.get("grade") || "";
    const status = url.searchParams.get("status") || "";

    let filtered = mockMembers;
    if (search) {
      filtered = filtered.filter(
        (m) =>
          m.name.toLowerCase().includes(search.toLowerCase()) ||
          m.email.toLowerCase().includes(search.toLowerCase()) ||
          m.phone.includes(search),
      );
    }
    if (grade) filtered = filtered.filter((m) => m.grade === grade);
    if (status) filtered = filtered.filter((m) => m.status === status);

    const start = (page - 1) * limit;
    return HttpResponse.json({
      data: filtered.slice(start, start + limit),
      total: filtered.length,
      page,
      totalPages: Math.ceil(filtered.length / limit),
    });
  }),

  // 회원 단건 조회
  http.get("/api/members/:id", ({ params }) => {
    const member = mockMembers.find((m) => m.id === params.id);
    if (!member) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(member);
  }),

  // 회원 수정
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

  // 에러 시뮬레이션
  http.get("/api/error/500", () => {
    return new HttpResponse(null, { status: 500 });
  }),
];
