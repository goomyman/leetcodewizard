"use client";

import React, { useState, useRef } from "react";
import StackRenderer from "./StackRenderer";
import ArrayRenderer from "./ArrayRenderer";
import {
  Control,
  ControlItem,
  ControlType,
  ControlItemState,
  getRandomColor,
} from "./ControlTypes";
import { BatchProcessor, Batch } from "./BatchProcessor";

interface ControlManagerProps {
  initialData?: { controls: Control<ControlItem>[] };
}

export default function ControlManager({ initialData }: ControlManagerProps) {
  const [controls, setControls] = useState<Control<ControlItem>[]>(
    initialData?.controls || []
  );
  const [sliderValue, setSliderValue] = useState(0);
  const [jsonInput, setJsonInput] = useState("");

  const batchProcessors = useRef<BatchProcessor<ControlItem>[]>(
    (initialData?.controls || []).map(
      c => new BatchProcessor<ControlItem>([c.items || []])
    )
  );

  const getMaxSteps = () =>
    Math.max(...batchProcessors.current.map(bp => bp.getHistory().length), 1);

  const handleUpload = (data: { controls: Control<ControlItem>[] }) => {
    setControls(data.controls);

    batchProcessors.current = data.controls.map(
      (control, idx) => batchProcessors.current[idx] || new BatchProcessor([control.items || []])
    );

    data.controls.forEach((control, idx) => {
      const rawBatch: any = control.batch ?? {};

      const batch: Batch<ControlItem> = {
        inserts: rawBatch.inserts?.map((i: any) => ({
          input: {
            id: i.input.id ?? `temp-${Math.random()}`,
            value: i.input.value ?? 0,
            color: i.input.color ?? getRandomColor(),
            level: i.input.level ?? null,
          } as ControlItem,
          targetIndex: i.index,
        })),
        updates: rawBatch.updates?.map((u: any) => ({
          input: {
            id: u.input.id ?? `temp-${Math.random()}`,
            value: u.input.value ?? 0,
            color: u.input.color ?? getRandomColor(),
            level: u.input.level ?? null,
          } as ControlItem,
          targetIndex: u.index,
        })),
        deletes: rawBatch.deletes?.map((d: any) => ({ targetIndex: d.index })),
      };

      batchProcessors.current[idx].applyBatch(batch);
    });

    setSliderValue(getMaxSteps() - 1);
  };

  const handleFileUpload = async (file: File) => {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      handleUpload(parsed);
    } catch {
      alert("Invalid JSON file");
    }
  };

  const goBack = () => setSliderValue(v => Math.max(0, v - 1));
  const goForward = () => setSliderValue(v => Math.min(getMaxSteps() - 1, v + 1));

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <h2 className="text-lg font-bold text-white">Control Manager</h2>

      <textarea
        placeholder="Paste JSON here"
        className="w-full max-w-3xl p-2 border rounded font-mono text-sm"
        rows={5}
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
      />

      <div className="flex gap-2">
        <button
          onClick={() => {
            try {
              const parsed = JSON.parse(jsonInput);
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
          onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
          className="px-3 py-1 bg-gray-300 rounded cursor-pointer"
        />
      </div>

      <div className="flex items-center gap-4">
        <button onClick={goBack} className="px-2 py-1 bg-gray-500 text-white rounded">
          &lt;
        </button>
        <input
          type="range"
          min={0}
          max={getMaxSteps() - 1}
          value={sliderValue}
          onChange={(e) => setSliderValue(Number(e.target.value))}
          className="w-96"
        />
        <button onClick={goForward} className="px-2 py-1 bg-gray-500 text-white rounded">
          &gt;
        </button>
      </div>
      <p className="text-white">Step: {sliderValue}</p>

      <div className="flex flex-col gap-6 w-full items-center">
        {controls.map((control, idx) => {
          const currentItems = batchProcessors.current[idx]?.getHistory()[sliderValue] || [];
          const controlWithCurrentItems = { ...control, items: currentItems };

          if (control.type === ControlType.Stack)
            return <StackRenderer key={control.id} control={controlWithCurrentItems} />;

          if (control.type === ControlType.Array)
            return <ArrayRenderer key={control.id} control={controlWithCurrentItems} />;

          return null;
        })}
      </div>
    </div>
  );
}
