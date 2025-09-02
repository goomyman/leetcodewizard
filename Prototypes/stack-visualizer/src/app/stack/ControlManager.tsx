"use client";

import React, { useState } from "react";
import StackRenderer from "./StackRenderer";
import ArrayRenderer from "./ArrayRenderer";
import { StackControl, ArrayControl, HistoryItem } from "./ControlTypes";
import { BatchProcessor, UploadBatch } from "./BatchProcessor";

interface ControlManagerProps {
  initialData?: { controls: (StackControl | ArrayControl)[] };
}

export default function ControlManager({ initialData }: ControlManagerProps) {
  const [controls, setControls] = useState<(StackControl | ArrayControl)[]>(
    initialData?.controls || []
  );

  const [sliderValue, setSliderValue] = useState(0);
  const [jsonInput, setJsonInput] = useState("");

  // Create a BatchProcessor per control
  const batchProcessors = React.useRef(
    controls.map(c => new BatchProcessor<HistoryItem>([c.items || []]))
  );

  /** Upload JSON from textarea or file */
  const handleUpload = (data: { controls: (StackControl | ArrayControl)[] }) => {
    setControls(data.controls);
    setSliderValue(0);

    // Apply batch to each processor
    data.controls.forEach((control, idx) => {
      batchProcessors.current[idx].applyBatch(control.batch ?? {});
    });
  };

  /** File upload */
  const handleFileUpload = async (file: File) => {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      handleUpload(parsed);
    } catch {
      alert("Invalid JSON file");
    }
  };

  /** Max slider value is the max history length across all controls */
  const maxSteps = Math.max(
    ...batchProcessors.current.map(bp => bp.getHistory().length),
    1
  );

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <h2 className="text-lg font-bold text-white">Control Manager</h2>

      {/* JSON Input */}
      <textarea
        placeholder='Paste JSON here'
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
          onChange={e => e.target.files && handleFileUpload(e.target.files[0])}
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
          const history = batchProcessors.current[idx].getHistory();
          const currentStep = history[Math.min(sliderValue, history.length - 1)];

          if (control.type === "stack") {
            return (
              <StackRenderer
                key={control.id}
                control={{ ...control, items: currentStep }}
                sliderValue={sliderValue}
              />
            );
          }

          if (control.type === "array") {
            return (
              <ArrayRenderer
                key={control.id}
                control={{ ...control, items: currentStep }}
                sliderValue={sliderValue}
              />
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}
