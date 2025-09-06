"use client";

import { motion } from "framer-motion";
import { STACK_ITEM_WIDTH, STACK_ITEM_HEIGHT } from "./StackItemConstants";
import { ControlItem, ControlItemState } from "./ControlTypes";

interface StackItemProps {
  item: ControlItem;
  visibleIndex: number;   // original position for animation
  layoutIndex?: number;   // stack layout position for collapse
  onRemoved?: (id: string) => void;
}

export default function StackItem({ item, visibleIndex, layoutIndex, onRemoved }: StackItemProps) {
  const isPreInsert = item.state === ControlItemState.PreInsert;
  const isPreRemove = item.state === ControlItemState.PreRemove;
  const isRemoved = item.state === ControlItemState.Removed;

  let animationProps: any = { x: 0, y: 0, scale: 1 };

  if (isPreInsert) {
    animationProps = {
      x: [-STACK_ITEM_WIDTH * 0.6, -STACK_ITEM_WIDTH * 0.65, -STACK_ITEM_WIDTH * 0.6],
      y: [0, -2, 0],
      scale: [1, 1.02, 1],
      transition: { duration: 2, repeat: Infinity, repeatType: "loop" as const },
    };
  } else if (isPreRemove) {
    animationProps = {
      y: [0, -3, 0, -3, 0],
      scale: [1, 1.03, 1, 1.03, 1],
      transition: { duration: 2.5, repeat: Infinity, repeatType: "loop" as const },
    };
  } else if (isRemoved) {
    animationProps = {
      x: [0, STACK_ITEM_WIDTH * 1.2],
      y: [0, STACK_ITEM_HEIGHT * 1.5],
      rotate: [0, 30, 70, 90],
      opacity: [1, 0],
      scale: [1, 0.8],
      transition: { duration: 1.75, ease: "easeIn" },
    };
  }

  return (
    <motion.div
      style={{
        width: STACK_ITEM_WIDTH,
        height: STACK_ITEM_HEIGHT,
        backgroundColor:
          isPreInsert ? "green" : isPreRemove || isRemoved ? "red" : item.color,
        borderRadius: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        bottom: (layoutIndex ?? visibleIndex) * STACK_ITEM_HEIGHT,
        left: 0,
        boxShadow: isPreInsert ? "0px 8px 15px rgba(0,0,0,0.2)" : "none",
        zIndex: (layoutIndex ?? visibleIndex) + 1,
      }}
      animate={animationProps}
      layout
      onAnimationComplete={() => {
        if (isRemoved && onRemoved) onRemoved(String(item.id));
      }}
    >
      <div className="w-full text-left font-bold text-lg pl-3 flex-1">{item.level}</div>
      <div className="w-full text-center">{item.value}</div>
    </motion.div>
  );
}
