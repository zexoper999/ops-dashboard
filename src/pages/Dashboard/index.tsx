import { useOrders } from "@/hooks/useOrders";

export default function Dashboard() {
  const { data, isLoading, isError } = useOrders(1);

  if (isLoading) {
    return <div className="p-4 text-gray-500">데이터를 불러오는 중...</div>;
  }

  if (isError) {
    return (
      <div className="p-4 text-red-500">데이터를 불러오는데 실패했습니다.</div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">대시보드</h2>

      <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">최근 주문 목록</h3>

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
              {data?.data.map((order) => (
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
