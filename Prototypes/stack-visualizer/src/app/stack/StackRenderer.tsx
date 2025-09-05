"use client";

import React from "react";
import { Control, ControlItem, ControlItemState } from "./ControlTypes";
import StackItem from "./StackItem";

interface StackRendererProps {
  control: Control<ControlItem>;
  onRemoved?: (id: string) => void;
}

export default function StackRenderer({ control, onRemoved }: StackRendererProps) {
  // Filter out fully removed items from render
  const visibleItems = control.items.filter(
    item => item.state !== ControlItemState.Removed
  );

  // Render items newest on top (highest index visually on top)
  return (
    <div className="flex flex-col justify-end gap-1 border p-2 bg-gray-800 rounded h-64 relative">
      <h3 className="text-white font-semibold">{control.id}</h3>
      {visibleItems.map((item, idx) => (
        <StackItem
          key={item.id}
          item={item}
          index={idx}
          onRemoved={onRemoved} // pass callback for removed items
        />
      ))}
    </div>
  );
}
