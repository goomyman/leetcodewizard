"use client";

import React, { useState } from "react";
import StackRenderer from "./StackRenderer";
import ArrayRenderer from "./ArrayRenderer";
import { Control, StackControl, ArrayControl } from "./ControlTypes";
import { initialControls } from "./InitialData";

interface ControlManagerProps {
  initialData?: { controls: Control[] };
}

export default function ControlManager({ initialData }: ControlManagerProps) {
  const [controls, setControls] = useState<Control[]>(initialData?.controls || []);
  const [sliderValue, setSliderValue] = useState(0);
  const [jsonInput, setJsonInput] = useState("");

  /** Upload JSON from textarea or file */
  const handleUpload = (data: { controls: Control[] }) => {
    setControls(data.controls);
    setSliderValue(0);
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

  /** Max steps for slider */
  const maxSteps = Math.max(
    ...controls.map(c => {
      if (c.type === "stack") return (c as StackControl).items.length;
      if (c.type === "array") return (c as ArrayControl).updates?.length ?? 1;
      return 1;
    }),
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
        {controls.map(control => {
          if (control.type === "stack") {
            return (
              <StackRenderer
                key={control.id}
                control={control as StackControl}
                sliderValue={sliderValue}
              />
            );
          }
          if (control.type === "array") {
            return (
              <ArrayRenderer
                key={control.id}
                control={control as ArrayControl}
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
