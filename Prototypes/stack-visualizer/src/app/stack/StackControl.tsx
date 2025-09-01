"use client";

import { useState } from "react";

interface StackControlProps {
  onPreInsert: (index?: number, text?: string) => void;
  onInsert: (index?: number, text?: string) => void;
  onPreRemove: (index?: number) => void;
  onRemove: () => void;
  onCompletePreInsert: () => void;
  onCompletePreRemove: () => void;
  onBack: () => void;
  onForward: () => void;
  disabledPreInsert: boolean;
  disabledInsert: boolean;
  disabledPreRemove: boolean;
  disabledRemove: boolean;
  disabledCompletePreInsert: boolean;
  disabledCompletePreRemove: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
}

export default function StackControl({
  onPreInsert,
  onInsert,
  onPreRemove,
  onRemove,
  onCompletePreInsert,
  onCompletePreRemove,
  onBack,
  onForward,
  disabledPreInsert,
  disabledInsert,
  disabledPreRemove,
  disabledRemove,
  disabledCompletePreInsert,
  disabledCompletePreRemove,
  canGoBack,
  canGoForward,
}: StackControlProps) {
  const [index, setIndex] = useState<number>(0);
  const [text, setText] = useState<string>("");

  return (
    <div className="stack-control flex items-center gap-2 p-2 bg-gray-800 rounded w-full overflow-x-auto min-w-[900px]">
      {/* History */}
      <button onClick={onBack} disabled={!canGoBack} className="px-2 py-1 bg-gray-600 text-white rounded disabled:opacity-50">Back</button>
      <button onClick={onForward} disabled={!canGoForward} className="px-2 py-1 bg-gray-600 text-white rounded disabled:opacity-50">Forward</button>

      {/* Inputs */}
      <input type="number" className="w-16 px-2 py-1 rounded border border-gray-400 text-black" min={0} value={index} onChange={e => setIndex(Number(e.target.value))} />
      <input type="text" className="px-2 py-1 rounded border border-gray-400 text-black" placeholder="Optional text" value={text} onChange={e => setText(e.target.value)} />

      {/* Pre/Commit buttons */}
      <button onClick={() => onPreInsert(index, text)} disabled={disabledPreInsert} className="px-2 py-1 bg-blue-500 text-white rounded disabled:opacity-50">PreInsert</button>
      <button onClick={onCompletePreInsert} disabled={disabledCompletePreInsert} className="px-2 py-1 bg-blue-700 text-white rounded disabled:opacity-50">Complete PreInsert</button>
      <button onClick={() => onPreRemove(index)} disabled={disabledPreRemove} className="px-2 py-1 bg-red-500 text-white rounded disabled:opacity-50">PreRemove</button>
      <button onClick={onCompletePreRemove} disabled={disabledCompletePreRemove} className="px-2 py-1 bg-red-700 text-white rounded disabled:opacity-50">Complete PreRemove</button>

      {/* Direct actions */}
      <button onClick={() => onInsert(index, text)} disabled={disabledInsert} className="px-2 py-1 bg-green-500 text-white rounded disabled:opacity-50">Insert</button>
      <button onClick={onRemove} disabled={disabledRemove} className="px-2 py-1 bg-green-700 text-white rounded disabled:opacity-50">Remove</button>
    </div>
  );
}
