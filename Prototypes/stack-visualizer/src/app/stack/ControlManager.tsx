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

      {/* Render controls */}
      <div className="flex flex-col gap-6 w-full items-center">
        {controls.map((control, idx) => {
          const currentItems =
            batchProcessors.current[idx].getHistory()[sliderValue] || [];

          const controlWithCurrentItems = { ...control, items: currentItems };

          if (control.type === "stack") {
            return (
              <StackRenderer
                key={control.id}
                control={controlWithCurrentItems}
              />
            );
          }

          if (control.type === "array") {
            return (
              <ArrayRenderer
                key={control.id}
                control={controlWithCurrentItems}
              />
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}
