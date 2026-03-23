/** 홍길동 → 홍*동 / 김수 → 김* */
export const maskName = (name: string): string => {
  if (name.length <= 1) return name;
  if (name.length === 2) return name[0] + "*";
  return name[0] + "*".repeat(name.length - 2) + name[name.length - 1];
};

/** example@naver.com → ex****@naver.com */
export const maskEmail = (email: string): string => {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  return `${local.slice(0, 2)}****@${domain}`;
};

/** 010-1234-5678 → 010-****-5678 */
export const maskPhone = (phone: string): string =>
  phone.replace(/(\d{3})-(\d{4})-(\d{4})/, "$1-****-$3");
