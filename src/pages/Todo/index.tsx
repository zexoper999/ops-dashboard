/**
 * ================================================
 *  React 스터디 — Todo 앱
 * ================================================
 *
 *  [ 미션 순서 ]
 *  1단계: 정적 리스트 렌더링 (map, key)          ← 지금 여기
 *  2단계: useState로 항목 추가
 *  3단계: 완료 체크 (불변성 업데이트 패턴)
 *  4단계: 항목 삭제
 *  5단계: useMemo로 필터 (전체 / 진행중 / 완료)
 *  6단계: useEffect로 localStorage 저장/복원
 * ================================================
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  1단계 미션: 아래 배열을 화면에 렌더링해보세요.
//
//  조건:
//  - <ul> 안에 todos 배열을 map()으로 순회
//  - 각 항목은 <li>로 출력
//  - 완료된 항목(done: true)은 글자에 line-through 스타일
//  - key prop 빠뜨리지 않기 (콘솔 경고 확인!)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
import { useState } from "react";
// const todos = [
//   { id: 1, text: "React 공부하기", done: false },
//   { id: 2, text: "컴포넌트 만들기", done: true },
//   { id: 3, text: "useState 이해하기", done: false },
// ];

export default function Todo() {
  const [inputValue, setInputValue] = useState("");
  const [todos, setTodos] = useState([
    { id: 1, text: "React 공부하기", done: false },
    { id: 2, text: "컴포넌트 만들기", done: true },
    { id: 3, text: "useState 이해하기", done: false },
  ]);
  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Todo 스터디</h2>
        <p className="text-sm text-gray-400 mt-1">
          미션을 하나씩 완성해보세요.
        </p>
      </div>
      <div className="flex w-full gap-2">
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="border px-2"
        ></input>
        <button
          className="border p-2"
          onClick={() => {
            if (!inputValue.trim()) return;
            setTodos([
              ...todos,
              { id: Date.now(), text: inputValue, done: false },
            ]);
            setInputValue("");
          }}
        >
          확인
        </button>
        {/* <button
          className="border p-2"
          onClick={setTodos([
            ...todos,
            { id: new Date(), text: inputValue, done: false },
          ])}
        >
          확인
        </button> */}
      </div>
      <ul>
        {todos.map(({ id, text, done }) => (
          <li key={id} className={done ? "line-through" : ""}>
            {text}
          </li>
        ))}
      </ul>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <p className="text-gray-400 text-sm text-center py-8">
          👆 위 주석을 읽고 todos 배열을 렌더링해보세요!
        </p>
      </div>
    </div>
  );
}
