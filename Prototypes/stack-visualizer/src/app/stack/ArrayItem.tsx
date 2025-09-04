"use client";

import { motion } from "framer-motion";
import { ARRAY_ITEM_SIZE } from "./ArrayItemConstants";
import { ControlItem, ControlItemState } from "./ControlTypes";

interface ArrayItemProps {
  item: ControlItem;
  index: number; // horizontal slot in the array
}

export default function ArrayItem({ item, index }: ArrayItemProps) {
  const isPreInsert = item.state === ControlItemState.PreInsert;
  const isPreUpdate = item.state === ControlItemState.PreUpdate;
  const isPreRemove = item.state === ControlItemState.PreRemove;
  const isDeleted = item.state === ControlItemState.Deleted;

  // Items that need to float above the layout
  const isFloating = isPreInsert || isPreUpdate || isDeleted;

  // Base offsets for floating items
  const baseY = isPreInsert || isPreUpdate ? -ARRAY_ITEM_SIZE - 6 : 0;

  // Animation properties
  let animationProps: any = { y: 0, scale: 1, rotate: 0, opacity: 1 };

  if (isFloating && (isPreInsert || isPreUpdate )) {
    // Hover/wiggle for PreInsert / PreUpdate
    animationProps = {
      y: [baseY, baseY - 5, baseY, baseY - 5, baseY],
      scale: [1, 1, 1, 1, 1],
      transition: { duration: 3, repeat: Infinity, repeatType: "loop" as const },
    };
  } else if (isPreRemove) {
    // Wiggle in place for PreRemove
    animationProps = {
      y: [0, 0, 0, 0, 0],
      scale: [1, 1, 1, 1, 1],
      rotate: [0, 0, 0, 0, 0],
      transition: { duration: 3, repeat: Infinity, repeatType: "loop" as const },
    };
  } else if (isDeleted) {
    // Fall & fade out animation for Deleted items
    animationProps = {
      y: ARRAY_ITEM_SIZE * 1.5,
      opacity: 0,
      scale: 0.8,
      rotate: 10,
      transition: { duration: 0.5, ease: "easeIn" },
    };
  }

  // Determine color
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
        zIndex: isFloating ? 10 : 1,
        position: isFloating ? "absolute" : "relative",
        left: isFloating ? index * (ARRAY_ITEM_SIZE + 8) : undefined,
        top: isFloating ? 0 : undefined,
      }}
      animate={animationProps}
      layout={!isFloating} // only normal and PreRemove items participate in layout
      onAnimationComplete={() => {
        // Optional callback to remove Deleted items from array/history
      }}
    >
      {item.value}
    </motion.div>
  );
}
