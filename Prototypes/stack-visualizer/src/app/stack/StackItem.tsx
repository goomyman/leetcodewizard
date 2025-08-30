"use client";

import { motion } from "framer-motion";

export type StackItemType = {
  i: number;
  path: string;
  color: string;
  paused?: "push" | "pop"; // push pause (from left) OR pop pause (to right)
};

export const STACK_ITEM_HEIGHT = 20; // constant height

export default function StackItem({ item }: { item: StackItemType }) {
  const { i, path, color, paused } = item;

  return (
    <motion.div
      layout
      initial={
        paused === "push"
          ? { x: "-100%", opacity: 0 }
          : paused === "pop"
          ? { x: 0, opacity: 1 }
          : { opacity: 0, y: 20 }
      }
      animate={
        paused === "push"
          ? { x: "-50%", opacity: 1 }
          : paused === "pop"
          ? { x: "50%", opacity: 1 }
          : { x: 0, opacity: 1, y: 0 }
      }
      exit={{ opacity: 0, y: 20, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.5, type: "spring" }}
      className="w-full rounded-md mb-1 flex justify-center items-end text-sm font-bold text-black"
      style={{ backgroundColor: color, height: STACK_ITEM_HEIGHT }}
      title={`i=${i}, path="${path}"`}
    >
      {`i=${i}, path="${path}"`}
    </motion.div>
  );
}
