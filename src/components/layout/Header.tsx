export default function Header() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      <h1 className="text-sm text-gray-500">운영 관리 시스템</h1>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">관리자</span>
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
          A
        </div>
      </div>
    </header>
  );
}
