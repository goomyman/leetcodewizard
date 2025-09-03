"use client";

import React from "react";
import { Control, ControlItem } from "./ControlTypes";
import StackItem from "./StackItem";

interface StackRendererProps {
  control: Control<ControlItem>;
}

export default function StackRenderer({ control }: StackRendererProps) {
  return (
    <div className="flex flex-col justify-end gap-1 border p-2 bg-gray-800 rounded h-64">
      <h3 className="text-white font-semibold">{control.id}</h3>
      {/* Render items in order: newest on top */}
      {control.items.map((item, idx) => (
        <StackItem
          key={item.id}
          item={item}
          index={idx}
        />
      ))}
    </div>
  );
}
