"use client";

import { motion } from "framer-motion";
import { ARRAY_ITEM_SIZE } from "./ArrayItemConstants";
import { ControlItem, ControlItemState } from "./ControlTypes";

interface ArrayItemProps {
  item: ControlItem;
  index: number; // target horizontal slot
}

export default function ArrayItem({ item, index }: ArrayItemProps) {
  const isPreInsert = item.state === ControlItemState.PreInsert;
  const isPreUpdate = item.state === ControlItemState.PreUpdate;
  const isPreRemove = item.state === ControlItemState.PreRemove;
  const isDeleted = item.state === ControlItemState.Deleted;

  // Only floating items (animated above layout)
  const floating = isPreInsert || isPreUpdate || isDeleted;

  // Base offset for PreInsert / PreUpdate
  const baseY = isPreInsert || isPreUpdate ? -ARRAY_ITEM_SIZE - 6 : 0;

  // Animation
  let animationProps: any = { y: 0, scale: 1, rotate: 0, opacity: 1 };

  if (isPreInsert || isPreUpdate) {
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
  } else if (isDeleted) {
    animationProps = {
      y: ARRAY_ITEM_SIZE * 1.5,
      opacity: 0,
      scale: 0.8,
      rotate: 10,
      transition: { duration: 0.5, ease: "easeIn" },
    };
  }

  const displayColor = isPreInsert
    ? "green"
    : isPreUpdate
    ? "yellow"
    : isPreRemove
    ? "red"
    : isDeleted
    ? "red"
    : item.color;

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
        position: floating ? "absolute" : "relative",
        left: floating ? index * (ARRAY_ITEM_SIZE + 8) : undefined,
        top: floating ? 0 : undefined,
      }}
      animate={animationProps}
      layout={!floating}
      transition={{ type: "spring", stiffness: 175, damping: 50 }}
      onAnimationComplete={() => {
        // Optional: handle Deleted items removal
      }}
    >
      {item.value}
    </motion.div>
  );
}
