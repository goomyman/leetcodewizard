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
  const isFloating = isPreInsert || isPreUpdate;

  // Base offsets for floating items
  const baseY = isFloating ? -ARRAY_ITEM_SIZE - 6: 0;
  const baseX = isFloating ? 0 : 0; // horizontal offset can be 0 since we position via left

  // Wiggle / hover animation for floating items
  const animationProps = isFloating
    ? {
        y: [baseY, baseY - 5, baseY, baseY - 5, baseY],
        scale: [1, 1.02, 1, 1.02, 1],
        transition: {
          duration: 3,
          repeat: Infinity,
          repeatType: "loop" as const,
        },
      }
    : { y: 0, scale: 1 };

  // Color by state
  const displayColor = isPreInsert
    ? "green"
    : isPreUpdate
    ? "yellow"
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
        position: isFloating ? "absolute" : "relative", // ← float above flex flow
        left: isFloating ? index * (ARRAY_ITEM_SIZE + 8) : undefined, // place above slot
        top: isFloating ? 0 : undefined,
      }}
      animate={animationProps}
      layout={!isFloating} // only animate layout for normal items
      transition={{ type: "spring", stiffness: 175, damping: 50 }}
    >
      {item.value}
    </motion.div>
  );
}
