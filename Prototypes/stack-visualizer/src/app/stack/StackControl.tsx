"use client";

import { useState } from "react";

interface StackControlProps {
  onPreInsert: (index: number, text?: string) => void;
  onInsert: (index: number, text?: string) => void;
  onPreRemove: (index: number) => void;
  onRemove: (index: number) => void;
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
  onPreInsert,
  onInsert,
  onPreRemove,
  onRemove,
  onBack,
  onForward,
  disabledPreInsert,
  disabledInsert,
  disabledPreRemove,
  disabledRemove,
  canGoBack,
  canGoForward,
}: StackControlProps) {
  const [index, setIndex] = useState<number>(0);
  const [text, setText] = useState<string>("");

  return (
    <div className="stack-control flex items-center gap-2 p-2 bg-gray-800 rounded w-full overflow-x-auto w-[100vw] min-w-[900px]">
      {/* History buttons */}
      <button
        onClick={onBack}
        disabled={!canGoBack}
        className="px-2 py-1 bg-gray-600 text-white rounded disabled:opacity-50"
      >
        Back
      </button>
      <button
        onClick={onForward}
        disabled={!canGoForward}
        className="px-2 py-1 bg-gray-600 text-white rounded disabled:opacity-50"
      >
        Forward
      </button>

      {/* Index input */}
      <input
        type="number"
        className="w-16 px-2 py-1 rounded border border-gray-400 text-black"
        min={0}
        value={index}
        onChange={(e) => setIndex(Number(e.target.value))}
      />

      {/* Text input */}
      <input
        type="text"
        className="px-2 py-1 rounded border border-gray-400 text-black"
        placeholder="Optional text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      {/* Insert buttons */}
      <button
        onClick={() => onPreInsert(index, text)}
        disabled={disabledPreInsert}
        className="px-2 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        PreInsert
      </button>
      <button
        onClick={() => onInsert(index, text)}
        disabled={disabledInsert}
        className="px-2 py-1 bg-blue-700 text-white rounded disabled:opacity-50"
      >
        Insert
      </button>

      {/* Remove buttons */}
      <button
        onClick={() => onPreRemove(index)}
        disabled={disabledPreRemove}
        className="px-2 py-1 bg-red-500 text-white rounded disabled:opacity-50"
      >
        PreRemove
      </button>
      <button
        onClick={() => onRemove(index)}
        disabled={disabledRemove}
        className="px-2 py-1 bg-red-700 text-white rounded disabled:opacity-50"
      >
        Remove
      </button>
    </div>
  );
}
