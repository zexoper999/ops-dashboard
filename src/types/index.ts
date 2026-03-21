export interface Order {
  id: string;
  customerName: string;
  amount: number;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  createdAt: string;
}
