"use client";

import { motion } from "framer-motion";
import { ARRAY_ITEM_SIZE } from "./ArrayItemConstants";
import { ControlItem, ControlItemState } from "./ControlTypes";

interface ArrayItemProps {
  item: ControlItem;
  index: number;
  preItem?: ControlItem; // original item for updates
}

export default function ArrayItem({ item, preItem }: ArrayItemProps) {
  const isPreInsert = item.state === ControlItemState.PreInsert;
  const isPreUpdate = item.state === ControlItemState.PreUpdate;

  const offsetY = -ARRAY_ITEM_SIZE * (isPreInsert ? 1 : 1); // offset for pre-states
  const displayColor = isPreInsert ? "green" : isPreUpdate ? "yellow" : item.color;

  return (
    <div className="relative w-[ARRAY_ITEM_SIZE] h-[ARRAY_ITEM_SIZE]">
      {/* Original item underneath for updates */}
      {preItem && isPreUpdate && (
        <motion.div
          style={{
            width: ARRAY_ITEM_SIZE,
            height: ARRAY_ITEM_SIZE,
            backgroundColor: preItem.color,
            border: "2px solid white",
            position: "absolute",
            top: 0,
            left: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          layout
        >
          {preItem.value}
        </motion.div>
      )}

      {/* PreInsert or PreUpdate block */}
      <motion.div
        style={{
          width: ARRAY_ITEM_SIZE,
          height: ARRAY_ITEM_SIZE,
          backgroundColor: displayColor,
          border: "2px solid white",
          position: "absolute",
          top: 0,
          left: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        layout
        initial={{ y: offsetY }}
        animate={{ y: isPreInsert || isPreUpdate ? offsetY : 0, rotate: isPreUpdate ? [0, 5, -5, 0] : 0 }}
        transition={{
          y: { type: "spring", stiffness: 300, damping: 20 },
          rotate: isPreUpdate
            ? { type: "tween", duration: 0.6, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }
            : {},
        }}
        className="font-bold text-black"
      >
        {item.value}
      </motion.div>
    </div>
  );
}
