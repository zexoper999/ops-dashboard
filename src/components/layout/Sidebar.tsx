import { NavLink } from "react-router-dom";
import { Activity } from "lucide-react";
import { NAV_ITEMS } from "@/constants/navigation";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 flex flex-col shrink-0">
      {/* 로고 */}
      <div className="h-16 flex items-center gap-3 px-5 border-b border-slate-700/60">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
          <Activity size={17} className="text-white" />
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-none tracking-wide">
            OPS
          </p>
          <p className="text-slate-400 text-xs mt-0.5">Dashboard</p>
        </div>
      </div>

      {/* 네비게이션 */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-widest px-3 pb-2 pt-1">
          메뉴
        </p>
        {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                isActive
                  ? "bg-blue-600 text-white font-medium shadow-md shadow-blue-600/20"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={17} className={isActive ? "text-white" : "text-slate-400"} />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* 하단 버전 정보 */}
      <div className="p-4 border-t border-slate-700/60">
        <p className="text-xs text-slate-600 text-center">v1.0.0 · OPS Team</p>
      </div>
    </aside>
  );
}
