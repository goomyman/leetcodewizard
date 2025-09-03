"use client";

import React from "react";
import ArrayItem from "./ArrayItem";
import { Control, ControlItem } from "./ControlTypes";

interface ArrayRendererProps {
  control: Control<ControlItem>;
  sliderValue?: number;
}

export default function ArrayRenderer({ control }: ArrayRendererProps) {
  return (
    <div className="flex flex-col gap-2 items-center">
      <h3 className="text-white font-semibold">{control.id}</h3>
      <div className="flex gap-2">
        {control.items.map((item, idx) => (
          <ArrayItem key={item.id} item={item} index={idx} />
        ))}
      </div>
    </div>
  );
}
