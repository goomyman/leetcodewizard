"use client";

import { motion } from "framer-motion";
import { STACK_ITEM_WIDTH, STACK_ITEM_HEIGHT } from "./StackItemConstants";
import { ControlItem, ControlItemState } from "./ControlTypes";

interface StackItemProps {
  item: ControlItem;
  index?: number;
}

export default function StackItem({ item, index }: StackItemProps) {
  const isPreInsert = item.state === ControlItemState.PreInsert;
  const isPreRemove = item.state === ControlItemState.PreRemove;

  // Offset for pre-states
  const baseY = isPreInsert ? -STACK_ITEM_HEIGHT * 0.05 : 0;
  const baseX = isPreInsert ? -STACK_ITEM_WIDTH * 0.3 : 0;

  // Animate in place around offset
  const animationProps = isPreInsert || isPreRemove
    ? {
        y: [baseY, baseY - 1, baseY, baseY - 1, baseY],
        x: [baseX, baseX, baseX, baseX, baseX],
        scale: [1, 1.02, 1, 1.02, 1],
        transition: {
          duration: 3,
          repeat: Infinity,
          repeatType: "loop" as const,
        },
      }
    : { x: 0, y: 0, scale: 1 };

  const displayColor = isPreInsert
    ? "green"
    : isPreRemove
    ? "red"
    : item.color;

  return (
    <motion.div
      style={{
        width: STACK_ITEM_WIDTH,
        height: STACK_ITEM_HEIGHT,
        backgroundColor: displayColor,
        borderRadius: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: isPreInsert ? "0px 8px 15px rgba(0,0,0,0.2)" : "none",
        zIndex: isPreInsert ? 10 : 1,
      }}
      animate={animationProps}
      layout
      transition={{ type: "spring", stiffness: 175, damping: 50 }}
      className="text-sm font-bold text-black"
    >
      <div className="w-full text-left font-bold text-lg pl-3 flex-1">
        {item.level}
      </div>
      <div className="w-full text-center">
        {item.value}
      </div>
    </motion.div>
  );
}
