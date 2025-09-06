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
  // Filter out fully removed items for calculating visible positions
  const itemsForLayout = control.items.filter(
    item => item.state !== ControlItemState.Removed
  );

  return (
    <div
      className="relative flex flex-col border p-2 bg-gray-800 rounded"
      style={{
        width: STACK_ITEM_WIDTH + 20,
        height: Math.max(20, itemsForLayout.length) * STACK_ITEM_HEIGHT, // min height 20
      }}
    >
      <h3 className="text-white font-semibold">{control.id}</h3>

      {control.items.map((item) => {
        // Compute visible index for layout after removing removed items
        const visibleIndex = itemsForLayout.findIndex(i => i.id === item.id);
        // If item is fully removed, assign -1 so it stays hidden in the stack
        const safeVisibleIndex = visibleIndex >= 0 ? visibleIndex : -1;

        return (
          <StackItem
            key={`${item.id}-${item.state}`} // ensures Framer Motion re-renders on state change
            item={item}
            visibleIndex={safeVisibleIndex}
            onRemoved={onRemoved}
          />
        );
      })}
    </div>
  );
}
