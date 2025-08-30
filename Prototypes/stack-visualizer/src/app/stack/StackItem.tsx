"use client";

import { motion } from "framer-motion";
import { StackItemType, STACK_ITEM_HEIGHT } from "./StackItemConstants";

export default function StackItem({ item }: { item: StackItemType }) {
  const { i, start, color, state } = item;

  const getTarget = () => {
    if (state === "halfPush") return { x: "-50%", opacity: 1 };
    if (state === "halfPop") return { x: "50%", opacity: 1 };
    return { x: 0, opacity: 1 };
  };

  const initial =
    state === "halfPush" ? { x: "-100%", opacity: 0 } : { opacity: 0, y: 10 };

  const isAbsolute = state === "halfPush" || state === "halfPop";

  return (
    <motion.div layout className="w-full mb-1" style={{ height: STACK_ITEM_HEIGHT }}>
      <div className="relative w-full h-full">
        <motion.div
          initial={initial}
          animate={getTarget()}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, type: "spring", stiffness: 200, damping: 20 }}
          style={{
            position: isAbsolute ? "absolute" : "relative",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            backgroundColor: color,
            height: "100%",
          }}
          className="rounded-md flex justify-center items-end text-sm font-bold text-black"
          title={`i=${i}, start=${start}`}
        >
          {`i=${i}, start=${start}`}
        </motion.div>
      </div>
    </motion.div>
  );
}
