"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { ARRAY_ITEM_SIZE } from "./ArrayItemConstants";
import { ControlItem, ControlItemState } from "./ControlTypes";

interface ArrayItemProps {
  item: ControlItem;
  index: number;
  stopShaking: boolean;
}

export default function ArrayItem({ item, index, stopShaking }: ArrayItemProps) {
  const isPreUpdate = item.state === ControlItemState.PreUpdate;
  const controls = useAnimation();

  useEffect(() => {
    if (isPreUpdate && !stopShaking) {
      controls.start({
        y: [-ARRAY_ITEM_SIZE, -ARRAY_ITEM_SIZE - 5, -ARRAY_ITEM_SIZE],
        scale: [1, 1.05, 1],
        transition: { duration: 2, repeat: Infinity, repeatType: "loop" },
      });
    } else {
      controls.stop();
      controls.start({
        y: 0,
        scale: 1,
        transition: { type: "spring", stiffness: 300, damping: 20 },
      });
    }
  }, [isPreUpdate, stopShaking, controls]);

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
      animate={controls}
      layout
      className="font-bold text-black"
    >
      {item.value}
    </motion.div>
  );
}
