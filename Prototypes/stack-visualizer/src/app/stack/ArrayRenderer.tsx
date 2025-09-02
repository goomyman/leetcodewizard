"use client";

import ArrayItem from "./ArrayItem";
import { ArrayControl, ArrayItemType, ArrayItemState } from "./ControlTypes";

interface ArrayRendererProps {
  control: ArrayControl;
  sliderValue: number; // shared history / slider
}

export default function ArrayRenderer({ control, sliderValue }: ArrayRendererProps) {
  // Compute the items for the current slider step
  const items: ArrayItemType[] = control.updates?.map((update, idx) => {
    if (idx < sliderValue) {
      // committed updates
      return {
        index: update.index,
        value: update.value,
        state: ArrayItemState.Normal,
        color: control.color ?? "#4ade80",
      };
    }
    if (idx === sliderValue) {
      // pre-update for animation
      return {
        index: update.index,
        value: update.value,
        state: ArrayItemState.PreUpdate,
        color: control.color ?? "#facc15",
      };
    }
    // future updates remain as-is
    return {
      index: update.index,
      value: null,
      state: ArrayItemState.Normal,
      color: control.color ?? "#4ade80",
    };
  }) ?? [];

  return (
    <div className="flex flex-col gap-2 items-center w-full max-w-2xl">
      <h3 className="text-white font-semibold">{control.id}</h3>
      <div className="flex">
        {items.map((item, i) => (
          <ArrayItem
            key={i}
            item={item}
            index={i}
            stopShaking={item.state !== ArrayItemState.PreUpdate}
          />
        ))}
      </div>
    </div>
  );
}
