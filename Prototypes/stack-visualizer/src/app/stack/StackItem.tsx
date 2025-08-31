"use client";

import { motion } from "framer-motion";

export type StackItemState = "prePush" | "push" | "prePop" | "pop";

export interface StackItemType {
  id: number;
  path: string;
  color: string;
  state: StackItemState;
  i: number;
  start: number;
}

export const STACK_ITEM_HEIGHT = 20;

export default function StackItem({ item }: { item: StackItemType }) {
  const { state, color, i, start } = item;

  const variants = {
    prePush: { x: -50, y: -20, opacity: 0.6 },
    push: { x: 0, y: 0, opacity: 1 },
    prePop: { x: 0, y: 0, opacity: 1, rotate: [0, -5, 5, 0], backgroundColor: "#ff4d4f" },
    pop: { opacity: 0, y: 50 },
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={variants[state]}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, type: "spring", stiffness: 200, damping: 20 }}
      className="w-full mb-1 relative"
      style={{ height: STACK_ITEM_HEIGHT, backgroundColor: state === "prePop" ? "#ff4d4f" : color }}
      title={`i=${i}, start=${start}, path="${item.path}"`}
    >
      <div className="flex justify-center items-end text-sm font-bold text-black">
        {`i=${i}, start=${start}`}
      </div>
    </motion.div>
  );
}
