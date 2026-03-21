export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

export const formatAmount = (amount: number) => `${amount.toLocaleString()}원`;
