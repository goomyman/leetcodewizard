"use client";

import React, { useState } from "react";
import Stack from "./Stack";
import { StackItemType, StackItemInputDto, getRandomColor, StackItemState } from "./StackItemConstants";

interface UploadData {
  inserts?: { index: number; input: StackItemInputDto }[];
  deletes?: number[];
}

export default function StackManager() {
  const [history, setHistory] = useState<StackItemType[][]>([[]]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stagedPreInserts, setStagedPreInserts] = useState<StackItemType[]>([]);
  const [stagedPreRemoves, setStagedPreRemoves] = useState<number[]>([]);
  const [jsonInput, setJsonInput] = useState("");

  const currentStack = history[currentIndex];

  /** Helper to create a StackItem */
  const makeStackItem = (input: StackItemInputDto, state: StackItemState) => ({
    id: Date.now() + Math.random(),
    text: input.text,
    level: input.level ?? null,
    color: input.color ?? getRandomColor(),
    state,
    __index: undefined as number | undefined,
  });

  /** Apply Upload JSON */
  const handleUpload = (data: UploadData) => {
    let newStack = [...currentStack];

    // Resolve previous pre-inserts
    newStack = newStack.map(item =>
      item.state === StackItemState.PreInsert ? { ...item, state: StackItemState.Inserted } : item
    );
    // Resolve previous pre-removes
    if (stagedPreRemoves.length > 0) {
      [...stagedPreRemoves]
        .sort((a, b) => b - a)
        .forEach(idx => {
          if (idx >= 0 && idx < newStack.length) newStack.splice(idx, 1);
        });
    }

    // Apply new deletes as PreRemove
    const deleteIndices: number[] = Array.from(new Set(data.deletes?.filter(i => i >= 0 && i < newStack.length) ?? []));
    newStack = newStack.map((item, i) =>
      deleteIndices.includes(i) ? { ...item, state: StackItemState.PreRemove } : item
    );

    // Apply new inserts as PreInsert
    const insertItems: StackItemType[] =
      data.inserts?.map(({ index, input }) => {
        const item = makeStackItem(input, StackItemState.PreInsert);
        item.__index = index;
        return item;
      }) ?? [];

  insertItems
    .sort((a, b) => (b as any).__index - (a as any).__index)
    .forEach(item => {
      const idx = Math.min((item as any).__index, newStack.length);
      newStack.splice(idx, 0, item);
      delete (item as any).__index;
    });
    
    // Update history and staged items
    const newHistory = history.slice(0, currentIndex + 1);
    setHistory([...newHistory, newStack]);
    setCurrentIndex(newHistory.length);
    setStagedPreInserts(insertItems);
    setStagedPreRemoves(deleteIndices);
  };

  /** File upload handler */
  const handleFileUpload = async (file: File) => {
    try {
      const text = await file.text();
      const parsed: UploadData = JSON.parse(text);
      handleUpload(parsed);
    } catch {
      alert("Invalid JSON file");
    }
  };

  /** Forward / Back / Slider */
  const goBack = () => currentIndex > 0 && setCurrentIndex(currentIndex - 1);
  const goForward = () => currentIndex < history.length - 1 && setCurrentIndex(currentIndex + 1);
  const scrubHistory = (index: number) => setCurrentIndex(index);

  return (
    <div className="flex flex-col gap-4 w-full p-4 bg-gray-900 rounded-lg shadow">
      <h2 className="text-lg font-bold">Stack Manager</h2>

      {/* JSON input */}
      <textarea
        placeholder='Paste JSON here: { "inserts": [{ "index":0, "input":{"text":"A"}}], "deletes": [2,3] }'
        className="w-full p-2 border rounded font-mono text-sm"
        rows={5}
        value={jsonInput}
        onChange={e => setJsonInput(e.target.value)}
      />

      {/* Upload button */}
      <div className="flex gap-2">
        <button
          onClick={() => {
            try {
              const parsed: UploadData = JSON.parse(jsonInput);
              handleUpload(parsed);
            } catch {
              alert("Invalid JSON input");
            }
          }}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          Upload
        </button>

        <input
          type="file"
          accept="application/json"
          onChange={e => e.target.files && handleFileUpload(e.target.files[0])}
          className="px-3 py-1 bg-gray-300 rounded cursor-pointer"
        />
      </div>

      {/* Navigation */}
      <div className="flex gap-2">
        <button
          onClick={goBack}
          disabled={currentIndex === 0}
          className="px-3 py-1 bg-gray-500 text-white rounded disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={goForward}
          disabled={currentIndex === history.length - 1}
          className="px-3 py-1 bg-gray-500 text-white rounded disabled:opacity-50"
        >
          Forward
        </button>
      </div>

      {/* Slider */}
      <input
        type="range"
        min={0}
        max={history.length - 1}
        value={currentIndex}
        onChange={e => scrubHistory(Number(e.target.value))}
        className="w-full"
      />

      {/* Stack display */}
      <div className="p-2 bg-gray border rounded">
        <h3 className="font-semibold ">Current Stack</h3>
        <Stack stack={currentStack} />
      </div>
    </div>
  );
}
