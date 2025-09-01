"use client";

interface StackControlProps {
  onPreInsert: () => void;
  onInsert: () => void;
  onPreRemove: () => void;
  onRemove: () => void;
  onBack: () => void;
  onForward: () => void;
  disabledPreInsert: boolean;
  disabledInsert: boolean;
  disabledPreRemove: boolean;
  disabledRemove: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
}

export default function StackControl({
  onPreInsert: onPreInsert,
  onInsert: onInsert,
  onPreRemove: onPreRemove,
  onRemove: onRemove,
  onBack,
  onForward,
  disabledPreInsert: disabledPreInsert,
  disabledInsert: disabledInsert,
  disabledPreRemove: disabledPreRemove,
  disabledRemove: disabledRemove,
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
        onClick={onPreInsert}
        disabled={disabledPreInsert}
        className="px-3 py-1 bg-blue-300 text-white rounded disabled:opacity-50"
      >
        PreInsert
      </button>
      <button
        onClick={onInsert}
        disabled={disabledInsert}
        className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        Insert
      </button>
      <button
        onClick={onPreRemove}
        disabled={disabledPreRemove}
        className="px-3 py-1 bg-red-300 text-white rounded disabled:opacity-50"
      >
        PreRemove
      </button>
      <button
        onClick={onRemove}
        disabled={disabledRemove}
        className="px-3 py-1 bg-red-500 text-white rounded disabled:opacity-50"
      >
        Remove
      </button>
    </div>
  );
}
