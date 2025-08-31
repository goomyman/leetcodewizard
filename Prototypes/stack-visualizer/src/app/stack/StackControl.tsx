"use client";

interface StackControlProps {
  onPrePush: () => void;
  onPush: () => void;
  onPrePop: () => void;
  onPop: () => void;
  onBack: () => void;
  onForward: () => void;
  disabledPrePush: boolean;
  disabledPush: boolean;
  disabledPrePop: boolean;
  disabledPop: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
}

export default function StackControl({
  onPrePush,
  onPush,
  onPrePop,
  onPop,
  onBack,
  onForward,
  disabledPrePush,
  disabledPush,
  disabledPrePop,
  disabledPop,
  canGoBack,
  canGoForward,
}: StackControlProps) {
  return (
    <div className="stack-control flex gap-2 mb-4">
      <button
        onClick={onBack}
        disabled={!canGoBack}
        className="px-3 py-1 bg-gray-500 text-white rounded disabled:opacity-50"
      >
        Back
      </button>
      <button
        onClick={onForward}
        disabled={!canGoForward}
        className="px-3 py-1 bg-gray-500 text-white rounded disabled:opacity-50"
      >
        Forward
      </button>
      <button
        onClick={onPrePush}
        disabled={disabledPrePush}
        className="px-3 py-1 bg-blue-300 text-white rounded disabled:opacity-50"
      >
        PrePush
      </button>
      <button
        onClick={onPush}
        disabled={disabledPush}
        className="px-3 py-1 bg-blue-500 text-white rounded"
      >
        Push
      </button>
      <button
        onClick={onPrePop}
        disabled={disabledPrePop}
        className="px-3 py-1 bg-red-300 text-white rounded disabled:opacity-50"
      >
        PrePop
      </button>
      <button
        onClick={onPop}
        disabled={disabledPop}
        className="px-3 py-1 bg-red-500 text-white rounded disabled:opacity-50"
      >
        Pop
      </button>
    </div>
  );
}
