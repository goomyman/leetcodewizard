"use client";

import React from "react";
import { Control, ControlItem, ControlItemState } from "./ControlTypes";
import StackItem from "./StackItem";
import { STACK_ITEM_HEIGHT, STACK_ITEM_WIDTH } from "./StackItemConstants";

interface StackRendererProps {
  control: Control<ControlItem>;
  onRemoved?: (id: string) => void;
}

export default function StackRenderer({ control, onRemoved }: StackRendererProps) {

  // Minimum stack height in items
  const minItems = 20; 

  // Compute container height based on max of visible items or minItems
  const containerHeight = minItems * STACK_ITEM_HEIGHT;

  return (
    <div
      className="relative flex flex-col border p-2 bg-gray-800 rounded"
      style={{
        width: STACK_ITEM_WIDTH + 20,
        height: containerHeight,
      }}
    >
      <h3 className="text-white font-semibold">{control.id}</h3>

      {control.items.map((item, idx) => (
        <StackItem
          key={item.id}
          item={item}
          index={idx} // index = 0 is bottom
          onRemoved={onRemoved}
        />
      ))}
    </div>
  );
}
