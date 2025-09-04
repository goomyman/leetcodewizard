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
  const GAP = 8;

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-white font-semibold">{control.id}</h3>
      <div className="relative flex">
        {control.items.map((item, idx) => {

          // Use targetIndex if floating, else normal idx
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
