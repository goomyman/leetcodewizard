"use client";

import React from "react";
import StackItem from "./StackItem";
import { Control, ControlItem, ControlItemState } from "./ControlTypes";

interface StackRendererProps {
  control: Control<ControlItem>;
}

export default function StackRenderer({ control }: StackRendererProps) {
  return (
    <div className="flex flex-col gap-2 items-center">
      <h3 className="text-white font-semibold">{control.id}</h3>
      <div className="flex flex-col">
        {control.items.map((item, idx) => (
          <StackItem
            key={item.id}
            item={item}
            stackIndex={idx}
            stopShaking={item.state !== ControlItemState.PreUpdate}
          />
        ))}
      </div>
    </div>
  );
}
