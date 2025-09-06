"use client";

import { AnimatePresence } from "framer-motion";
import { Control, ControlItem } from "./ControlTypes";
import StackItem from "./StackItem";
import { STACK_ITEM_HEIGHT, STACK_ITEM_WIDTH } from "./StackItemConstants";

interface StackRendererProps {
  control: Control<ControlItem>;
}

export default function StackRenderer({ control }: StackRendererProps) {
  const containerHeight = Math.max(control.items.length, 10) * STACK_ITEM_HEIGHT;

  return (
    <div
      className="relative border p-2 bg-gray-800 rounded"
      style={{
        width: STACK_ITEM_WIDTH + 20,
        height: containerHeight,
        overflow: "hidden",
      }}
    >
      <h3 className="text-white font-semibold mb-2">{control.id}</h3>

      <AnimatePresence>
        {control.items.map((item, idx) => (
          <StackItem key={`${item.id}-${item.state}-${idx}`} item={item} index={idx} />
        ))}
      </AnimatePresence>
    </div>
  );
}
