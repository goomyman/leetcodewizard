"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { StackItemType, STACK_ITEM_HEIGHT } from "./StackItemConstants";

export default function StackItem({
  item,
  stopShaking = false,
}: {
  item: StackItemType;
  stopShaking?: boolean;
}) {
  const controls = useAnimation();

  useEffect(() => {
    if (item.state === "prePop" && !stopShaking) {
      controls.start({
        x: [-5, 5, -5, 5, 0],
        transition: { duration: 0.6, repeat: Infinity, ease: "easeInOut" },
      });
    } else {
      controls.stop();
      controls.set({ x: 0 });
    }
  }, [item.state, stopShaking, controls]);

  const initial =
    item.state === "prePush"
      ? { x: -50, y: -20, opacity: 0 }
      : { x: 0, y: 0, opacity: 0 };

  const animate =
    item.state === "prePush" ? { x: 0, y: 0, opacity: 1 } : { opacity: 1 };

  return (
    <motion.div
      layout
      initial={initial}
      animate={animate}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, type: "spring", stiffness: 200, damping: 20 }}
      className="w-full mb-1"
      style={{ height: STACK_ITEM_HEIGHT }}
    >
      <motion.div
        animate={controls}
        className="w-full h-full rounded-md flex justify-center items-end text-sm font-bold text-black"
        style={{ backgroundColor: item.color }}
        title={`id=${item.id}, i=${item.i}, start=${item.start}`}
      >
        {`i=${item.i}, start=${item.start}`}
      </motion.div>
    </motion.div>
  );
}
