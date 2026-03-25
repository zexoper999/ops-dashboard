import { useState } from "react";
import { Search, X, Pill, ChevronRight, AlertCircle, Info } from "lucide-react";

type SearchMode = "name" | "ingredient";

const MOCK_RESULTS = [
  {
    id: "1",
    name: "타이레놀 정 500mg",
    company: "한국얀센(주)",
    ingredient: "아세트아미노펜 500mg",
    effect: "감기로 인한 발열 및 동통(통증), 두통, 신경통, 근육통, 월경통, 타박통의 완화",
    dosage: "성인 1회 1~2정, 1일 3~4회 필요시 복용. 4~6시간 간격으로 복용하며 1일 최대 8정을 초과하지 마십시오.",
    caution: "알코올을 3잔 이상 섭취하는 경우 복용 전 의사·약사와 상의하세요. 과량 복용 시 간 손상 위험이 있습니다.",
    category: "해열·진통·소염제",
    shape: "흰색 원형 정제",
  },
  {
    id: "2",
    name: "게보린 정",
    company: "삼일제약(주)",
    ingredient: "이소프로필안티피린 150mg, 아세트아미노펜 250mg, 무수카페인 50mg",
    effect: "두통, 치통, 생리통, 근육통, 관절통, 신경통, 발열 시의 해열",
    dosage: "성인 1회 1정, 1일 3회 식후 복용. 복용 간격은 4시간 이상.",
    caution: "졸음, 어지러움이 올 수 있으므로 운전·기계 조작 주의. 15세 미만 소아에게 투여하지 마십시오.",
    category: "해열·진통·소염제",
    shape: "흰색 타원형 정제",
  },
  {
    id: "3",
    name: "판콜에이 내복액",
    company: "동화약품(주)",
    ingredient: "클로르페니라민말레산염 2mg, 아세트아미노펜 300mg, 구아이페네신 50mg",
    effect: "감기의 제증상(콧물, 코막힘, 재채기, 인후통, 기침, 가래, 오한, 발열, 두통, 관절통, 근육통)의 완화",
    dosage: "성인 1회 1병(15mL), 1일 3회 복용. 복용 간격은 4~6시간.",
    caution: "이 약은 졸음을 유발할 수 있습니다. 복용 중 음주를 피하고 운전·기계 조작에 주의하세요.",
    category: "종합감기약",
    shape: "액상(15mL/병)",
  },
];

const CATEGORY_COLOR: Record<string, string> = {
  "해열·진통·소염제": "bg-orange-50 text-orange-600 border-orange-100",
  "종합감기약": "bg-blue-50 text-blue-600 border-blue-100",
};

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-4 w-36 bg-gray-200 rounded" />
          <div className="h-3 w-24 bg-gray-100 rounded" />
        </div>
        <div className="h-6 w-20 bg-gray-100 rounded-full" />
      </div>
      <div className="h-3 w-full bg-gray-100 rounded" />
      <div className="h-3 w-5/6 bg-gray-100 rounded" />
    </div>
  );
}

function DrugCard({ drug }: { drug: (typeof MOCK_RESULTS)[0] }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <button
        className="w-full text-left p-4"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-bold text-gray-900 text-base leading-snug">{drug.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">{drug.company}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-full border ${CATEGORY_COLOR[drug.category] ?? "bg-gray-50 text-gray-500 border-gray-100"}`}
            >
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
          <span className="truncate">{drug.ingredient}</span>
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

export default function DrugSearch() {
  const [mode, setMode] = useState<SearchMode>("name");
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (!query.trim()) return;
    setIsLoading(true);
    setHasSearched(true);
    setTimeout(() => setIsLoading(false), 900);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const filtered = MOCK_RESULTS.filter((d) =>
    mode === "name"
      ? d.name.includes(query)
      : d.ingredient.includes(query),
  );

  return (
    <div className="max-w-lg mx-auto flex flex-col gap-0">
      {/* 검색 헤더 */}
      <div className="sticky top-0 z-10 bg-gray-50 pt-1 pb-3 space-y-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">약 검색</h2>
          <p className="text-xs text-gray-400 mt-0.5">약 이름이나 성분으로 효능·용법·주의사항을 확인하세요</p>
        </div>

        {/* 탭 */}
        <div className="flex bg-white rounded-xl border border-gray-100 p-1 gap-1">
          {(["name", "ingredient"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
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
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={mode === "name" ? "예) 타이레놀, 게보린…" : "예) 아세트아미노펜…"}
              className="w-full pl-9 pr-9 py-3 text-sm bg-white border border-gray-100 rounded-xl outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-50 transition"
            />
            {query && (
              <button
                onClick={() => { setQuery(""); setHasSearched(false); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
              >
                <X size={15} />
              </button>
            )}
          </div>
          <button
            onClick={handleSearch}
            className="px-4 py-3 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 active:scale-95 transition-all"
          >
            검색
          </button>
        </div>
      </div>

      {/* 결과 영역 */}
      <div className="space-y-3 pb-10">
        {isLoading && (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}

        {!isLoading && hasSearched && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <Pill size={24} className="text-gray-300" />
            </div>
            <p className="text-sm font-medium text-gray-500">검색 결과가 없습니다</p>
            <p className="text-xs text-gray-400 mt-1">다른 이름이나 성분명으로 검색해보세요</p>
          </div>
        )}

        {!isLoading && hasSearched && filtered.length > 0 && (
          <>
            <p className="text-xs text-gray-400 px-0.5">
              검색 결과 <span className="font-semibold text-indigo-600">{filtered.length}건</span>
            </p>
            {filtered.map((drug) => (
              <DrugCard key={drug.id} drug={drug} />
            ))}
          </>
        )}

        {!hasSearched && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
              <Pill size={28} className="text-indigo-300" />
            </div>
            <p className="text-sm font-medium text-gray-500">약 이름 또는 성분을 입력하세요</p>
            <p className="text-xs text-gray-400 mt-1">타이레놀, 아세트아미노펜 등</p>
          </div>
        )}
      </div>
    </div>
  );
}
