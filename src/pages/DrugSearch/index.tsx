import { useState } from "react";
import { Search, X, Pill, ChevronRight, AlertCircle, Info, Loader2 } from "lucide-react";
import { useDrugSearch } from "@/hooks/useDrugSearch";
import type { Drug, DrugSearchMode } from "@/types/drug";

const CATEGORY_COLOR: Record<string, string> = {
  "해열·진통·소염제": "bg-orange-50 text-orange-600 border-orange-100",
  "종합감기약": "bg-sky-50 text-sky-600 border-sky-100",
  "소화제": "bg-green-50 text-green-600 border-green-100",
  "위장관용제": "bg-teal-50 text-teal-600 border-teal-100",
  "항히스타민제": "bg-purple-50 text-purple-600 border-purple-100",
  "완하제·제산제": "bg-lime-50 text-lime-600 border-lime-100",
  "항혈전제": "bg-red-50 text-red-600 border-red-100",
  "항생제": "bg-yellow-50 text-yellow-700 border-yellow-100",
  "고지혈증치료제": "bg-pink-50 text-pink-600 border-pink-100",
  "비타민·영양제": "bg-amber-50 text-amber-600 border-amber-100",
  "혈당강하제": "bg-indigo-50 text-indigo-600 border-indigo-100",
};

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-4 w-40 bg-gray-200 rounded" />
          <div className="h-3 w-24 bg-gray-100 rounded" />
        </div>
        <div className="h-6 w-20 bg-gray-100 rounded-full" />
      </div>
      <div className="h-3 w-full bg-gray-100 rounded" />
      <div className="h-3 w-4/5 bg-gray-100 rounded" />
    </div>
  );
}

function Section({
  icon,
  label,
  color,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  color: string;
  children: string;
}) {
  return (
    <div className="px-4 py-3 space-y-1.5">
      <div className="flex items-center gap-1.5">
        {icon}
        <span className={`text-xs font-semibold ${color}`}>{label}</span>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">{children}</p>
    </div>
  );
}

function DrugCard({ drug }: { drug: Drug }) {
  const [expanded, setExpanded] = useState(false);
  const badgeClass =
    CATEGORY_COLOR[drug.category] ?? "bg-gray-50 text-gray-500 border-gray-100";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <button className="w-full text-left p-4" onClick={() => setExpanded((v) => !v)}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-bold text-gray-900 text-base leading-snug">{drug.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">{drug.company}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${badgeClass}`}>
              {drug.category}
            </span>
            <ChevronRight
              size={16}
              className={`text-gray-300 transition-transform duration-200 ${expanded ? "rotate-90" : ""}`}
            />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-500">
          <Pill size={12} className="text-indigo-400 shrink-0" />
          <span className="line-clamp-1">{drug.ingredient}</span>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-gray-50 divide-y divide-gray-50">
          <Section icon={<Info size={13} className="text-emerald-500" />} label="효능·효과" color="text-emerald-700">
            {drug.effect}
          </Section>
          <Section icon={<Pill size={13} className="text-blue-500" />} label="용법·용량" color="text-blue-700">
            {drug.dosage}
          </Section>
          <Section icon={<AlertCircle size={13} className="text-amber-500" />} label="주의사항" color="text-amber-700">
            {drug.caution}
          </Section>
          <div className="px-4 py-3 flex items-center justify-between">
            <span className="text-xs text-gray-400">제형</span>
            <span className="text-xs font-medium text-gray-600">{drug.shape}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DrugSearch() {
  const [mode, setMode] = useState<DrugSearchMode>("name");
  const [inputValue, setInputValue] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");

  const { data, isFetching, isError } = useDrugSearch(submittedQuery, mode);

  const handleSearch = () => {
    if (inputValue.trim()) setSubmittedQuery(inputValue.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleClear = () => {
    setInputValue("");
    setSubmittedQuery("");
  };

  const handleModeChange = (newMode: DrugSearchMode) => {
    setMode(newMode);
    setSubmittedQuery("");
    setInputValue("");
  };

  const hasSearched = submittedQuery.length > 0;
  const results = data?.results ?? [];

  return (
    <div className="max-w-lg mx-auto flex flex-col gap-0">
      {/* sticky 검색 헤더 */}
      <div className="sticky top-0 z-10 bg-gray-50 pt-1 pb-3 space-y-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">약 검색</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            약 이름이나 성분으로 효능·용법·주의사항을 확인하세요
          </p>
        </div>

        {/* 모드 탭 */}
        <div className="flex bg-white rounded-xl border border-gray-100 p-1 gap-1">
          {(["name", "ingredient"] as const).map((m) => (
            <button
              key={m}
              onClick={() => handleModeChange(m)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                mode === m
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {m === "name" ? "약 이름" : "성분명"}
            </button>
          ))}
        </div>

        {/* 검색창 */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={mode === "name" ? "예) 타이레놀, 게보린…" : "예) 아세트아미노펜, 이부프로펜…"}
              className="w-full pl-9 pr-9 py-3 text-sm bg-white border border-gray-100 rounded-xl outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-50 transition"
            />
            {inputValue && (
              <button
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
              >
                <X size={15} />
              </button>
            )}
          </div>
          <button
            onClick={handleSearch}
            disabled={!inputValue.trim()}
            className="px-4 py-3 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            검색
          </button>
        </div>
      </div>

      {/* 결과 영역 */}
      <div className="space-y-3 pb-10">
        {/* 로딩 */}
        {isFetching && (
          <>
            <div className="flex items-center gap-2 text-xs text-indigo-500 px-0.5 py-1">
              <Loader2 size={13} className="animate-spin" />
              검색 중…
            </div>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}

        {/* 에러 */}
        {!isFetching && isError && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mb-3">
              <AlertCircle size={24} className="text-red-300" />
            </div>
            <p className="text-sm font-medium text-gray-500">검색 중 오류가 발생했습니다</p>
            <p className="text-xs text-gray-400 mt-1">잠시 후 다시 시도해주세요</p>
          </div>
        )}

        {/* 결과 없음 */}
        {!isFetching && !isError && hasSearched && results.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <Pill size={24} className="text-gray-300" />
            </div>
            <p className="text-sm font-medium text-gray-500">
              <span className="text-indigo-500">"{submittedQuery}"</span> 검색 결과가 없습니다
            </p>
            <p className="text-xs text-gray-400 mt-1">다른 이름이나 성분명으로 검색해보세요</p>
          </div>
        )}

        {/* 결과 목록 */}
        {!isFetching && !isError && results.length > 0 && (
          <>
            <p className="text-xs text-gray-400 px-0.5">
              <span className="font-semibold text-indigo-600">"{submittedQuery}"</span> 검색 결과{" "}
              <span className="font-semibold text-gray-700">{results.length}건</span>
            </p>
            {results.map((drug) => (
              <DrugCard key={drug.id} drug={drug} />
            ))}
          </>
        )}

        {/* 초기 안내 */}
        {!hasSearched && !isFetching && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
              <Pill size={28} className="text-indigo-300" />
            </div>
            <p className="text-sm font-medium text-gray-500">약 이름 또는 성분을 입력하세요</p>
            <div className="mt-3 flex flex-wrap gap-2 justify-center">
              {["타이레놀", "이부프로펜", "게보린", "아세트아미노펜"].map((kw) => (
                <button
                  key={kw}
                  onClick={() => {
                    setInputValue(kw);
                    setSubmittedQuery(kw);
                    if (["이부프로펜", "아세트아미노펜"].includes(kw)) setMode("ingredient");
                  }}
                  className="px-3 py-1.5 text-xs bg-white border border-gray-100 rounded-full text-gray-500 hover:border-indigo-200 hover:text-indigo-600 transition"
                >
                  {kw}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
