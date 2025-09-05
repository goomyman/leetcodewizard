"use client";

import React from "react";
import { Control, ControlItem, ControlItemState } from "./ControlTypes";
import StackItem from "./StackItem";
import { STACK_ITEM_HEIGHT, STACK_ITEM_WIDTH } from "./StackItemConstants";

interface StackRendererProps {
  control: Control<ControlItem>;
  onRemoved?: (id: string) => void;
  minItems?: number; // optional, default container size
}

export default function StackRenderer({
  control,
  onRemoved,
  minItems = 20,
}: StackRendererProps) {
  // Keep container height fixed
  const containerHeight = minItems * STACK_ITEM_HEIGHT;

  // Ensure items have unique keys for React/Framer Motion to re-render on state changes
  const itemsWithKeys = control.items.map(item => ({
    ...item,
    _uniqueKey: `${item.id}-${item.state}-${item.targetIndex ?? 0}`,
  }));

  return (
    <div
      className="relative border p-2 bg-gray-800 rounded"
      style={{
        width: STACK_ITEM_WIDTH + 20,
        height: containerHeight,
      }}
    >
      <h3 className="text-white font-semibold">{control.id}</h3>

      {itemsWithKeys.map((item, idx) => (
        <StackItem
          key={item._uniqueKey}
          item={item}
          index={idx} // 0 = bottom of stack
          onRemoved={onRemoved}
        />
      ))}
    </div>
  );
}
