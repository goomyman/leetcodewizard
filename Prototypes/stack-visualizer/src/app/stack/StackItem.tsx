"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { StackItemType, StackItemState, STACK_ITEM_WIDTH, STACK_ITEM_HEIGHT } from "./StackItemConstants";

interface StackItemProps {
  item: StackItemType;
  stopShaking: boolean;
  stackIndex: number;
}

export default function StackItem({ item, stopShaking, stackIndex }: StackItemProps) {
  const isPreInsert = item.state === StackItemState.PreInsert;
  const isPreRemove = item.state === StackItemState.PreRemove;

  const controls = useAnimation();

  // animation: gentle vertical bounce + pulse
  useEffect(() => {
    const shouldAnimate = (isPreRemove || isPreInsert) && !stopShaking;
    const baseY = isPreInsert ? -(STACK_ITEM_HEIGHT * 0.05) : 0;
    const baseX = isPreInsert ? -(STACK_ITEM_WIDTH * 0.30) : 0;

    if (shouldAnimate) {
      controls.start({
        y: [baseY, baseY - 3, baseY, baseY - 3, baseY],
        x: [baseX, baseX, baseX, baseX, baseX],
        scale: [1, 1.03, 1, 1.03, 1],
        transition: {
          duration: 2.5,
          repeat: Infinity,
          repeatType: "loop",
        },
      });
    } else {
      controls.stop();
      controls.start({
        y: 0,
        x: 0,
        scale: 1,
        transition: { type: "spring", stiffness: 300, damping: 20 },
      });
    }
  }, [isPreRemove, isPreInsert, stopShaking, controls]);

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
        boxShadow: isPreInsert ? "0px 8px 15px rgba(0,0,0,0.2)" : "none",
        zIndex: isPreInsert ? 10 : 1,
      }}
      layout // smooth transition from floating → normal stack
      animate={controls}
      className="text-sm font-bold text-black"
    >
      <div className="w-full text-left font-bold text-lg pl-3 flex-1">
        {item.level}
      </div>
      <div className="w-full text-center">
         {item.text}
      </div>
    </motion.div>
  );
}
