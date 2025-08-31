"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { StackItemType, STACK_ITEM_WIDTH, STACK_ITEM_HEIGHT } from "./StackItemConstants";

interface StackItemProps {
  item: StackItemType;
  stopShaking: boolean;
}

export default function StackItem({ item, stopShaking }: StackItemProps) {
  const isPrePush = item.state === "prePush";
  const isPrePop = item.state === "prePop";

  const controls = useAnimation();

  // PrePop animation: gentle vertical bounce + pulse
  useEffect(() => {
    if (isPrePop && !stopShaking) {
      controls.start({
        y: [0, 0, 0, 0, 0],       // gentle up/down bounce
        scale: [1, 1.05, 1, 1.05, 1], // subtle pulsing
        transition: {
          duration: 2,
          repeat: Infinity,
          repeatType: "loop",
        },
      });
    } else {
      controls.stop();
      controls.set({ y: 0, scale: 1 });
    }
  }, [isPrePop, stopShaking, controls]);

  return (
    <motion.div
      style={{
        width: STACK_ITEM_WIDTH,
        height: STACK_ITEM_HEIGHT,
        backgroundColor: item.color,
        borderRadius: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: isPrePush ? "0px 8px 15px rgba(0,0,0,0.2)" : "none",
        zIndex: isPrePush ? 10 : 1
      }}
      layout // smooth transition from floating → normal stack
      animate={isPrePop ? controls : isPrePush ? { y: -15, scale: 1.10 } : { y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="text-sm font-bold text-black"
    >
      <span>{item.id}</span>
    </motion.div>
  );
}
