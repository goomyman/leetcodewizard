import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { ControlItem, ControlItemState } from "./ControlTypes";

interface StackItemProps {
  item: ControlItem;
  index: number;
  stopShaking: boolean;
}

export default function StackItem({ item, stopShaking, index }: StackItemProps) {
  const controls = useAnimation();

  useEffect(() => {
    const isPreInsert = item.state === ControlItemState.PreInsert;
    const isPreRemove = item.state === ControlItemState.PreRemove;

    if ((isPreInsert || isPreRemove) && !stopShaking) {
      controls.start({
        x: isPreInsert ? [-10, 10, -10, 0] : [0, 5, -5, 0],
        y: isPreInsert ? [0, -5, 5, 0] : [0, 5, -5, 0],
        scale: [1, 1.05, 1, 1.05, 1],
        transition: { duration: 1.5, repeat: Infinity },
      });
    } else {
      controls.start({
        x: 0,
        y: 0,
        scale: 1,
        transition: { type: "spring", stiffness: 300, damping: 20 },
      });
    }
  }, [item.state, stopShaking, controls]);

  const displayColor =
    item.state === ControlItemState.PreInsert
      ? "green"
      : item.state === ControlItemState.PreRemove
      ? "red"
      : item.color ?? "gray";

  return (
    <motion.div
      animate={controls}
      className="flex items-center justify-center font-bold text-white rounded"
      style={{
        width: 50,
        height: 50,
        marginBottom: 4,
        backgroundColor: displayColor,
      }}
    >
      {item.value}
    </motion.div>
  );
}
