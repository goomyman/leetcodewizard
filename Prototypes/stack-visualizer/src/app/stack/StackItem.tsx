"use client";

import { motion } from "framer-motion";
import { STACK_ITEM_WIDTH, STACK_ITEM_HEIGHT } from "./StackItemConstants";
import { ControlItem, ControlItemState } from "./ControlTypes";

interface StackItemProps {
  item: ControlItem;
  index: number; // bottom = 0
  onRemoved?: (id: string) => void;
}

export default function StackItem({ item, index, onRemoved }: StackItemProps) {
  const isPreInsert = item.state === ControlItemState.PreInsert;
  const isPreRemove = item.state === ControlItemState.PreRemove;
  const isRemoved = item.state === ControlItemState.Removed;

  const baseY = isPreInsert ? -STACK_ITEM_HEIGHT * 0.05 : 0;
  const baseX = isPreInsert ? -STACK_ITEM_WIDTH * 0.3 : 0;

  let animationProps: any = { x: 0, y: 0, scale: 1 };

  if (isPreInsert) {
    animationProps = {
      y: [baseY, baseY - 1, baseY, baseY - 1, baseY],
      x: [baseX, baseX, baseX, baseX, baseX],
      scale: [1, 1.02, 1, 1.02, 1],
      transition: { duration: 3, repeat: Infinity, repeatType: "loop" as const },
    };
  } else if (isPreRemove) {
    animationProps = {
      y: [0, -3, 0, -3, 0],
      scale: [1, 1.03, 1, 1.03, 1],
      transition: { duration: 2.5, repeat: Infinity, repeatType: "loop" as const },
    };
  } else if (isRemoved) {
    animationProps = {
      x: [0, STACK_ITEM_WIDTH * 0.5],   // slide right
      y: [0, STACK_ITEM_HEIGHT * 1.5],  // then fall down
      rotate: [0, 25],
      opacity: [1, 0],
      scale: [1, 0.8],
      transition: { duration: 0.8, ease: "easeIn" },
    };
  }

  const displayColor = isPreInsert
    ? "green"
    : isPreRemove || isRemoved
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
        position: "absolute",
        bottom: index * STACK_ITEM_HEIGHT, // bottom-anchored stacking
        left: 0,
        boxShadow: isPreInsert ? "0px 8px 15px rgba(0,0,0,0.2)" : "none",
        zIndex: index + 1, // top items above
      }}
      animate={animationProps}
      layout
      onAnimationComplete={() => {
        if (isRemoved && onRemoved) onRemoved(String(item.id));
      }}
      className="text-sm font-bold text-black"
    >
      <div className="w-full text-left font-bold text-lg pl-3 flex-1">
        {item.level}
      </div>
      <div className="w-full text-center">{item.value}</div>
    </motion.div>
  );
}
