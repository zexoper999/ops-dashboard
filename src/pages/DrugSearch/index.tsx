/**
 * ================================================
 *  약 성분·용도 검색
 * ================================================
 *
 *  [ 구현 예정 ]
 *  - 약 이름 / 성분명 검색 (식품의약품안전처 API, 무료)
 *  - 효능·효과 / 용법·용량 / 주의사항 카드
 *  - 성분으로 역검색 (이 성분이 들어간 약 목록)
 *  - 디바운스 검색 (300ms)
 *  - 스켈레톤 로딩 UX
 * ================================================
 */

export default function DrugSearch() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">약 검색</h2>
        <p className="text-sm text-gray-400 mt-1">
          약 이름이나 성분으로 효능·용법·주의사항을 확인하세요.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center text-gray-400 text-sm">
        💊 검색창 구현 예정
      </div>
    </div>
  );
}
