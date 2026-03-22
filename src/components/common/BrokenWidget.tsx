// 의도적으로 에러를 던지는 컴포넌트
interface BrokenWidgetProps {
  shouldBreak: boolean;
  label: string;
}

export default function BrokenWidget({
  shouldBreak,
  label,
}: BrokenWidgetProps) {
  if (shouldBreak) {
    throw new Error(`${label} 컴포넌트에서 에러 발생!`);
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 text-center min-h-32 flex flex-col items-center justify-center">
      <span className="text-2xl">✅</span>
      <p className="mt-2 text-sm font-medium text-gray-700">
        {label} 정상 동작 중
      </p>
    </div>
  );
}
