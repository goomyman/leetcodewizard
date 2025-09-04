"use client";

import { motion } from "framer-motion";
import { ARRAY_ITEM_SIZE } from "./ArrayItemConstants";
import { ControlItem, ControlItemState } from "./ControlTypes";

interface ArrayItemProps {
  item: ControlItem;
  index: number;
  onRemoved?: (id: string) => void;
}

export default function ArrayItem({ item, index, onRemoved }: ArrayItemProps) {
  const isPreUpdate = item.state === ControlItemState.PreUpdate;
  const isPreRemove = item.state === ControlItemState.PreRemove;
  const isRemoved = item.state === ControlItemState.Removed;

  const floating = isPreUpdate || isPreRemove || isRemoved;

  const baseY = isPreUpdate ? -ARRAY_ITEM_SIZE - 6 : 0;

  let animationProps: any = { y: 0, scale: 1, rotate: 0, opacity: 1 };

  if (isPreUpdate) {
    animationProps = {
      y: [baseY, baseY - 5, baseY, baseY - 5, baseY],
      scale: [1, 1, 1, 1, 1],
      transition: { duration: 3, repeat: Infinity, repeatType: "loop" as const },
    };
  } else if (isPreRemove) {
    animationProps = {
      y: [0, 0, 0],
      scale: [1, 1, 1],
      rotate: [0, 0, 0],
      transition: { duration: 3, repeat: Infinity, repeatType: "loop" as const },
    };
  } else if (isRemoved) {
    animationProps = {
      y: ARRAY_ITEM_SIZE * 1.5,
      opacity: 0,
      scale: 0.8,
      rotate: 10,
      transition: { duration: 0.5, ease: "easeIn" },
    };
  }

  const displayColor = isPreUpdate
    ? "yellow"
    : isPreRemove
    ? "red"
    : isRemoved
    ? "red"
    : item.color;

  const GAP = 8;

  return (
    <motion.div
      style={{
        width: ARRAY_ITEM_SIZE,
        height: ARRAY_ITEM_SIZE,
        backgroundColor: displayColor,
        border: "2px solid white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
        zIndex: floating ? 10 : 1,
        position: "absolute",
        left: index * (ARRAY_ITEM_SIZE + GAP),
        top: 0,
      }}
      animate={animationProps}
      layout={!floating}
      onAnimationComplete={() => {
        if (isRemoved && onRemoved) onRemoved(String(item.id));
      }}
    >
      {item.value}
    </motion.div>
  );
}
