"use client";

import { motion, Variants } from "framer-motion";
import { ARRAY_ITEM_SIZE } from "./ArrayItemConstants";
import { ControlItem, ControlItemState } from "./ControlTypes";

interface ArrayItemProps {
  item: ControlItem;
  index: number;
}

export default function ArrayItem({ item, index }: ArrayItemProps) {
  const isPreUpdate = item.state === ControlItemState.PreUpdate;
  const isPreInsert = item.state === ControlItemState.PreInsert;

  // Define variants for different states
  const variants: Variants = {
    preInsert: {
      y: [-ARRAY_ITEM_SIZE * 1.2, -ARRAY_ITEM_SIZE * 1.2 + 5, -ARRAY_ITEM_SIZE * 1.2],
      rotate: [-5, 5, -5],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "loop",
      },
    },
    preUpdate: {
      y: [-5, 5, -5],
      rotate: [-5, 5, -5],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "loop",
      },
    },
    normal: {
      y: 0,
      rotate: 0,
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
  };

  // Pick variant based on state
  let activeVariant = "normal";
  if (isPreInsert) activeVariant = "preInsert";
  else if (isPreUpdate) activeVariant = "preUpdate";

  return (
    <motion.div
      style={{
        width: ARRAY_ITEM_SIZE,
        height: ARRAY_ITEM_SIZE,
        backgroundColor: isPreUpdate ? "yellow" : item.color,
        border: "2px solid white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: 0,
      }}
      animate={activeVariant}
      variants={variants}
      layout
      className="font-bold text-black"
    >
      {item.value}
    </motion.div>
  );
}
