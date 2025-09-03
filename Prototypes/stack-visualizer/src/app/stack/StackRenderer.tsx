import React from "react";
import { Control, ControlItem } from "./ControlTypes";
import { STACK_ITEM_WIDTH, STACK_ITEM_HEIGHT } from "./StackItemConstants";

interface StackRendererProps {
  control: Control<ControlItem>;
}

export default function StackRenderer({ control }: StackRendererProps) {
  return (
    <div
      className="flex flex-col justify-end items-center relative border-transparent"
      style={{
        width: STACK_ITEM_WIDTH,
        minHeight: STACK_ITEM_HEIGHT * 20, // ensures enough height for justify-end
        height: "100%", // make it fill the grid row
      }}
    >
      {control.items.map((item, idx) => (
        <div
          key={item.id || idx}
          className={`m-1 bg-green-400 flex items-center justify-center`}
          style={{ width: `${STACK_ITEM_WIDTH}px`, height: `${STACK_ITEM_HEIGHT}px` }}
        >
          {item.value}
        </div>
      ))}
    </div>
  );
}
