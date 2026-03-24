/**
 * ================================================
 *  OTT 통합 검색
 * ================================================
 *
 *  [ 구현 예정 ]
 *  - 영화/드라마 제목 검색 (JustWatch 비공식 API)
 *  - 넷플릭스 / 디즈니+ / 왓챠 / 티빙 / 웨이브 뱃지 표시
 *  - 포스터 + 장르 + 출시연도 카드
 *  - 디바운스 검색 (300ms)
 *  - 스켈레톤 로딩 UX
 * ================================================
 */

export default function OttSearch() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">OTT 통합 검색</h2>
        <p className="text-sm text-gray-400 mt-1">
          영화·드라마 제목으로 어느 플랫폼에서 볼 수 있는지 찾아보세요.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center text-gray-400 text-sm">
        🎬 검색창 구현 예정
      </div>
    </div>
  );
}
