import { useOrders } from "@/hooks/useOrders";
import ChartWidget from "@/components/common/ChartWidget";

export default function Dashboard() {
  const { data, isLoading, isError } = useOrders(1);

  if (isLoading)
    return <div className="p-4 text-gray-500">데이터를 불러오는 중...</div>;
  if (isError)
    return (
      <div className="p-4 text-red-500">데이터를 불러오는데 실패했습니다.</div>
    );

  // 총 주문 건수 계산
  const totalOrders = data?.total || 0;

  // 이번 달 매출 합계 계산
  const totalRevenue =
    data?.data.reduce((acc, curr) => acc + curr.amount, 0) || 0;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">대시보드</h2>

      {/* 1. KPI 카드 영역 (그리드 레이아웃) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <p className="text-sm text-gray-500 font-medium">총 주문 건수</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {totalOrders}건
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <p className="text-sm text-gray-500 font-medium">이번 달 총 매출</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {totalRevenue.toLocaleString()}원
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <p className="text-sm text-gray-500 font-medium">활성 회원 수</p>
          <p className="text-3xl font-bold text-green-600 mt-2">1,204명</p>
        </div>
      </div>

      {/* 2. 차트 영역 */}
      <ChartWidget />

      {/* 3. 최근 주문 목록 (기존 코드 유지) */}
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">최근 주문 목록</h3>
          <button className="text-sm text-blue-500 hover:underline">
            전체보기 &rarr;
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-3 border-b">주문 ID</th>
                <th className="p-3 border-b">고객명</th>
                <th className="p-3 border-b">결제금액</th>
                <th className="p-3 border-b">상태</th>
              </tr>
            </thead>
            <tbody>
              {data?.data.slice(0, 5).map(
                (
                  order, // 5개만 보여줌
                ) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-mono text-xs text-gray-500">
                      {order.id.slice(0, 8)}
                    </td>
                    <td className="p-3 font-medium">{order.customerName}</td>
                    <td className="p-3">{order.amount.toLocaleString()}원</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold
                      ${order.status === "COMPLETED" ? "bg-green-100 text-green-700" : ""}
                      ${order.status === "PENDING" ? "bg-yellow-100 text-yellow-700" : ""}
                      ${order.status === "CANCELLED" ? "bg-red-100 text-red-700" : ""}
                      ${order.status === "CONFIRMED" ? "bg-blue-100 text-blue-700" : ""}
                    `}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
