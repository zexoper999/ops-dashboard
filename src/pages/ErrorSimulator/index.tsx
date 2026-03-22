import { useState } from "react";
import {
  ErrorBoundary,
  WidgetErrorBoundary,
} from "@/components/common/ErrorBoundary";
import BrokenWidget from "@/components/common/BrokenWidget";

export default function ErrorSimulator() {
  // 각 위젯별로 독립된 에러 상태
  const [breakA, setBreakA] = useState(false);
  const [breakB, setBreakB] = useState(false);
  const [breakC, setBreakC] = useState(false);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">
          Error Boundary 시뮬레이터
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          각 버튼을 눌러 위젯 에러를 발생시켜보세요. 다른 위젯에 영향이 없는지
          확인하세요.
        </p>
      </div>

      {/* ─── 실험 1: 위젯별 독립 Error Boundary ─── */}
      <section className="space-y-3">
        <h3 className="text-base font-semibold text-gray-700 border-b pb-2">
          실험 1 — 위젯별 독립 격리
        </h3>
        <p className="text-xs text-gray-400">
          한 위젯이 에러나도 나머지 두 위젯은 정상 동작합니다.
        </p>

        <div className="grid grid-cols-3 gap-4">
          {/* 위젯 A */}
          <div className="space-y-2">
            <WidgetErrorBoundary key={String(breakA)} title="위젯 A">
              <BrokenWidget shouldBreak={breakA} label="위젯 A" />
            </WidgetErrorBoundary>
            <button
              onClick={() => setBreakA((v) => !v)}
              className={`w-full py-2 text-sm rounded-lg font-medium transition-colors ${
                breakA
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-red-500 text-white hover:bg-red-600"
              }`}
            >
              {breakA ? "✅ 위젯 A 복구" : "💥 위젯 A 에러 발생"}
            </button>
          </div>

          {/* 위젯 B */}
          <div className="space-y-2">
            <WidgetErrorBoundary key={String(breakB)} title="위젯 B">
              <BrokenWidget shouldBreak={breakB} label="위젯 B" />
            </WidgetErrorBoundary>
            <button
              onClick={() => setBreakB((v) => !v)}
              className={`w-full py-2 text-sm rounded-lg font-medium transition-colors ${
                breakB
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-red-500 text-white hover:bg-red-600"
              }`}
            >
              {breakB ? "✅ 위젯 B 복구" : "💥 위젯 B 에러 발생"}
            </button>
          </div>

          {/* 위젯 C */}
          <div className="space-y-2">
            <WidgetErrorBoundary key={String(breakC)} title="위젯 C">
              <BrokenWidget shouldBreak={breakC} label="위젯 C" />
            </WidgetErrorBoundary>
            <button
              onClick={() => setBreakC((v) => !v)}
              className={`w-full py-2 text-sm rounded-lg font-medium transition-colors ${
                breakC
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-red-500 text-white hover:bg-red-600"
              }`}
            >
              {breakC ? "✅ 위젯 C 복구" : "💥 위젯 C 에러 발생"}
            </button>
          </div>
        </div>
      </section>

      {/* ─── 실험 2: 전역 하나만 감쌀 때 비교 ─── */}
      <section className="space-y-3">
        <h3 className="text-base font-semibold text-gray-700 border-b pb-2">
          실험 2 — 전역 하나로만 감쌌을 때
        </h3>
        <p className="text-xs text-gray-400">
          위젯 하나가 에러나면 이 섹션 전체가 에러 UI로 교체됩니다.
        </p>

        <GlobalSection />
      </section>
    </div>
  );
}

// ✅ 전역 Error Boundary 효과를 보여주기 위해 분리된 섹션
function GlobalSection() {
  const [breakGlobal, setBreakGlobal] = useState(false);

  return (
    <div className="space-y-3">
      {/* 전역 Error Boundary 하나로 전체를 감쌈 */}
      <ErrorBoundary>
        <div className="grid grid-cols-3 gap-4">
          <BrokenWidget shouldBreak={breakGlobal} label="글로벌 위젯 A" />
          <BrokenWidget shouldBreak={false} label="글로벌 위젯 B" />
          <BrokenWidget shouldBreak={false} label="글로벌 위젯 C" />
        </div>
      </ErrorBoundary>

      <button
        onClick={() => setBreakGlobal((v) => !v)}
        className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
          breakGlobal
            ? "bg-green-500 text-white hover:bg-green-600"
            : "bg-red-500 text-white hover:bg-red-600"
        }`}
      >
        {breakGlobal
          ? "✅ 전체 복구"
          : "💥 글로벌 위젯 A 에러 발생 (전체 영향)"}
      </button>
    </div>
  );
}
