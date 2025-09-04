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

  // Only floating for PreInsert / PreUpdate
  const isFloating = isPreInsert || isPreUpdate;

  const baseY = isFloating ? -ARRAY_ITEM_SIZE -6: 0;

  // Animation
  const animationProps = isPreInsert || isPreUpdate
    ? {
        y: [baseY, baseY - 5, baseY, baseY - 5, baseY],
        scale: [1, 1, 1, 1, 1],
        transition: { duration: 3, repeat: Infinity, repeatType: "loop" as const },
      }
    : isPreRemove
    ? {
        y: [0, 0, 0, 0, 0],
        scale: [1, 1, 1, 1, 1],
        rotate: [0,0, 0, 0],
        transition: { duration: 3, repeat: Infinity, repeatType: "loop" as const },
      }
    : { y: 0, scale: 1, rotate: 0 };

  const displayColor = isPreInsert
    ? "green"
    : isPreUpdate
    ? "yellow"
    : isPreRemove
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
        position: isFloating ? "absolute" : "relative", // only float PreInsert/PreUpdate
        left: isFloating ? index * (ARRAY_ITEM_SIZE + 8) : undefined,
        top: isFloating ? 0 : undefined,
      }}
      animate={animationProps}
      layout={!isFloating} // only layout normal and PreRemove items
      transition={{ type: "spring", stiffness: 175, damping: 50 }}
    >
      {item.value}
    </motion.div>
  );
}
