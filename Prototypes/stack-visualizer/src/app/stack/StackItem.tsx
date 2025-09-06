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

  let animationProps: any = { y: 0, x: 0, scale: 1 };

  if (isPreInsert) {
    animationProps = {
      y: [0, -3, 0, -3, 0],
      scale: [1, 1.02, 1, 1.02, 1],
      transition: { duration: 2.5, repeat: Infinity, repeatType: "loop" as const },
    };
  } else if (isPreRemove) {
    animationProps = {
      y: [0, -4, 0, -4, 0],
      scale: [1, 1.03, 1, 1.03, 1],
      transition: { duration: 2.5, repeat: Infinity, repeatType: "loop" as const },
    };
  } else if (isRemoved) {
    animationProps = {
      x: [0, STACK_ITEM_WIDTH * 1.2],
      y: [0, 5, 10, 20],
      rotate: [0, 15, 30, 60],
      opacity: [1, 0],
      scale: [1, 0.8],
      transition: { duration: 1.5, ease: [0.4, 0, 0.2, 1] },
    };
  }

  const displayColor = isPreInsert
    ? "green"
    : isPreRemove || isRemoved
    ? "red"
    : item.color ?? "gray";

  return (
    <motion.div
      key={`${item.id}-${item.state}-${index}`}
      style={{
        width: STACK_ITEM_WIDTH,
        height: STACK_ITEM_HEIGHT,
        backgroundColor: displayColor,
        borderRadius: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        bottom: index * STACK_ITEM_HEIGHT,
        left: 0,
        zIndex: index + 1,
      }}
      layout={false} // prevent layout interpolation
      animate={animationProps}
      onAnimationComplete={() => {
        if (isRemoved && onRemoved) onRemoved(String(item.id));
      }}
    >
      <div className="w-full text-left font-bold text-lg pl-3 flex-1">
        {item.level}
      </div>
      <div className="w-full text-center">{item.value}</div>
    </motion.div>
  );
}
