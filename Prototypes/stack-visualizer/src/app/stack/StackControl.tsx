"use client";

import React, { useState } from "react";
import { StackItemInputDto } from "./StackItemConstants";

interface StackControlProps {
  onInsert: (items: { index: number; input: StackItemInputDto }[]) => void;
  onPreInsert: (items: { index: number; input: StackItemInputDto }[]) => void;
  onPreRemove: (indices: number[]) => void;
  onCompletePreInsert: () => void;
  onCompletePreRemove: () => void;
  onRemove: (indices?: number[]) => void;
  onBack: () => void;
  onForward: () => void;

  disabledPreInsert?: boolean;
  disabledInsert?: boolean;
  disabledPreRemove?: boolean;
  disabledCompletePreInsert?: boolean;
  disabledCompletePreRemove?: boolean;
  disabledRemove?: boolean;
  canGoBack?: boolean;
  canGoForward?: boolean;
}

export default function StackControl({
  onInsert,
  onPreInsert,
  onPreRemove,
  onCompletePreInsert,
  onCompletePreRemove,
  onRemove,
  onBack,
  onForward,
  disabledPreInsert,
  disabledInsert,
  disabledPreRemove,
  disabledCompletePreInsert,
  disabledCompletePreRemove,
  disabledRemove,
  canGoBack,
  canGoForward,
}: StackControlProps) {
  const [textInput, setTextInput] = useState("");
  const [indexInput, setIndexInput] = useState("");

  // Parse comma-delimited texts
  const parseTexts = (): string[] =>
    textInput
      .split(",")
      .map(t => t.trim())
      .filter(t => t);

  // Parse comma-delimited indices
  const parseIndices = (): number[] =>
    indexInput
      .split(",")
      .map(i => parseInt(i.trim(), 10))
      .filter(i => !isNaN(i) && i >= 0);

  // Map indices to texts
  const mapIndexToText = (): { index: number; input: StackItemInputDto }[] => {
    const texts = parseTexts();
    const indices = parseIndices();
    const length = Math.min(texts.length, indices.length);

    const mapped: { index: number; input: StackItemInputDto }[] = [];
    for (let i = 0; i < length; i++) {
      mapped.push({ index: indices[i], input: { text: texts[i], level: null, color: undefined } });
    }
    return mapped;
  };

  return (
    <div className="flex flex-col gap-2 w-full">

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => onPreInsert(mapIndexToText())}
          disabled={disabledPreInsert}
          className="px-2 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          PreInsert
        </button>

        <button
          onClick={onCompletePreInsert}
          disabled={disabledCompletePreInsert}
          className="px-2 py-1 bg-blue-700 text-white rounded disabled:opacity-50"
        >
          Complete PreInsert
        </button>

        <button
          onClick={() => onInsert(mapIndexToText())}
          disabled={disabledInsert}
          className="px-2 py-1 bg-green-500 text-white rounded disabled:opacity-50"
        >
          Insert
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => onPreRemove(parseIndices())}
          disabled={disabledPreRemove}
          className="px-2 py-1 bg-red-500 text-white rounded disabled:opacity-50"
        >
          PreRemove
        </button>

        <button
          onClick={onCompletePreRemove}
          disabled={disabledCompletePreRemove}
          className="px-2 py-1 bg-red-700 text-white rounded disabled:opacity-50"
        >
          Complete PreRemove
        </button>

        <button
          onClick={() => onRemove(parseIndices())}
          disabled={disabledRemove}
          className="px-2 py-1 bg-green-700 text-white rounded disabled:opacity-50"
        >
          Remove
        </button>
      </div>

      <div className="flex gap-2 flex-wrap mt-2">
        <input
          value={textInput}
          onChange={e => setTextInput(e.target.value)}
          placeholder="Comma-separated texts"
          className="px-2 py-1 border rounded flex-1"
        />
        <input
          value={indexInput}
          onChange={e => setIndexInput(e.target.value)}
          placeholder="Comma-separated indices"
          className="px-2 py-1 border rounded flex-1"
        />
      </div>

      <div className="flex gap-2 mt-2">
        <button
          onClick={onBack}
          disabled={!canGoBack}
          className="px-2 py-1 bg-gray-400 text-white rounded disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={onForward}
          disabled={!canGoForward}
          className="px-2 py-1 bg-gray-400 text-white rounded disabled:opacity-50"
        >
          Forward
        </button>
      </div>
    </div>
  );
}
