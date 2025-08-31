// StackItem.tsx
"use client";

import { motion } from "framer-motion";
import { StackItemType, STACK_ITEM_HEIGHT } from "./StackItemConstants";

export default function StackItem({ item }: { item: StackItemType }) {
  const { color, state, i, start } = item;

  let initial: any = { opacity: 0, y: 10, x: 0 };
  let animate: any = { opacity: 1, y: 0, x: 0 };
  let transition: any = { type: "spring", stiffness: 200, damping: 20, duration: 0.3 };

  switch (state) {
    case "prePush":
      initial = { opacity: 0, x: -50, y: -20 };
      animate = { opacity: 1, x: -25, y: -10 }; // **pause halfway**
      transition = { type: "spring", stiffness: 200, damping: 20 };
      break;

    case "push":
      initial = { opacity: 0, x: -25, y: -10 }; // continue from halfway
      animate = { opacity: 1, x: 0, y: 0 };
      transition = { type: "spring", stiffness: 200, damping: 20 };
      break;

    case "prePop":
      initial = { x: 0, y: 0 };
      animate = { x: [0, -5, 5, 0] }; // shake
      transition = { type: "tween", duration: 0.4, ease: "easeInOut" };
      break;

    case "pop":
      initial = { x: 0, y: 0 };
      animate = { x: 50, opacity: 0 };
      transition = { type: "spring", stiffness: 200, damping: 20 };
      break;
  }

  return (
    <motion.div
      layout
      className="w-full mb-1"
      style={{ height: STACK_ITEM_HEIGHT }}
    >
      <div className="relative w-full h-full">
        <motion.div
          initial={initial}
          animate={animate}
          exit={{ opacity: 0 }}
          transition={transition}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            backgroundColor: state === "prePop" ? "red" : color,
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
