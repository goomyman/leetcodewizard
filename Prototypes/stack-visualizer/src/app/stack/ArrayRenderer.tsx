"use client";

import React from "react";
import ArrayItem from "./ArrayItem";
import { Control, ControlItem } from "./ControlTypes";
import { ARRAY_ITEM_SIZE } from "./ArrayItemConstants";

interface ArrayRendererProps {
  control: Control<ControlItem>;
  onRemoved?: (id: string) => void;
}

export default function ArrayRenderer({ control, onRemoved }: ArrayRendererProps) {
  const containerWidth = Math.max(control.items.length, 5) * ARRAY_ITEM_SIZE; // min 5 slots

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-white font-semibold">{control.id}</h3>
      <div className="relative" style={{ height: ARRAY_ITEM_SIZE, width: containerWidth }}>
        {control.items.map((item, idx) => {
          // Always use targetIndex if present
          const slotIndex = item.targetIndex ?? idx;

          return (
            <ArrayItem
              key={item.id}
              item={item}
              index={slotIndex}
              onRemoved={onRemoved}
            />
          );
        })}
      </div>
    </div>
  );
}
