"use client";

import React, { useState } from "react";
import StackItem from "./StackItem";
import { Control, ControlItem, ControlItemState } from "./ControlTypes";
import { STACK_ITEM_HEIGHT, STACK_ITEM_WIDTH } from "./StackItemConstants";

interface StackRendererProps {
  control: Control<ControlItem>;
  onRemoved?: (id: string) => void;
}

export default function StackRenderer({ control, onRemoved }: StackRendererProps) {
  const [forceUpdate, setForceUpdate] = useState(0); // trigger rerender after animation
  const allItems = control.items;

  // Items that define the stack layout (exclude fully removed items)
  const layoutItems = allItems.filter(item => !item._isRemoved);

  return (
    <div
      className="relative flex flex-col border p-2 bg-gray-800 rounded"
      style={{
        width: STACK_ITEM_WIDTH + 20,
        height: Math.max(20, layoutItems.length) * STACK_ITEM_HEIGHT,
      }}
    >
      <h3 className="text-white font-semibold">{control.id}</h3>

      {allItems.map(item => {
        // Index for animation (where removed item animates from)
        const visibleIndex = allItems.findIndex(i => i.id === item.id);

        // Index for layout (stack collapse)
        const layoutIndex =
          item.state === ControlItemState.Removed
            ? visibleIndex
            : layoutItems.findIndex(i => i.id === item.id);

        return (
          <StackItem
            key={`${item.id}-${item.state}`}
            item={item}
            visibleIndex={visibleIndex}
            layoutIndex={layoutIndex}
            onRemoved={(id) => {
              // Mark item fully removed after animation
              item._isRemoved = true;
              setForceUpdate(v => v + 1); // trigger StackRenderer rerender
              onRemoved?.(id);
            }}
          />
        );
      })}
    </div>
  );
}
