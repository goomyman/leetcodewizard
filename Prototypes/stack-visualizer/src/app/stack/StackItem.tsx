"use client";

import { motion } from "framer-motion";
import { STACK_ITEM_HEIGHT, StackItemType } from "./StackItemConstants";

interface Props {
  item: StackItemType;
}

export default function StackItem({ item }: Props) {
  const { color, state } = item;

  const targetX =
    state === "halfPush" ? "-50%" : state === "halfPop" ? "50%" : "0%";
  const initialX = state === "halfPush" ? "-100%" : state === "halfPop" ? "0%" : "0%";

  const isAbsolute = state === "halfPush" || state === "halfPop";

  return (
    <motion.div layout className="w-full mb-1" style={{ height: STACK_ITEM_HEIGHT }}>
      <div className="relative w-full h-full">
        <motion.div
          initial={{ x: initialX, opacity: 0 }}
          animate={{ x: targetX, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20, duration: 0.45 }}
          style={{
            position: isAbsolute ? "absolute" : "relative",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            height: "100%",
            backgroundColor: color,
          }}
          className="rounded-md flex justify-center items-end text-sm font-bold text-black"
        >
          {`id=${item.id}`}
        </motion.div>
      </div>
    </motion.div>
  );
}
