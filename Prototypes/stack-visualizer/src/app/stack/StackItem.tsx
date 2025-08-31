"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { StackItemType, STACK_ITEM_WIDTH, STACK_ITEM_HEIGHT } from "./StackItemConstants";

interface StackItemProps {
  item: StackItemType;
  stopShaking: boolean;
  stackIndex: number;
}

export default function StackItem({ item, stopShaking, stackIndex }: StackItemProps) {
  const isPrePush = item.state === "prePush";
  const isPrePop = item.state === "prePop";

  const controls = useAnimation();

  // PrePop / PrePush animation: gentle vertical bounce + pulse
  useEffect(() => {
    const shouldAnimate = (isPrePop || isPrePush) && !stopShaking;
    const baseY = isPrePush ? -25 : 0;

    if (shouldAnimate) {
      controls.start({
        y: [baseY, baseY - 6, baseY, baseY - 6, baseY],
        scale: [1, 1.05, 1, 1.05, 1],
        transition: {
          duration: 2,
          repeat: Infinity,
          repeatType: "loop",
        },
      });
    } else {
      controls.stop();
      controls.start({
        y: 0,
        scale: 1,
        transition: { type: "spring", stiffness: 300, damping: 20 },
      });
    }
  }, [isPrePop, isPrePush, stopShaking, controls]);

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
        zIndex: isPrePush ? 10 : 1,
      }}
      layout // smooth transition from floating → normal stack
      animate={controls}
      className="text-sm font-bold text-black"
    >
      <div className="w-full text-left font-bold text-lg pl-3 flex-1">
        {stackIndex}
      </div>
      <div className="w-full text-center">
        i = {item.i} | start = {item.start} | &nbsp;&nbsp;<em> result = </em>
      </div>
    </motion.div>
  );
}
