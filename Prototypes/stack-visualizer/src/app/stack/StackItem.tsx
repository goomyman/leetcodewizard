"use client";

import { motion } from "framer-motion";
import { StackItemType, STACK_ITEM_WIDTH, STACK_ITEM_HEIGHT } from "./StackItemConstants";

interface StackItemProps {
  item: StackItemType;
  stopShaking: boolean;
}

export default function StackItem({ item, stopShaking }: StackItemProps) {
  const isPrePush = item.state === "prePush";

  return (
    <motion.div
      style={{
        width: STACK_ITEM_WIDTH,
        height: STACK_ITEM_HEIGHT,
        backgroundColor: item.color,
        borderRadius: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: isPrePush ? "0px 8px 15px rgba(0,0,0,0.2)" : "none",
        zIndex: isPrePush ? 10 : 1,
      }}
      animate={{
        y: isPrePush ? -10 : 0,  // float above slightly
        scale: isPrePush ? 1.05 : 1,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="text-sm font-bold text-black" // Tailwind text styling
    >
      <span>{item.id}</span>
    </motion.div>
  );
}
