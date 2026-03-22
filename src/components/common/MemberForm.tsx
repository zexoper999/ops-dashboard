import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  MEMBER_GRADE_OPTIONS,
  MEMBER_STATUS_OPTIONS,
} from "@/constants/member";
import type { Member } from "@/types";

// !! Zod 스키마로 유효성 규칙 정의
const memberSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요"),
  email: z.string().email("올바른 이메일 형식이 아닙니다"),
  phone: z
    .string()
    .regex(/^010-\d{4}-\d{4}$/, "010-0000-0000 형식으로 입력해주세요"),
  birthDate: z.string().min(1, "생년월일을 입력해주세요"),
  gender: z.enum(["MALE", "FEMALE"]),
  grade: z.enum(["VIP", "GOLD", "SILVER", "GENERAL"]),
  status: z.enum(["ACTIVE", "DORMANT", "SUSPENDED"]),
  postcode: z.string().min(1, "우편번호를 입력해주세요"),
  address: z.string().min(1, "주소를 입력해주세요"),
  addressDetail: z.string(),
  totalOrderCount: z.number(),
  totalOrderAmount: z.number(),
  marketingAgree: z.boolean(),
  smsAgree: z.boolean(),
  emailAgree: z.boolean(),
  memo: z.string(),
});

type MemberFormValues = z.infer<typeof memberSchema>;

interface MemberFormProps {
  member: Member;
  onUpdate: (data: Partial<Member>) => void;
  isPending: boolean;
  onClose: () => void;
}

export default function MemberForm({
  member,
  onUpdate,
  isPending,
  onClose,
}: MemberFormProps) {

  // !! React Hook Form 초기화
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty }, // isDirty: 수정사항이 있는지
  } = useForm<MemberFormValues>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      name: member.name,
      email: member.email,
      phone: member.phone,
      birthDate: member.birthDate,
      gender: member.gender,
      grade: member.grade,
      status: member.status,
      postcode: member.postcode,
      address: member.address,
      addressDetail: member.addressDetail,
      totalOrderCount: member.totalOrderCount,
      totalOrderAmount: member.totalOrderAmount,
      marketingAgree: member.marketingAgree,
      smsAgree: member.smsAgree,
      emailAgree: member.emailAgree,
      memo: member.memo,
    },
  });

  // !! member가 바뀌면(다른 회원 클릭) 폼 초기화
  useEffect(() => {
    reset({
      name: member.name,
      email: member.email,
      phone: member.phone,
      birthDate: member.birthDate,
      gender: member.gender,
      grade: member.grade,
      status: member.status,
      postcode: member.postcode,
      address: member.address,
      addressDetail: member.addressDetail,
      totalOrderCount: member.totalOrderCount,
      totalOrderAmount: member.totalOrderAmount,
      marketingAgree: member.marketingAgree,
      smsAgree: member.smsAgree,
      emailAgree: member.emailAgree,
      memo: member.memo,
    });
  }, [member, reset]);

  // !! 취소 → 원본 데이터로 복구
  const handleCancel = () => {
    if (isDirty) {
      const confirmed = window.confirm(
        "변경사항이 있습니다. 취소하시겠습니까?",
      );
      if (!confirmed) return;
    }
    reset();
    onClose();
  };

  const onSubmit = (values: MemberFormValues) => {
    onUpdate(values);
  };

  // 공통 input 스타일
  const inputClass = (hasError: boolean) =>
    `w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${
      hasError ? "border-red-400 bg-red-50" : "border-gray-300"
    }`;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
      {/* 기본 정보 */}
      <section>
        <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
          기본 정보
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              이름 *
            </label>
            <input
              {...register("name")}
              className={inputClass(!!errors.name)}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              성별
            </label>
            <select {...register("gender")} className={inputClass(false)}>
              <option value="MALE">남성</option>
              <option value="FEMALE">여성</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              이메일 *
            </label>
            <input
              {...register("email")}
              className={inputClass(!!errors.email)}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              연락처 *
            </label>
            <input
              {...register("phone")}
              placeholder="010-0000-0000"
              className={inputClass(!!errors.phone)}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              생년월일 *
            </label>
            <input
              type="date"
              {...register("birthDate")}
              className={inputClass(!!errors.birthDate)}
            />
            {errors.birthDate && (
              <p className="text-red-500 text-xs mt-1">
                {errors.birthDate.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 등급 / 상태 */}
      <section>
        <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
          등급 / 상태
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              등급
            </label>
            <select {...register("grade")} className={inputClass(false)}>
              {MEMBER_GRADE_OPTIONS.filter((o) => o.value !== "").map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              상태
            </label>
            <select {...register("status")} className={inputClass(false)}>
              {MEMBER_STATUS_OPTIONS.filter((o) => o.value !== "").map(
                (opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ),
              )}
            </select>
          </div>
        </div>
      </section>

      {/* 주소 */}
      <section>
        <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
          주소
        </h4>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              우편번호 *
            </label>
            <input
              {...register("postcode")}
              className={inputClass(!!errors.postcode)}
            />
            {errors.postcode && (
              <p className="text-red-500 text-xs mt-1">
                {errors.postcode.message}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              주소 *
            </label>
            <input
              {...register("address")}
              className={inputClass(!!errors.address)}
            />
            {errors.address && (
              <p className="text-red-500 text-xs mt-1">
                {errors.address.message}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              상세주소
            </label>
            <input
              {...register("addressDetail")}
              className={inputClass(false)}
            />
          </div>
        </div>
      </section>

      {/* 구매 통계 (읽기 전용) */}
      <section>
        <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
          구매 통계
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              총 구매횟수
            </label>
            <input
              type="number"
              {...register("totalOrderCount", { valueAsNumber: true })}
              readOnly
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              총 구매금액
            </label>
            <input
              type="number"
              {...register("totalOrderAmount", { valueAsNumber: true })}
              readOnly
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
            />
          </div>
        </div>
      </section>

      {/* 마케팅 동의 */}
      <section>
        <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
          마케팅 동의
        </h4>
        <div className="space-y-2">
          {[
            { field: "marketingAgree", label: "마케팅 정보 수신 동의" },
            { field: "smsAgree", label: "SMS 수신 동의" },
            { field: "emailAgree", label: "이메일 수신 동의" },
          ].map(({ field, label }) => (
            <label
              key={field}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                {...register(field as keyof MemberFormValues)}
                className="w-4 h-4 accent-blue-500"
              />
              <span className="text-sm text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </section>

      {/* 메모 */}
      <section>
        <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
          메모
        </h4>
        <textarea
          {...register("memo")}
          rows={3}
          placeholder="관리자 메모를 입력하세요"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
        />
      </section>

      {/* !! 하단 버튼 (변경사항 있을 때만 저장 활성화) */}
      <div className="flex gap-3 pt-4 border-t border-gray-200 sticky bottom-0 bg-white pb-2">
        <button
          type="button"
          onClick={handleCancel}
          className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={!isDirty || isPending}
          className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isPending ? "저장 중..." : "저장"}
        </button>
      </div>
    </form>
  );
}
