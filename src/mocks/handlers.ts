import { http, HttpResponse } from "msw";
import { faker } from "@faker-js/faker";
import type { Order } from "@/types";

// fake data 50개 생성
const mockOrders: Order[] = Array.from({ length: 50 }).map(() => ({
  id: faker.string.uuid(),
  customerName: faker.person.fullName(),
  amount: faker.number.int({ min: 10000, max: 200000 }),
  status: faker.helpers.arrayElement([
    "PENDING",
    "CONFIRMED",
    "COMPLETED",
    "CANCELLED",
  ]),
  createdAt: faker.date.recent({ days: 30 }).toISOString(),
}));

export const handlers = [
  // 주문 목록 조회 API
  http.get("/api/orders", ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page")) || 1;
    const limit = 10;

    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedOrders = mockOrders.slice(start, end);

    return HttpResponse.json({
      data: paginatedOrders,
      total: mockOrders.length,
      page,
      totalPages: Math.ceil(mockOrders.length / limit),
    });
  }),

  // 의도적인 에러 발생 API (나중에 Error Simulator에서 사용)
  http.get("/api/error/500", () => {
    return new HttpResponse(null, {
      status: 500,
      statusText: "Internal Server Error",
    });
  }),
];
