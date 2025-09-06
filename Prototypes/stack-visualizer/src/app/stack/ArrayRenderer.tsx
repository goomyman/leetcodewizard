"use client";

import React from "react";
import ArrayItem from "./ArrayItem";
import { Control, ControlItem } from "./ControlTypes";
import { ARRAY_ITEM_SIZE } from "./ArrayItemConstants";

interface ArrayRendererProps {
  control: Control<ControlItem>;
  onRemoved?: (id: string) => void;
}

export default function ArrayRenderer({ control, onRemoved }: ArrayRendererProps) {
  const containerWidth = (control.items.length || 1) * ARRAY_ITEM_SIZE;

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
          // Use map index directly
          return (
            <ArrayItem
              key={item.id + "-" + item.state} // re-render on state change
              item={item}
              index={idx}
              onRemoved={onRemoved}
            />
          );
        })}
      </div>
    </div>
  );
}
