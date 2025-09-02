"use client";

import React from "react";
import { ArrayControl } from "./ControlTypes";

interface ArrayRendererProps {
  control: ArrayControl;
  sliderValue: number;
}

const CELL_SIZE = 60;

export default function ArrayRenderer({ control, sliderValue }: ArrayRendererProps) {
  const currentValues = Array.from({ length: control.size }, (_, i) => {
    // Apply updates up to sliderValue
    const update = control.updates?.slice(0, sliderValue + 1).find(u => u.index === i);
    return update?.value ?? null;
  });

  return (
    <div className="flex flex-col gap-2 items-center">
      <h3 className="text-white font-semibold">{control.id}</h3>
      <div className="flex">
        {currentValues.map((val, idx) => (
          <div
            key={idx}
            style={{
              width: CELL_SIZE,
              height: CELL_SIZE,
              border: "2px solid white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 2,
              backgroundColor: val ? "#4ade80" : "#1f2937",
            }}
            className="text-white font-bold"
          >
            {val ?? ""}
          </div>
        ))}
      </div>
    </div>
  );
}
