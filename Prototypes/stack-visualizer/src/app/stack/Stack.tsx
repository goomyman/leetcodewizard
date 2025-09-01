"use client";

import { AnimatePresence, motion } from "framer-motion";
import StackItem from "./StackItem";
import { StackItemType, StackItemState, STACK_ITEM_WIDTH, STACK_ITEM_HEIGHT } from "./StackItemConstants";

interface StackProps {
  stack: StackItemType[];
}

export default function Stack({ stack }: StackProps) {
  const safeStack = stack || [];

  return (
    <div
      className="stack-container flex flex-col justify-end items-center border border-transparent relative"
      style={{ width: STACK_ITEM_WIDTH, minHeight: STACK_ITEM_HEIGHT * 20 }}
    >
      <AnimatePresence>
        {safeStack.map((item, index)  => (
          <motion.div
            key={item.id}
            layout // ensures smooth movement when items reorder
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <StackItem
              item={item}
              stopShaking={item.state !== StackItemState.PrePop && item.state !== StackItemState.PrePush}
              stackIndex={stack.length - index}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
