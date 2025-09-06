"use client";

import { motion } from "framer-motion";
import { ARRAY_ITEM_SIZE } from "./ArrayItemConstants";
import { ControlItem, ControlItemState } from "./ControlTypes";

interface ArrayItemProps {
  item: ControlItem;
  leftIndex: number;
  topOffset?: number;
  onRemoved?: (id: string) => void;
}

export default function ArrayItem({ item, leftIndex, topOffset = 0, onRemoved }: ArrayItemProps) {
  const isPreUpdate = item.state === ControlItemState.PreUpdate;
  const isPreRemove = item.state === ControlItemState.PreRemove;
  const isRemoved = item.state === ControlItemState.Removed;

  const floating = isPreUpdate || isPreRemove || isRemoved;

  let animationProps: any = { y: 0, opacity: 1, scale: 1 };

  if (isPreUpdate) {
    animationProps = {
      y: [-ARRAY_ITEM_SIZE - 4, -ARRAY_ITEM_SIZE - 2, -ARRAY_ITEM_SIZE - 4],
      scale: [1, 1.02, 1],
      transition: { duration: 1.5, repeat: Infinity, repeatType: "loop" as const },
    };
  } else if (isPreRemove) {
    animationProps = {
      y: [0, 4, 0, 4, 0],
      transition: { duration: 1.5, repeat: Infinity, repeatType: "loop" as const },
    };
  } else if (isRemoved) {
    animationProps = {
      y: ARRAY_ITEM_SIZE * 1.5,
      opacity: 0,
      transition: { duration: 0.6, ease: "easeIn" },
    };
  } else {
    animationProps = {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    };
  }

  const displayColor = isPreUpdate ? "green" : isPreRemove || isRemoved ? "red" : item.color;

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
        position: "absolute",
        left: leftIndex * ARRAY_ITEM_SIZE,
        top: topOffset,
        zIndex: floating ? 10 : 1,
      }}
      animate={animationProps}
      layout={false}
      onAnimationComplete={() => {
        if (isRemoved && onRemoved) onRemoved(String(item.id));
      }}
    >
      {item.value}
    </motion.div>
  )
