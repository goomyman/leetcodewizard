"use client";

import React from "react";
import ArrayItem from "./ArrayItem";
import { Control, ControlItemState, HistoryItem } from "./ControlTypes";

interface ArrayRendererProps {
  control: Control; // generic union
  sliderValue: number;
}

export default function ArrayRenderer({ control }: ArrayRendererProps) {
  return (
    <div className="flex flex-col gap-2 items-center">
      <h3 className="text-white font-semibold">{control.id}</h3>
      <div className="flex">
        {(control.items as HistoryItem[]).map((item, idx) => (
          <ArrayItem
            key={item.id}
            item={item}
            index={idx}
            stopShaking={item.state !== ControlItemState.PreUpdate}
          />
        ))}
      </div>
    </div>
  );
}
