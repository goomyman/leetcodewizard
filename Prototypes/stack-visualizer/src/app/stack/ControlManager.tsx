"use client";

import React, { useState, useRef } from "react";
import StackRenderer from "./StackRenderer";
import ArrayRenderer from "./ArrayRenderer";
import { Control, ControlItem, ControlType, ControlItemState } from "./ControlTypes";

interface ControlManagerProps {
  initialData?: { controls: Control<ControlItem>[] };
}

export default function ControlManager({ initialData }: ControlManagerProps) {
  const [controls, setControls] = useState<Control<ControlItem>[]>(
    initialData?.controls || []
  );
  const [sliderValue, setSliderValue] = useState(0);
  const [jsonInput, setJsonInput] = useState("");

  // History per control
  const controlHistories = useRef<ControlItem[][][]>(
    controls.map(c => [c.items || []])
  );

  // Staged PreInsert / PreRemove items per control
  const stagedPreInserts = useRef<ControlItem[][]>(
    controls.map(() => [])
  );
  const stagedPreRemoves = useRef<(number | string)[][]>(
    controls.map(() => [])
  );

  /** Apply uploaded data */
  /** Apply uploaded data */
  const handleUpload = (data: { controls: Control<ControlItem>[] }) => {
    const newControls = data.controls;
    setControls(newControls);

    newControls.forEach((control, idx) => {
      const current =
        [...controlHistories.current[idx]?.[controlHistories.current[idx].length - 1] || []];

      // 1️⃣ Commit previous PreRemoves
      const committedRemoves = stagedPreRemoves.current[idx] || [];
      let updated = current.filter(item => !committedRemoves.includes(item.id));

      // 2️⃣ Commit previous PreInserts
      updated = updated.map(item =>
        item.state === ControlItemState.PreInsert || item.state === ControlItemState.PreUpdate
          ? { ...item, state: ControlItemState.Inserted }
          : item
      );

      // 3️⃣ Apply new deletes as PreRemove
      const deleteIndices = (control.batch?.deletes ?? []).filter(i => i >= 0 && i < updated.length);
      updated = updated.map((item, i) =>
        deleteIndices.includes(i) ? { ...item, state: ControlItemState.PreRemove } : item
      );

      // 4️⃣ Apply new inserts as PreInsert
      const insertItems = (control.batch?.inserts ?? []).map(
        ({ index, input }) =>
        ({
          ...input,
          id: Date.now() + Math.random(),
          state: ControlItemState.PreInsert,
          __index: index, // temporary property for sorting
        } as ControlItem & { __index: number }) // <-- cast locally
      );

      // Sort inserts by temporary __index
      insertItems
        .sort((a, b) => (a.__index ?? 0) - (b.__index ?? 0))
        .forEach(item => {
          const idxInsert = Math.min(item.__index ?? 0, updated.length);
          updated.splice(idxInsert, 0, item);
          delete (item as any).__index; // remove temporary property after insertion
        });

      // 5️⃣ Save updated history
      controlHistories.current[idx] = [
        ...(controlHistories.current[idx] || []),
        updated,
      ];

      // 6️⃣ Stage pre-inserts & pre-removes for next batch
      stagedPreInserts.current[idx] = insertItems;
      stagedPreRemoves.current[idx] = updated
        .filter(item => item.state === ControlItemState.PreRemove)
        .map(item => item.id);
    });

    // Move slider to latest step
    const maxSteps = Math.max(...controlHistories.current.map(h => h.length));
    setSliderValue(maxSteps - 1);
  };

  /** File upload handler */
  const handleFileUpload = async (file: File) => {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      handleUpload(parsed);
    } catch {
      alert("Invalid JSON file");
    }
  };

  /** Slider navigation */
  const goBack = () => setSliderValue(v => Math.max(0, v - 1));
  const goForward = () => {
    const maxSteps = Math.max(...controlHistories.current.map(h => h.length));
    setSliderValue(v => Math.min(maxSteps - 1, v + 1));
  };

  const maxSteps = Math.max(...controlHistories.current.map(h => h.length), 1);

  return (
    <div className="flex flex-col items-center gap-6 w-full p-4">
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
          onChange={e => e.target.files && handleFileUpload(e.target.files[0])}
          className="px-3 py-1 bg-gray-300 rounded cursor-pointer"
        />
      </div>

      {/* Slider + navigation */}
      <div className="flex items-center gap-4">
        <button onClick={goBack} className="px-2 py-1 bg-gray-500 text-white rounded">&lt;</button>
        <input
          type="range"
          min={0}
          max={maxSteps - 1}
          value={sliderValue}
          onChange={e => setSliderValue(Number(e.target.value))}
          className="w-96"
        />
        <button onClick={goForward} className="px-2 py-1 bg-gray-500 text-white rounded">&gt;</button>
      </div>
      <p className="text-white">Step: {sliderValue}</p>

      {/* Render controls */}
      <div className="flex flex-col gap-6 w-full items-center">
        {controls.map((control, idx) => {
          const currentItems =
            controlHistories.current[idx][sliderValue] || [];

          const controlWithCurrentItems = { ...control, items: currentItems };

          if (control.type === ControlType.Stack) {
            return <StackRenderer key={control.id} control={controlWithCurrentItems} />;
          }

          if (control.type === ControlType.Array) {
            return <ArrayRenderer key={control.id} control={controlWithCurrentItems} />;
          }

          return null;
        })}
      </div>
    </div>
  );
}
