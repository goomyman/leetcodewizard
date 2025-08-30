"use client";

import { motion } from "framer-motion";
import { STACK_ITEM_HEIGHT, StackItemType } from "./StackItemConstants";

interface Props {
  item: StackItemType;
}

export default function StackItem({ item }: Props) {
  const { color = "#7f9cf5", state } = item;

  const isHalf = state === "halfPush" || state === "halfPop";

  const initial =
    state === "halfPush"
      ? { x: "-100%", opacity: 0 }
      : state === "halfPop"
      ? { x: "0%", opacity: 1 }
      : { x: 0, opacity: 0 };

  const animate =
    state === "halfPush"
      ? { x: "-50%", opacity: 1 }
      : state === "halfPop"
      ? { x: "50%", opacity: 1 }
      : { x: 0, opacity: 1 };

  return (
    <motion.div layout className="w-full mb-1" style={{ height: STACK_ITEM_HEIGHT }}>
      <div className="relative w-full h-full">
        <motion.div
          initial={initial}
          animate={animate}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, type: "spring", stiffness: 200, damping: 20 }}
          style={{
            position: isHalf ? "absolute" : "relative",
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
