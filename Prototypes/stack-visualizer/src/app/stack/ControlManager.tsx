"use client";

import React, { useState, useRef } from "react";
import StackRenderer from "./StackRenderer";
import ArrayRenderer from "./ArrayRenderer";
import { Control, ControlItem } from "./ControlTypes";
import { BatchProcessor } from "./BatchProcessor";

interface ControlManagerProps {
  initialData?: { controls: Control<ControlItem>[] };
}

export default function ControlManager({ initialData }: ControlManagerProps) {
  const [controls, setControls] = useState<Control<ControlItem>[]>(
    initialData?.controls || []
  );
  const [sliderValue, setSliderValue] = useState(0);
  const [jsonInput, setJsonInput] = useState("");

  // Batch processors per control
  const batchProcessors = useRef(
    controls.map(c => new BatchProcessor<ControlItem>([c.items || []]))
  );

  const handleUpload = (data: { controls: Control<ControlItem>[] }) => {
    setControls(data.controls);
    setSliderValue(0);

    data.controls.forEach((control, idx) => {
      const batch = control.batch ?? {};
      batchProcessors.current[idx].applyBatch(batch);
    });
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

  // Max steps for slider
  const maxSteps = Math.max(
    ...batchProcessors.current.map(bp => bp.getHistory().length),
    1
  );

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <h2 className="text-lg font-bold text-white">Control Manager</h2>

      {/* JSON Input */}
      <textarea
        placeholder="Paste JSON here"
        className="w-full max-w-3xl p-2 border rounded font-mono text-sm"
        rows={5}
        value={jsonInput}
        onChange={e => setJsonInput(e.target.value)}
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
          onChange={e =>
            e.target.files && handleFileUpload(e.target.files[0])
          }
          className="px-3 py-1 bg-gray-300 rounded cursor-pointer"
        />
      </div>

      {/* Slider */}
      <input
        type="range"
        min={0}
        max={maxSteps - 1}
        value={sliderValue}
        onChange={e => setSliderValue(Number(e.target.value))}
        className="w-full max-w-2xl"
      />
      <p className="text-white">Step: {sliderValue}</p>

      {/* Grid container */}
      <div className="grid w-full h-full gap-4"
        style={{
          gridTemplateColumns: "repeat(3, 1fr)",
          gridTemplateRows: "repeat(2, auto)"
        }}
      >
        {controls.map((control, idx) => {
          const currentItems =
            batchProcessors.current[idx].getHistory()[sliderValue] || [];

          const controlWithCurrentItems = { ...control, items: currentItems };

          const col = control.gridPosition?.col || 1;
          const row = control.gridPosition?.row || 1;
          const colSpan = control.gridPosition?.colSpan || 1;
          const rowSpan = control.gridPosition?.rowSpan || 1;

          return (
            <div
              key={control.id}
              style={{
                gridColumn: `${col} / span ${colSpan}`,
                gridRow: `${row} / span ${rowSpan}`
              }}
            >
              {control.type === "array" ? (
                <ArrayRenderer control={controlWithCurrentItems} />
              ) : (
                <StackRenderer control={controlWithCurrentItems} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
