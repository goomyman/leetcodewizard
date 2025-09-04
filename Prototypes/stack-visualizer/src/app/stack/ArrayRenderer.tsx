"use client";

import React from "react";
import ArrayItem from "./ArrayItem";
import { Control, ControlItem, ControlItemState } from "./ControlTypes";

interface ArrayRendererProps {
  control: Control<ControlItem>;
  sliderValue?: number;
}

export default function ArrayRenderer({ control }: ArrayRendererProps) {
  return (
    <div className="flex flex-col gap-2 items-center">
      <h3 className="text-white font-semibold">{control.id}</h3>
      <div className="relative flex">
        {/* Normal and PreRemove items participate in flex layout */}
        {control.items
          .filter(
            item =>
              item.state !== ControlItemState.PreInsert &&
              item.state !== ControlItemState.PreUpdate &&
              item.state !== ControlItemState.Deleted
          )
          .map((item, idx) => (
            <ArrayItem key={item.id} item={item} index={idx} />
          ))}

        {/* Floating items: PreInsert, PreUpdate, Deleted */}
        {control.items
          .filter(
            item =>
              item.state === ControlItemState.PreInsert ||
              item.state === ControlItemState.PreUpdate ||
              item.state === ControlItemState.Deleted
          )
          .map((item, idx) => (
            <ArrayItem key={item.id} item={item} index={idx} />
          ))}
      </div>
    </div>
  );
}
