"use client";

import React from "react";
import ArrayItem from "./ArrayItem";
import { Control, ControlItem, ControlItemState } from "./ControlTypes";
import { ARRAY_ITEM_SIZE } from "./ArrayItemConstants";

interface ArrayRendererProps {
  control: Control<ControlItem>;
  onRemoved?: (id: string) => void;
}

export default function ArrayRenderer({ control, onRemoved }: ArrayRendererProps) {
  // Compute container width based on the maximum target index of all items
  const maxTargetIndex =
    control.items.length > 0
      ? Math.max(...control.items.map((item) => item.targetIndex ?? 0))
      : 0;

  const containerWidth = (maxTargetIndex + 1) * ARRAY_ITEM_SIZE;

  return (
    <div className="flex flex-col items-start"> {/* left-align */}
      <h3 className="text-white font-semibold">{control.id}</h3>
      <div
        className="relative"
        style={{
          width: containerWidth,
          height: ARRAY_ITEM_SIZE,
        }}
      >
        {control.items.map((item, idx) => {
          // Use targetIndex for floating items
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
