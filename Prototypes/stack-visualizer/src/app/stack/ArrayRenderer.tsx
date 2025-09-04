"use client";

import React from "react";
import ArrayItem from "./ArrayItem";
import { Control, ControlItem, ControlItemState } from "./ControlTypes";

interface ArrayRendererProps {
  control: Control<ControlItem>;
}

export default function ArrayRenderer({ control }: ArrayRendererProps) {
  return (
    <div className="flex flex-col gap-2 items-center">
      <h3 className="text-white font-semibold">{control.id}</h3>
      <div className="relative flex">
        {control.items.map((item, idx) => (
          <ArrayItem
            key={item.id}
            item={item}
            index={item.targetIndex ?? idx} // use targetIndex if floating
          />
        ))}
      </div>
    </div>
  );
}
