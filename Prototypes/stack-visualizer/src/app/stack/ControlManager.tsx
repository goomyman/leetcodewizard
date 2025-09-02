"use client";

import React, { useState } from "react";
import StackRenderer from "./StackRenderer";
import ArrayRenderer from "./ArrayRenderer";
import { StackControl, ArrayControl, Control } from "./ControlTypes";

export default function ControlManager() {
  const [jsonInput, setJsonInput] = useState("");
  const [controls, setControls] = useState<Control[]>([]);
  const [sliderValue, setSliderValue] = useState(0);

  // Max steps for the slider (highest history length / updates across all controls)
  const maxSteps = controls.reduce((max, c) => {
    if (c.type === "stack") return Math.max(max, (c as StackControl).items?.length || 0);
    if (c.type === "array") return Math.max(max, (c as ArrayControl).updates?.length || 0);
    return max;
  }, 0);

  const handleUpload = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (!parsed.controls || !Array.isArray(parsed.controls)) {
        alert("JSON must have a 'controls' array");
        return;
      }
      setControls(parsed.controls);
      setSliderValue(0);
    } catch (e) {
      alert("Invalid JSON input");
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      const text = await file.text();
      setJsonInput(text);
      handleUpload();
    } catch {
      alert("Invalid JSON file");
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-4xl p-4">
      <h2 className="text-xl font-bold">Control Manager</h2>

      {/* JSON input */}
      <textarea
        placeholder="Paste JSON here with 'controls' array..."
        className="w-full p-2 border rounded font-mono text-sm"
        rows={6}
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
      />

      {/* Upload buttons */}
      <div className="flex gap-2">
        <button
          className="px-3 py-1 bg-blue-500 text-white rounded"
          onClick={handleUpload}
        >
          Upload
        </button>
        <input
          type="file"
          accept="application/json"
          className="px-3 py-1 bg-gray-300 rounded cursor-pointer"
          onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
        />
      </div>

      {/* Slider */}
      {controls.length > 0 && (
        <div className="flex flex-col items-center w-full">
          <input
            type="range"
            min={0}
            max={maxSteps}
            value={sliderValue}
            onChange={(e) => setSliderValue(Number(e.target.value))}
            className="w-full"
          />
          <p className="text-white">Step: {sliderValue}</p>
        </div>
      )}

      {/* Render all controls */}
      <div className="flex flex-col gap-4 w-full">
        {controls.map((control) => {
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
