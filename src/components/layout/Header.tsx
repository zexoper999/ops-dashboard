import { Bell, Search, Settings } from "lucide-react";

export default function Header() {
  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-10 shrink-0 shadow-sm">
      {/* 검색창 */}
      <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 w-72 transition-all focus-within:border-blue-400 focus-within:bg-white focus-within:shadow-sm">
        <Search size={15} className="text-gray-400 shrink-0" />
        <input
          type="text"
          placeholder="무엇이든 검색해보세요"
          className="bg-transparent text-sm text-gray-700 outline-none w-full placeholder-gray-400"
        />
      </div>

      {/* 우측 영역 */}
      <div className="flex items-center gap-2">
        {/* 알림 버튼 */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors">
          <Bell size={17} className="text-gray-500" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full ring-2 ring-white" />
        </button>

        {/* 설정 버튼 */}
        <button className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors">
          <Settings size={17} className="text-gray-500" />
        </button>

        {/* 구분선 */}
        <div className="w-px h-6 bg-gray-200 mx-1" />

        {/* 유저 정보 */}
        <div className="flex items-center gap-2.5 pl-1 cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-blue-500/30">
            A
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800 leading-none">
              관리자
            </p>
            <p className="text-xs text-gray-400 mt-0.5">admin@ops.com</p>
          </div>
        </div>
      </div>
    </header>
  );
}
