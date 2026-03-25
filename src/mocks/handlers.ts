import { http, HttpResponse } from "msw";
import { faker } from "@faker-js/faker";
import type { Order, Member, MemberGrade, MemberStatus } from "@/types";
import type { Drug } from "@/types/drug";

// ── 약 목업 DB ───────────────────────────────────────────────
const DRUG_DB: Drug[] = [
  {
    id: "d001",
    name: "타이레놀 정 500mg",
    company: "한국얀센(주)",
    ingredient: "아세트아미노펜 500mg",
    effect: "감기로 인한 발열 및 동통(통증), 두통, 신경통, 근육통, 월경통, 타박통의 완화",
    dosage: "성인 1회 1~2정, 1일 3~4회 필요시 복용. 4~6시간 간격으로 복용하며 1일 최대 8정을 초과하지 마십시오.",
    caution: "알코올을 3잔 이상 섭취하는 경우 복용 전 의사·약사와 상의하세요. 과량 복용 시 간 손상 위험이 있습니다.",
    category: "해열·진통·소염제",
    shape: "흰색 원형 정제",
  },
  {
    id: "d002",
    name: "타이레놀 이알 서방정 650mg",
    company: "한국얀센(주)",
    ingredient: "아세트아미노펜 650mg",
    effect: "감기로 인한 발열 및 동통(통증), 두통, 신경통, 근육통, 월경통, 타박통의 완화",
    dosage: "성인 1회 2정, 1일 3회 복용. 복용 간격은 8시간 이상이며, 1일 최대 6정을 초과하지 마십시오.",
    caution: "서방형 제제이므로 씹거나 부수지 말고 통째로 삼키세요. 간 질환자는 복용 전 의사와 상의하세요.",
    category: "해열·진통·소염제",
    shape: "흰색 장방형 서방정",
  },
  {
    id: "d003",
    name: "게보린 정",
    company: "삼일제약(주)",
    ingredient: "이소프로필안티피린 150mg, 아세트아미노펜 250mg, 무수카페인 50mg",
    effect: "두통, 치통, 생리통, 근육통, 관절통, 신경통, 발열 시의 해열",
    dosage: "성인 1회 1정, 1일 3회 식후 복용. 복용 간격은 4시간 이상.",
    caution: "졸음, 어지러움이 올 수 있으므로 운전·기계 조작 주의. 15세 미만 소아에게 투여하지 마십시오.",
    category: "해열·진통·소염제",
    shape: "흰색 타원형 정제",
  },
  {
    id: "d004",
    name: "판콜에이 내복액",
    company: "동화약품(주)",
    ingredient: "클로르페니라민말레산염 2mg, 아세트아미노펜 300mg, 구아이페네신 50mg",
    effect: "감기의 제증상(콧물, 코막힘, 재채기, 인후통, 기침, 가래, 오한, 발열, 두통, 관절통, 근육통)의 완화",
    dosage: "성인 1회 1병(15mL), 1일 3회 복용. 복용 간격은 4~6시간.",
    caution: "이 약은 졸음을 유발할 수 있습니다. 복용 중 음주를 피하고 운전·기계 조작에 주의하세요.",
    category: "종합감기약",
    shape: "액상(15mL/병)",
  },
  {
    id: "d005",
    name: "판콜 에스 내복액",
    company: "동화약품(주)",
    ingredient: "슈도에페드린염산염 30mg, 클로르페니라민말레산염 2mg, 아세트아미노펜 250mg",
    effect: "코막힘·콧물·재채기 등 감기 증상, 발열·두통·인후통의 완화",
    dosage: "성인 1회 1병(15mL), 1일 3회 복용.",
    caution: "고혈압, 갑상선 기능 항진증, 전립선 비대증 환자는 복용 전 의사와 상의하세요.",
    category: "종합감기약",
    shape: "액상(15mL/병)",
  },
  {
    id: "d006",
    name: "부루펜 정 200mg",
    company: "삼일제약(주)",
    ingredient: "이부프로펜 200mg",
    effect: "두통, 치통, 근육통, 월경통, 발열의 완화",
    dosage: "성인 1회 1~2정, 1일 3~4회 식후 복용.",
    caution: "위장 장애 발생 가능. 식후 복용을 권장합니다. 아스피린 알레르기 환자에게 금기.",
    category: "해열·진통·소염제",
    shape: "흰색 원형 정제",
  },
  {
    id: "d007",
    name: "이지엔6 프로 연질캡슐",
    company: "대웅제약(주)",
    ingredient: "이부프로펜 400mg",
    effect: "생리통, 두통, 치통, 근육통, 관절통의 완화",
    dosage: "성인 1회 1캡슐, 하루 3회 이하 식후 복용. 복용 간격 6~8시간.",
    caution: "소화성 궤양, 신장 기능 이상, 임신 후기(28주 이상) 환자 금기. 고령자 주의.",
    category: "해열·진통·소염제",
    shape: "붉은색 장방형 연질캡슐",
  },
  {
    id: "d008",
    name: "낙센 정 250mg",
    company: "한국유나이티드제약(주)",
    ingredient: "나프록센 250mg",
    effect: "류마티스 관절염, 골관절염, 통풍, 근골격계 통증, 월경통, 발열의 완화",
    dosage: "성인 1회 1~2정, 1일 2회 아침·저녁 식후 복용.",
    caution: "위장관 출혈 이력이 있는 환자, 임산부 주의. 아스피린과 병용 주의.",
    category: "해열·진통·소염제",
    shape: "흰색 원형 정제",
  },
  {
    id: "d009",
    name: "베아제 정",
    company: "(주)대웅제약",
    ingredient: "판크레아틴 394.4mg, 디아스타제 30mg",
    effect: "소화 불량, 식체(소화 장애), 위부팽만감, 과식",
    dosage: "성인 1회 1~2정, 1일 3회 식후 즉시 복용.",
    caution: "급성 췌장염 환자에게 금기. 돼지 유래 성분 포함(종교적 고려 필요).",
    category: "소화제",
    shape: "연갈색 원형 정제",
  },
  {
    id: "d010",
    name: "훼스탈 플러스 정",
    company: "한독(주)",
    ingredient: "판크레아틴(소화효소혼합물) 197.8mg, 디메티콘 50mg",
    effect: "소화 불량, 식욕 감퇴, 위부 팽만감, 가스 참",
    dosage: "성인 1회 2정, 1일 3회 식후 복용.",
    caution: "급성 췌장염, 만성 췌장염 급성기 환자 금기.",
    category: "소화제",
    shape: "갈색 원형 코팅정",
  },
  {
    id: "d011",
    name: "에스오메프라졸 마그네슘 삼수화물 캡슐 20mg",
    company: "아스트라제네카",
    ingredient: "에스오메프라졸마그네슘삼수화물 20mg",
    effect: "위식도역류질환(GERD) 치료 및 예방, 위궤양, 십이지장궤양",
    dosage: "성인 1일 1회 1캡슐, 식전 복용. 치료 기간은 의사 지시에 따름.",
    caution: "장기 복용 시 마그네슘 수치 저하 가능. 아타자나비르·넬피나비르와 병용 금기.",
    category: "위장관용제",
    shape: "불투명 보라색/회색 캡슐",
  },
  {
    id: "d012",
    name: "가스모틴 정 5mg",
    company: "대웅제약(주)",
    ingredient: "모사프리드구연산염이수화물 5mg",
    effect: "위장 운동 기능 개선, 만성 위염으로 인한 소화 불량 증상(속쓰림, 오심, 구토, 복부 팽만감)",
    dosage: "성인 1회 1정, 1일 3회 식전 30분에 복용.",
    caution: "소화관 출혈·기계적 장폐색 환자 금기. 신장 기능 저하 환자 주의.",
    category: "위장관용제",
    shape: "흰색 원형 정제",
  },
  {
    id: "d013",
    name: "지르텍 정 10mg",
    company: "한국UCB(주)",
    ingredient: "세티리진염산염 10mg",
    effect: "알레르기 비염(꽃가루, 집먼지진드기), 두드러기, 가려움증의 완화",
    dosage: "성인 1일 1회 1정 취침 전 복용. 고령자 또는 신장 기능 저하 시 0.5정.",
    caution: "졸음 유발 가능. 알코올과 병용 시 진정 효과 증가. 임부·수유부 주의.",
    category: "항히스타민제",
    shape: "흰색 타원형 필름코팅정",
  },
  {
    id: "d014",
    name: "클라리틴 정 10mg",
    company: "바이엘코리아(주)",
    ingredient: "로라타딘 10mg",
    effect: "알레르기 비염(재채기, 콧물, 코막힘), 두드러기, 피부 가려움증",
    dosage: "성인 1일 1회 1정 복용. 음식과 관계없이 복용 가능.",
    caution: "비졸음성 항히스타민제이나 드물게 졸음 발생 가능. 간 기능 이상 환자 주의.",
    category: "항히스타민제",
    shape: "흰색 원형 정제",
  },
  {
    id: "d015",
    name: "무코스타 정 100mg",
    company: "한국오츠카제약(주)",
    ingredient: "레바미피드 100mg",
    effect: "위궤양, 위염으로 인한 위점막 병변의 개선",
    dosage: "성인 1회 1정, 1일 3회 아침·저녁·취침 전 복용.",
    caution: "임부·수유부 주의. 드물게 황달, 간 기능 이상 보고.",
    category: "위장관용제",
    shape: "흰색 원형 정제",
  },
  {
    id: "d016",
    name: "마그밀 정 500mg",
    company: "삼남제약(주)",
    ingredient: "산화마그네슘 500mg",
    effect: "변비의 완화, 위산 과다·속쓰림·위부 불쾌감에 대한 제산",
    dosage: "성인 1회 1~2정, 1일 3회 식전 또는 취침 전 복용.",
    caution: "신장 기능 저하 환자 장기 복용 금지. 테트라사이클린계 항생제와 동시 복용 피함.",
    category: "완하제·제산제",
    shape: "흰색 원형 정제",
  },
  {
    id: "d017",
    name: "아스피린 프로텍트 정 100mg",
    company: "바이엘코리아(주)",
    ingredient: "아세틸살리실산 100mg",
    effect: "심근경색·뇌졸중 재발 방지(항혈전 목적), 불안정형 협심증 치료",
    dosage: "성인 1일 1회 1정, 식후 물과 함께 통째로 삼킴.",
    caution: "소화성 궤양 환자, 출혈성 질환 환자 금기. 수술 전 최소 7일 전에 복용 중단.",
    category: "항혈전제",
    shape: "황색 원형 장용정",
  },
  {
    id: "d018",
    name: "세파클러 캡슐 250mg",
    company: "한미약품(주)",
    ingredient: "세파클러 250mg",
    effect: "상·하기도 감염, 요로 감염, 피부·연조직 감염 등 세균 감염 치료",
    dosage: "성인 1회 1캡슐, 1일 3회 복용. 중증 감염 시 1일 4g까지 증량 가능.",
    caution: "페니실린계 항생제 알레르기 환자 주의(교차 반응 가능). 처방 없이 임의 복용 금지.",
    category: "항생제",
    shape: "분홍색 불투명 캡슐",
  },
  {
    id: "d019",
    name: "지노베이 정 500mg",
    company: "동아제약(주)",
    ingredient: "레보플록사신 500mg",
    effect: "폐렴, 급성 부비동염, 요로 감염, 피부·연조직 감염 치료",
    dosage: "성인 1일 1회 1정 복용. 복용 중 수분을 충분히 섭취하세요.",
    caution: "퀴놀론계 항생제. 18세 미만 성장기 환자, 임부·수유부 원칙적 금기. 일광 노출 주의.",
    category: "항생제",
    shape: "주황색 장방형 필름코팅정",
  },
  {
    id: "d020",
    name: "리피토 정 10mg",
    company: "한국화이자제약(주)",
    ingredient: "아토르바스타틴칼슘삼수화물 10mg",
    effect: "고콜레스테롤혈증, 혼합형 이상지질혈증, 심혈관 질환 위험 감소",
    dosage: "성인 1일 1회 1정, 식사와 관계없이 복용.",
    caution: "근육통·근육 약화 발생 시 즉시 중단. 임부·수유부 금기. 자몽 주스와 병용 주의.",
    category: "고지혈증치료제",
    shape: "흰색 타원형 필름코팅정",
  },
  {
    id: "d021",
    name: "크레스토 정 10mg",
    company: "아스트라제네카",
    ingredient: "로수바스타틴칼슘 10mg",
    effect: "원발성 고콜레스테롤혈증, 혼합형 이상지질혈증, 죽상동맥경화 예방",
    dosage: "성인 1일 1회 1정, 식사와 무관하게 복용.",
    caution: "근육병증 위험. 음주 자제 권장. 임부·수유부 금기. 신장 기능 저하 환자 주의.",
    category: "고지혈증치료제",
    shape: "분홍색 원형 필름코팅정",
  },
  {
    id: "d022",
    name: "포카민 정",
    company: "(주)유한양행",
    ingredient: "엽산 0.4mg",
    effect: "엽산 결핍 예방 및 치료, 임신 초기 신경관 결손 예방",
    dosage: "임신 전 1개월부터 임신 3개월까지 1일 1정 복용.",
    caution: "비타민 B12 결핍을 마스킹할 수 있으므로 악성 빈혈 진단 시 주의.",
    category: "비타민·영양제",
    shape: "연황색 원형 정제",
  },
  {
    id: "d023",
    name: "아로나민 골드 정",
    company: "일동제약(주)",
    ingredient: "푸르술티아민 50mg, 리보플라빈 5mg, 피리독신염산염 10mg, 니코틴산아미드 25mg, 판토텐산칼슘 10mg",
    effect: "비타민 B1 결핍 예방, 신경통, 근육통, 피로 회복",
    dosage: "성인 1회 1~2정, 1일 1~3회 식후 복용.",
    caution: "이 약은 노란색 소변이 나올 수 있습니다(리보플라빈에 의한 정상 반응).",
    category: "비타민·영양제",
    shape: "황색 원형 당의정",
  },
  {
    id: "d024",
    name: "임팩타민 프리미엄 정",
    company: "(주)대웅제약",
    ingredient: "벤포티아민(비타민B1유도체) 200mg, 피리독신염산염(B6) 50mg, 메코발라민(B12) 1500μg",
    effect: "당뇨병성 신경 장애, 말초 신경염, 신경통",
    dosage: "성인 1회 1정, 1일 1~3회 식후 복용.",
    caution: "의사 처방 없이 장기 고용량 복용 주의. 피리독신 과잉 시 말초 신경 손상 가능.",
    category: "비타민·영양제",
    shape: "연주황색 타원형 정제",
  },
  {
    id: "d025",
    name: "메트포르민 정 500mg",
    company: "보령제약(주)",
    ingredient: "메트포르민염산염 500mg",
    effect: "제2형 당뇨병의 혈당 조절",
    dosage: "성인 초기 1일 1~2회 500mg, 식사와 함께 복용. 용량은 의사 지시에 따라 조절.",
    caution: "신장 기능 저하(eGFR <30) 환자 금기. 조영제 사용 전 48시간 복용 중단.",
    category: "혈당강하제",
    shape: "흰색 원형 정제",
  },
];

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

  // ── 약 검색 ─────────────────────────────────────────────────
  http.get("/api/drug-search", ({ request }) => {
    const url = new URL(request.url);
    const q = (url.searchParams.get("q") ?? "").trim();
    const mode = url.searchParams.get("mode") ?? "name";

    if (!q) return HttpResponse.json({ results: [], total: 0 });

    const results = DRUG_DB.filter((d) =>
      mode === "ingredient"
        ? d.ingredient.includes(q)
        : d.name.includes(q),
    );

    return HttpResponse.json({ results, total: results.length });
  }),

  // ── 에러 시뮬레이션 ─────────────────────────────────────────
  http.get("/api/error/500", () => new HttpResponse(null, { status: 500 })),
];
