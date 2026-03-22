import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Download, Plus, X, Users, UserCheck, Crown, CalendarPlus } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { api } from "@/services/api";
import { useCrudResource } from "@/hooks/useCrudResource";
import { DataTable, type ColDef } from "@/components/common/DataTable";
import { useMemberStore } from "@/stores/memberStore";
import SlidePanel from "@/components/common/SlidePanel";
import MemberForm from "@/components/common/MemberForm";
import {
  MEMBER_GRADE_OPTIONS,
  MEMBER_STATUS_OPTIONS,
  MEMBER_GRADE_BADGE_MAP,
  MEMBER_STATUS_BADGE_MAP,
} from "@/constants/member";
import type { Member, MemberGrade, MemberStatus } from "@/types";

// ── 타입 ──────────────────────────────────────────────────────

type MemberFilters = {
  page: number;
  search: string;
  grade: string;
  status: string;
  sortBy: string;
  sortDir: string;
};

interface MemberStats {
  total: number;
  active: number;
  vipGold: number;
  thisMonth: number;
}

// ── 등록 폼 스키마 ─────────────────────────────────────────────

const createSchema = z.object({
  name:  z.string().min(1, "이름을 입력해주세요"),
  email: z.string().email("올바른 이메일 형식이 아닙니다"),
  phone: z.string().regex(/^010-\d{4}-\d{4}$/, "010-0000-0000 형식으로 입력해주세요"),
  grade: z.enum(["VIP", "GOLD", "SILVER", "GENERAL"]),
});
type CreateInput = z.infer<typeof createSchema>;

// ── 개인정보 마스킹 ────────────────────────────────────────────

/** 홍길동 → 홍*동 / 김민준 → 김*준 / 이수아 → 이*아 */
const maskName = (name: string) => {
  if (name.length <= 1) return name;
  if (name.length === 2) return name[0] + "*";
  return name[0] + "*".repeat(name.length - 2) + name[name.length - 1];
};

/** example@naver.com → ex****@naver.com */
const maskEmail = (email: string) => {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  return `${local.slice(0, 2)}****@${domain}`;
};

/** 010-1234-5678 → 010-****-5678 */
const maskPhone = (phone: string) =>
  phone.replace(/(\d{3})-(\d{4})-(\d{4})/, "$1-****-$3");

// ── 아바타 색상 ────────────────────────────────────────────────

const AVATAR_COLORS = [
  "bg-violet-500", "bg-blue-500", "bg-emerald-500", "bg-amber-500",
  "bg-rose-500",   "bg-indigo-500", "bg-teal-500",  "bg-orange-500",
];
const getAvatarColor = (name: string) => {
  const sum = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_COLORS[sum % AVATAR_COLORS.length];
};

// ── 정렬 옵션 ──────────────────────────────────────────────────

const SORT_OPTIONS = [
  { label: "정렬 기준",       value: "" },
  { label: "이름순",          value: "name:asc" },
  { label: "가입일 최신순",   value: "createdAt:desc" },
  { label: "가입일 오래된순", value: "createdAt:asc" },
  { label: "구매액 높은순",   value: "totalOrderAmount:desc" },
  { label: "구매횟수 많은순", value: "totalOrderCount:desc" },
];

// ── 메인 컴포넌트 ──────────────────────────────────────────────

export default function Members() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isCreating, setIsCreating] = useState(false);

  const filters = useMemo<MemberFilters>(
    () => ({
      page:    Number(searchParams.get("page")) || 1,
      search:  searchParams.get("search")  || "",
      grade:   searchParams.get("grade")   || "",
      status:  searchParams.get("status")  || "",
      sortBy:  searchParams.get("sortBy")  || "",
      sortDir: searchParams.get("sortDir") || "",
    }),
    [searchParams],
  );

  const updateFilter = useCallback(
    (key: string, value: string) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set(key, value);
        else next.delete(key);
        if (key !== "page") next.set("page", "1");
        return next;
      });
    },
    [setSearchParams],
  );

  const resetFilters = useCallback(() => setSearchParams({}), [setSearchParams]);

  // 컬럼 헤더 클릭 시 정렬 토글
  const handleSort = useCallback(
    (key: string) => {
      const isSame   = filters.sortBy === key;
      const newDir   = isSame && filters.sortDir === "asc" ? "desc" : "asc";
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set("sortBy",  key);
        next.set("sortDir", newDir);
        next.set("page", "1");
        return next;
      });
    },
    [filters.sortBy, filters.sortDir, setSearchParams],
  );

  const { selectedMemberId, isPanelOpen, openPanel, closePanel } = useMemberStore();

  const { list, detail, update, create } = useCrudResource<Member, MemberFilters>(
    "members",
    filters,
    selectedMemberId,
  );

  const { data: stats } = useQuery<MemberStats>({
    queryKey: ["members", "stats"],
    queryFn:  () => api.get("/api/members/stats"),
  });

  // 활성 필터 pill 목록
  const activeFilters = useMemo(() => {
    const pills: { label: string; key: string }[] = [];
    if (filters.grade)  pills.push({ label: MEMBER_GRADE_BADGE_MAP[filters.grade  as MemberGrade]?.label ?? filters.grade,   key: "grade"  });
    if (filters.status) pills.push({ label: MEMBER_STATUS_BADGE_MAP[filters.status as MemberStatus]?.label ?? filters.status, key: "status" });
    return pills;
  }, [filters.grade, filters.status]);

  // 정렬 select용 단일 value (key:dir 형태)
  const sortSelectValue = filters.sortBy
    ? `${filters.sortBy}:${filters.sortDir || "asc"}`
    : "";

  // 컬럼 정의 (actions는 openPanel 참조가 필요해 useMemo)
  const columns = useMemo<ColDef<Member>[]>(
    () => [
      {
        key: "name",
        header: "회원",
        type: "text",
        render: (_v, row) => (
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-full ${getAvatarColor(row.name)} flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm`}
            >
              {row.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-gray-800 text-sm">{maskName(row.name)}</p>
              <p className="text-xs text-gray-400 truncate max-w-[160px]">{maskEmail(row.email)}</p>
            </div>
          </div>
        ),
      },
      { key: "phone", header: "연락처", type: "text", render: (_v, row) => (
        <span className="text-gray-800 font-mono text-sm">{maskPhone(row.phone)}</span>
      )},
      { key: "grade",            header: "등급",      type: "badge", badgeMap: MEMBER_GRADE_BADGE_MAP },
      { key: "status",           header: "상태",      type: "badge", badgeMap: MEMBER_STATUS_BADGE_MAP },
      { key: "totalOrderAmount", header: "총 구매액", type: "currency", sortable: true },
      { key: "totalOrderCount",  header: "구매횟수",  type: "number",   suffix: "회", sortable: true },
      { key: "createdAt",        header: "가입일",    type: "date",     sortable: true },
      { key: "_actions", header: "상세", type: "actions", onAction: (row) => openPanel(row.id) },
    ],
    [openPanel],
  );

  const hasFilter = !!(filters.search || filters.grade || filters.status || filters.sortBy);

  return (
    <div className="space-y-5">

      {/* ── 헤더 ── */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">회원 관리</h2>
          <p className="text-sm text-gray-400 mt-1">
            총 {list.data?.total ?? stats?.total ?? 0}명의 회원이 등록되어 있습니다
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3.5 py-2 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
            <Download size={14} />
            내보내기
          </button>
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/30"
          >
            <Plus size={15} />
            회원 등록
          </button>
        </div>
      </div>

      {/* ── 통계 카드 ── */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard icon={Users}       label="전체 회원"   value={stats?.total     ?? 0} unit="명" color="blue"    />
        <StatCard icon={UserCheck}   label="활성 회원"   value={stats?.active    ?? 0} unit="명" color="emerald" />
        <StatCard icon={Crown}       label="VIP · GOLD" value={stats?.vipGold   ?? 0} unit="명" color="violet"  />
        <StatCard icon={CalendarPlus} label="이번달 신규" value={stats?.thisMonth ?? 0} unit="명" color="amber"   />
      </div>

      {/* ── 필터 + 정렬 바 ── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3">
        <div className="flex flex-wrap gap-3 items-center">

          {/* 통합 검색 */}
          <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 w-72 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400/30 transition-all">
            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="이름 / 이메일 / 연락처 검색"
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
              className="bg-transparent text-sm text-gray-700 outline-none w-full placeholder-gray-400"
            />
            {filters.search && (
              <button onClick={() => updateFilter("search", "")} className="text-gray-400 hover:text-gray-600">
                <X size={13} />
              </button>
            )}
          </div>

          {/* 등급 필터 */}
          <select
            value={filters.grade}
            onChange={(e) => updateFilter("grade", e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400/30 focus:border-blue-400 bg-white"
          >
            {MEMBER_GRADE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          {/* 상태 필터 */}
          <select
            value={filters.status}
            onChange={(e) => updateFilter("status", e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400/30 focus:border-blue-400 bg-white"
          >
            {MEMBER_STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          {/* 정렬 */}
          <select
            value={sortSelectValue}
            onChange={(e) => {
              const val = e.target.value;
              if (!val) {
                setSearchParams((prev) => {
                  const next = new URLSearchParams(prev);
                  next.delete("sortBy");
                  next.delete("sortDir");
                  return next;
                });
              } else {
                const [key, dir] = val.split(":");
                setSearchParams((prev) => {
                  const next = new URLSearchParams(prev);
                  next.set("sortBy", key);
                  next.set("sortDir", dir ?? "asc");
                  next.set("page", "1");
                  return next;
                });
              }
            }}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400/30 focus:border-blue-400 bg-white"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          {hasFilter && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 px-3 py-2 text-sm text-gray-400 hover:text-red-500 transition-colors"
            >
              <X size={13} />
              초기화
            </button>
          )}
        </div>

        {/* 활성 필터 pills */}
        {activeFilters.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap pt-0.5">
            <span className="text-xs text-gray-400">적용된 필터:</span>
            {activeFilters.map((f) => (
              <span
                key={f.key}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-200"
              >
                {f.label}
                <button onClick={() => updateFilter(f.key, "")} className="hover:text-blue-900 transition-colors">
                  <X size={11} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── 테이블 ── */}
      <DataTable<Member>
        columns={columns}
        data={list.data?.data}
        isLoading={list.isLoading}
        isError={list.isError}
        page={filters.page}
        totalPages={list.data?.totalPages ?? 1}
        total={list.data?.total ?? 0}
        onPageChange={(p) => updateFilter("page", String(p))}
        sortKey={filters.sortBy}
        sortDir={filters.sortDir as "asc" | "desc"}
        onSort={handleSort}
        emptyMessage="검색 조건에 맞는 회원이 없습니다."
      />

      {/* ── 상세/수정 패널 ── */}
      <SlidePanel isOpen={isPanelOpen} onClose={closePanel} title="회원 상세 / 수정">
        {detail.data && (
          <MemberForm
            member={detail.data}
            onUpdate={(data) =>
              update.mutate({ id: detail.data!.id, data }, { onSuccess: closePanel })
            }
            isPending={update.isPending}
            onClose={closePanel}
          />
        )}
      </SlidePanel>

      {/* ── 회원 등록 패널 ── */}
      <SlidePanel isOpen={isCreating} onClose={() => setIsCreating(false)} title="회원 등록">
        <CreateMemberPanel
          onCreate={(data) =>
            create.mutate(data, { onSuccess: () => setIsCreating(false) })
          }
          isPending={create.isPending}
          onClose={() => setIsCreating(false)}
        />
      </SlidePanel>
    </div>
  );
}

// ── 통계 카드 ──────────────────────────────────────────────────

const STAT_STYLES = {
  blue:    { bg: "bg-blue-50",    text: "text-blue-700",    icon: "bg-blue-100 text-blue-600" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-700", icon: "bg-emerald-100 text-emerald-600" },
  violet:  { bg: "bg-violet-50",  text: "text-violet-700",  icon: "bg-violet-100 text-violet-600" },
  amber:   { bg: "bg-amber-50",   text: "text-amber-700",   icon: "bg-amber-100 text-amber-600" },
} as const;

function StatCard({
  icon: Icon,
  label,
  value,
  unit,
  color,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  unit: string;
  color: keyof typeof STAT_STYLES;
}) {
  const s = STAT_STYLES[color];
  return (
    <div className={`${s.bg} rounded-2xl p-5 flex items-center justify-between`}>
      <div>
        <p className={`text-xs font-semibold ${s.text} mb-1.5 uppercase tracking-wide`}>{label}</p>
        <p className={`text-3xl font-bold ${s.text} leading-none`}>
          {value.toLocaleString()}
          <span className="text-sm font-medium ml-1 opacity-60">{unit}</span>
        </p>
      </div>
      <div className={`w-11 h-11 rounded-xl ${s.icon} flex items-center justify-center`}>
        <Icon size={20} />
      </div>
    </div>
  );
}

// ── 회원 등록 폼 ────────────────────────────────────────────────

function CreateMemberPanel({
  onCreate,
  isPending,
  onClose,
}: {
  onCreate: (data: Partial<Member>) => void;
  isPending: boolean;
  onClose: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateInput>({
    resolver: zodResolver(createSchema),
    defaultValues: { grade: "GENERAL" },
  });

  const inputClass = (hasError: boolean) =>
    `w-full border rounded-lg px-3 py-2.5 text-sm outline-none transition-all ${
      hasError
        ? "border-red-400 focus:ring-2 focus:ring-red-100 bg-red-50"
        : "border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
    }`;

  return (
    <form onSubmit={handleSubmit(onCreate)} className="p-6 space-y-5">
      <div className="flex items-center gap-2 p-3.5 bg-blue-50 rounded-xl border border-blue-100 text-sm text-blue-700">
        <Plus size={15} className="shrink-0" />
        기본 정보를 입력하면 즉시 등록됩니다. 상세 정보는 등록 후 수정할 수 있습니다.
      </div>

      <FormField label="이름 *" error={errors.name?.message}>
        <input
          {...register("name")}
          placeholder="홍길동"
          className={inputClass(!!errors.name)}
        />
      </FormField>

      <FormField label="이메일 *" error={errors.email?.message}>
        <input
          {...register("email")}
          type="email"
          placeholder="example@naver.com"
          className={inputClass(!!errors.email)}
        />
      </FormField>

      <FormField label="연락처 *" error={errors.phone?.message}>
        <input
          {...register("phone")}
          placeholder="010-0000-0000"
          className={inputClass(!!errors.phone)}
        />
      </FormField>

      <FormField label="등급" error={errors.grade?.message}>
        <select {...register("grade")} className={inputClass(!!errors.grade)}>
          <option value="GENERAL">일반</option>
          <option value="SILVER">SILVER</option>
          <option value="GOLD">GOLD</option>
          <option value="VIP">VIP</option>
        </select>
      </FormField>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors font-medium"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "등록 중..." : "등록하기"}
        </button>
      </div>
    </form>
  );
}

function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
