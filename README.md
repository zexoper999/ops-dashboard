# OPS Dashboard

ERP·CRM 어드민 환경에서 반복되는 CRUD 보일러플레이트를 **제네릭 훅과 범용 컴포넌트**로 추상화한 React+TypeScript+Vercel 프로젝트입니다.

---

## 기술 스택

| 분류              | 라이브러리                     |
| ----------------- | ------------------------------ |
| Framework         | React 18, TypeScript 5, Vite 8 |
| Routing           | React Router v7                |
| Server State      | TanStack Query v5              |
| Client State      | Zustand v5                     |
| Table             | TanStack Table v8              |
| Form / Validation | React Hook Form v7, Zod v4     |
| Chart             | Recharts v3                    |
| Styling           | Tailwind CSS v4                |
| Mock API          | MSW v2, Faker.js               |

---

## 아키텍처

### `useCrudResource<T>` — 범용 CRUD 훅

리소스 이름만 바꾸면 목록·단건·등록·수정·삭제를 모두 처리합니다.

```ts
// 기존: 리소스마다 useOrders, useMembers 개별 작성 (반복)
// 개선: 하나의 제네릭 훅으로 통일

const { list, detail, create, update, remove } = useCrudResource<
  Order,
  OrderFilters
>("orders", filters, selectedId);
```

- `list.data` → 페이지네이션 포함 목록 (`PaginatedResponse<T>`)
- `detail.data` → 단건 (detailId 있을 때만 호출, `enabled: !!id`)
- `create / update / remove` → mutation + 캐시 자동 무효화
- 필터 객체를 `URLSearchParams`로 직렬화해 API 호출

### `DataTable<T>` — 범용 테이블 컴포넌트

TanStack Table을 내부에 감추고, `ColDef` 배열만 넘기면 완성됩니다.

```ts
const columns: ColDef<Member>[] = [
  { key: "name", header: "회원", type: "text", render: avatarCell },
  {
    key: "grade",
    header: "등급",
    type: "badge",
    badgeMap: MEMBER_GRADE_BADGE_MAP,
  },
  { key: "amount", header: "구매액", type: "currency", sortable: true },
  { key: "_actions", header: "상세", type: "actions", onAction: openPanel },
];
```

| `type`        | 렌더링                                |
| ------------- | ------------------------------------- |
| `text`        | 일반 문자열                           |
| `currency`    | `toLocaleString()원`                  |
| `date`        | `formatDate()` 포맷                   |
| `mono`        | `#UUID` 앞 8자리                      |
| `badge`       | `badgeMap` 기반 라벨 + 색상           |
| `number`      | 숫자 + `suffix` (예: "회")            |
| `actions`     | 커스텀 버튼                           |
| `render` prop | 위 타입을 모두 대체하는 커스텀 렌더러 |

**리팩토링 결과**: Orders 387줄 → 155줄 / Members 307줄 → 120줄

### URL 기반 필터 상태

검색·필터·정렬·페이지를 `useSearchParams`로 URL에 저장합니다.  
새로고침 후에도 상태가 유지되며, 북마크와 공유가 가능합니다.

```
/members?search=김&grade=VIP&sortBy=totalOrderAmount&sortDir=desc&page=2
```

---

## 주요 기능

### 회원 관리 (CRM)

- 통계 카드 — 실시간 `/api/members/stats` 조회 (전체·활성·VIP·이번달 신규)
- 복합 필터 — 이름/이메일/연락처 통합 검색 + 등급·상태 셀렉트
- 서버사이드 정렬 — 구매액·횟수·가입일 컬럼 클릭으로 토글 (↑↓ 아이콘)
- 회원 등록 — Zod 스키마 기반 Slide Panel 폼 + POST API 연동
- 회원 수정 — React Hook Form + 변경감지(`isDirty`) + PATCH 연동

### 주문 관리 (ERP)

- 상태 필터 + 고객명 검색
- ERP 비즈니스 룰 기반 상태 전환 (`STATUS_TRANSITIONS`)
  - `PENDING → CONFIRMED | CANCELLED`
  - `CONFIRMED → COMPLETED | CANCELLED`
  - `COMPLETED | CANCELLED` → 변경 불가

### 대시보드

- 주간 매출 AreaChart (Recharts, 그라디언트)
- KPI 카드 3종 (총 주문 건수 · 매출 · 활성 회원 수)
- 최근 주문 목록

### Error Boundary

- `WidgetErrorBoundary` — 위젯 단위 격리
- `ErrorBoundary` — 전역 페이지 단위
- `key` prop을 이용한 경계 초기화 패턴

---

## 서버 상태 관리

```
API 요청          TanStack Query         Zustand
─────────         ──────────────         ───────
GET /members  →  queryKey: [resource,   selectedMemberId
                  "list", filters]       isPanelOpen
GET /members/:id → queryKey: [resource, openPanel()
                  "detail", id]          closePanel()
PATCH /members/:id → invalidateQueries([resource])
```

- **TanStack Query** — 서버 데이터 캐싱, 재요청, `placeholderData`로 페이지 전환 깜빡임 방지
- **Zustand** — Slide Panel 열림/닫힘 등 순수 UI 상태만 관리
- **MSW** — Service Worker 기반 목업 API (실제 네트워크 탭에서 확인 가능)

---

## 실행

```bash
npm install
npm run dev
```

> MSW Service Worker(`public/mockServiceWorker.js`)가 포함되어 있어 별도 서버 없이 동작합니다.

---

## 라이브 데모

**[https://ops-dashboard-nine-dusky.vercel.app](https://ops-dashboard-nine-dusky.vercel.app)**

Vercel에 배포되어 있으며 실제 서버 없이 MSW(Mock Service Worker)로 동작합니다.

### 배포 구성

| 항목       | 내용                                                    |
| ---------- | ------------------------------------------------------- |
| 플랫폼     | Vercel                                                  |
| 빌드       | `npm run build` (Vite)                                  |
| Mock API   | MSW Service Worker — 브라우저에서 직접 요청 인터셉트    |
| SPA 라우팅 | `vercel.json` rewrite로 모든 경로를 `index.html`로 처리 |

```json
// vercel.json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```
