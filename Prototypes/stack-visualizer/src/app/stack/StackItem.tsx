"use client";

import { motion } from "framer-motion";

export type StackItemType = {
  id: number;
  path: string;
  color: string;
  state?: "halfPush" | "fullPush" | "halfPop";
};

export const STACK_ITEM_HEIGHT = 20; // px

export default function StackItem({ item }: { item: StackItemType }) {
  const { id, path, color, state } = item;

  // Inner animation target (x) depends on state.
  const getTarget = () => {
    if (state === "halfPush") return { x: "-50%", opacity: 1 };
    if (state === "halfPop") return { x: "50%", opacity: 1 };
    // fullPush or default
    return { x: 0, opacity: 1 };
  };

  const initial =
    state === "halfPush" ? { x: "-100%", opacity: 0 } : { opacity: 0, y: 10 };

  // When half states are used, the inner element becomes absolute so the wrapper keeps space.
  const isAbsolute = state === "halfPush" || state === "halfPop";

  return (
    // wrapper participates in layout (so other items animate smoothly),
    // but has a fixed height so inner absolute element doesn't collapse layout.
    <motion.div
      layout
      className="w-full mb-1"
      style={{ height: STACK_ITEM_HEIGHT }}
    >
      <div className="relative w-full h-full">
        <motion.div
          initial={initial}
          animate={getTarget()}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, type: "spring", stiffness: 200, damping: 20 }}
          // make it absolute when paused halfway so it doesn't change layout height
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
          title={`id=${id}, path="${path}"`}
        >
          {`id=${id}, path="${path}"`}
        </motion.div>
      </div>
    </motion.div>
  );
}
