"use client";

import React from "react";
import { Control, ControlItem, ControlItemState } from "./ControlTypes";
import StackItem from "./StackItem";
import { STACK_ITEM_WIDTH, STACK_ITEM_HEIGHT } from "./StackItemConstants";

interface StackRendererProps {
  control: Control<ControlItem>;
  onRemoved?: (id: string) => void;
  minItems?: number;
}

export default function StackRenderer({ control, onRemoved, minItems = 20 }: StackRendererProps) {
  // Compute visible items including PreRemove and Removed for animation
  const visibleItems = control.items
    .map((item, idx) => ({ item, originalIndex: idx }))
    .filter(({ item }) =>
      item.state !== ControlItemState.Removed || item.state === ControlItemState.Removed
    );

  // Assign bottom-anchored visible indices
  const itemsWithVisibleIndex = visibleItems.map(({ item }, idx) => ({
    item,
    visibleIndex: idx,
  }));

  const containerHeight = Math.max(itemsWithVisibleIndex.length, minItems) * STACK_ITEM_HEIGHT;

  return (
    <div
      className="relative border p-2 bg-gray-800 rounded"
      style={{ width: STACK_ITEM_WIDTH + 20, height: containerHeight }}
    >
      <h3 className="text-white font-semibold">{control.id}</h3>

      {itemsWithVisibleIndex.map(({ item, visibleIndex }) => (
        <StackItem
          key={`${item.id}-${item.state}-${item.targetIndex ?? 0}`}
          item={item}
          visibleIndex={visibleIndex}
          onRemoved={onRemoved}
        />
      ))}
    </div>
  );
}
