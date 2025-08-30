"use client";

import { motion } from "framer-motion";

export interface StackItemType {
  i: number;
  start: number;
  color: string;
  height: number;
}

interface StackItemProps {
  item: StackItemType;
}

export default function StackItem({ item }: StackItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 1, y: `${item.height}px` }}
      animate={{ opacity: 1, y: 0, height: `${item.height}px` }}
      exit={{ opacity: 1, y: 0, x: 60 }}
      transition={{ duration: 0.5 }}
      className="stack-item w-full rounded-md mb-1 flex justify-center items-end text-sm text-black font-bold"
      style={{ backgroundColor: item.color }}
      title={`i=${item.i}, start="${item.start}"`}
    >
      {`i=${item.i}, start="${item.start}"`}
    </motion.div>
  );
}
