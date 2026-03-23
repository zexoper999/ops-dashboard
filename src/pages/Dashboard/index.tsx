import {
  Package,
  TrendingUp,
  Users,
  ArrowUpRight,
  ArrowRight,
} from "lucide-react";
import { useCrudResource } from "@/hooks/useCrudResource";
import { maskName } from "@/utils/mask";
import ChartWidget from "@/components/common/ChartWidget";
import { WidgetErrorBoundary } from "@/components/common/ErrorBoundary";
import type { Order } from "@/types";

const STATUS_MAP: Record<
  Order["status"],
  { label: string; className: string; dot: string }
> = {
  COMPLETED: {
    label: "완료",
    className: "bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
  },
  PENDING: {
    label: "대기",
    className: "bg-amber-50 text-amber-700",
    dot: "bg-amber-400",
  },
  CANCELLED: {
    label: "취소",
    className: "bg-red-50 text-red-600",
    dot: "bg-red-500",
  },
  CONFIRMED: {
    label: "확인",
    className: "bg-blue-50 text-blue-600",
    dot: "bg-blue-500",
  },
};

export default function Dashboard() {
  const { list } = useCrudResource<Order>("orders", { page: 1, status: "", search: "" });
  const { data, isLoading, isError } = list;

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
        데이터를 불러오는 중...
      </div>
    );
  if (isError)
    return (
      <div className="flex items-center justify-center h-64 text-red-400 text-sm">
        데이터를 불러오는데 실패했습니다.
      </div>
    );

  const totalOrders = data?.total ?? 0;
  const totalRevenue =
    data?.data.reduce((acc, curr) => acc + curr.amount, 0) ?? 0;

  const kpiCards = [
    {
      label: "총 주문 건수",
      value: `${totalOrders}`,
      unit: "건",
      trend: "+12.5%",
      icon: Package,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      label: "이번 달 총 매출",
      value: totalRevenue.toLocaleString(),
      unit: "원",
      trend: "+8.2%",
      icon: TrendingUp,
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
    },
    {
      label: "활성 회원 수",
      value: "1,204",
      unit: "명",
      trend: "+3.1%",
      icon: Users,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
  ];

  return (
    <div className="space-y-7">
      {/* 페이지 타이틀 */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">대시보드</h2>
        <p className="text-sm text-gray-400 mt-1">
          운영 현황을 한눈에 확인하세요.
        </p>
      </div>

      {/* KPI 카드 */}
      <WidgetErrorBoundary title="KPI 카드">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {kpiCards.map(
          ({ label, value, unit, trend, icon: Icon, iconBg, iconColor }) => (
            <div
              key={label}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-start justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <p className="text-sm text-gray-500 font-medium">{label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2 tracking-tight">
                  {value}
                  <span className="text-lg font-semibold text-gray-500 ml-1">
                    {unit}
                  </span>
                </p>
                <div className="flex items-center gap-1 mt-3">
                  <ArrowUpRight size={13} className="text-emerald-500" />
                  <span className="text-xs font-medium text-emerald-600">
                    {trend}
                  </span>
                  <span className="text-xs text-gray-400 ml-0.5">
                    전월 대비
                  </span>
                </div>
              </div>
              <div
                className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}
              >
                <Icon size={21} className={iconColor} />
              </div>
            </div>
          ),
        )}
      </div>
      </WidgetErrorBoundary>

      {/* 차트 */}
      <WidgetErrorBoundary title="매출 차트">
        <ChartWidget />
      </WidgetErrorBoundary>

      {/* 최근 주문 목록 */}
      <WidgetErrorBoundary title="주문 목록">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-50">
          <div>
            <h3 className="text-base font-semibold text-gray-800">
              최근 주문 목록
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">최근 5건</p>
          </div>
          <button className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
            전체보기
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/70">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">
                  주문 ID
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">
                  고객명
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">
                  결제금액
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">
                  상태
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data?.data.slice(0, 5).map((order) => {
                const status = STATUS_MAP[order.status];
                return (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-xs text-gray-400">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {maskName(order.customerName)}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {order.amount.toLocaleString()}
                      <span className="font-normal text-gray-400 ml-0.5 text-xs">
                        원
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.className}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${status.dot}`}
                        />
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      </WidgetErrorBoundary>
    </div>
  );
}
