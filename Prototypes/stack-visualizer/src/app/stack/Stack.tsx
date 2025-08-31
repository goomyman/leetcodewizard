"use client";

import { AnimatePresence } from "framer-motion";
import StackItem from "./StackItem";
import { StackItemType } from "./StackItemConstants";

interface StackProps {
  stack: StackItemType[]; // always an array
}

export default function Stack({ stack }: StackProps) {
  // safety check
  const safeStack = stack || [];

  return (
    <div className="stack-container flex flex-col justify-end items-center w-72 h-96 border border-transparent">
      <AnimatePresence>
        {safeStack.map(item => (
          <StackItem
            key={item.id}
            item={item}
            stopShaking={item.state !== "prePop"}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
