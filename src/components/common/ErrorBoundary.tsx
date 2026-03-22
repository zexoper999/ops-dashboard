import { Component, type ReactNode, type ErrorInfo } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode; // 커스텀 에러 UI (없으면 기본 UI 사용)
  onError?: (error: Error, info: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  // !! 자식 컴포넌트에서 에러 발생 시 자동 호출
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  // !! 에러 로깅 (실무에서는 Sentry로 전송)
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info);
    this.props.onError?.(error, info);
  }

  // !! 복구 버튼 클릭 시 상태 초기화
  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      // 커스텀 fallback이 있으면 그걸 사용
      if (this.props.fallback) return this.props.fallback;

      // 기본 에러 UI
      return (
        <div className="flex flex-col items-center justify-center p-8 bg-red-50 border border-red-200 rounded-lg text-center gap-3">
          <span className="text-3xl">⚠️</span>
          <p className="text-sm font-semibold text-red-600">
            이 영역을 불러오는데 실패했습니다
          </p>
          <p className="text-xs text-red-400">{this.state.error?.message}</p>
          <button
            onClick={this.handleReset}
            className="px-4 py-1.5 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            다시 시도
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// 함수형 컴포넌트에서 편하게 쓸 수 있는 래퍼
interface WidgetErrorBoundaryProps {
  children: ReactNode;
  title?: string;
}

export function WidgetErrorBoundary({
  children,
  title,
}: WidgetErrorBoundaryProps) {
  return (
    <ErrorBoundary
      fallback={
        <div className="flex flex-col items-center justify-center p-6 bg-red-50 border border-red-200 rounded-lg text-center gap-2 h-full min-h-32">
          <span className="text-2xl">⚠️</span>
          <p className="text-sm font-semibold text-red-600">
            {title ?? "위젯"} 로딩 실패
          </p>
          <p className="text-xs text-red-400">잠시 후 다시 시도해주세요</p>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}
