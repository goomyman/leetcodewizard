"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import StackItem, { type StackItemType, STACK_ITEM_HEIGHT } from "./StackItem";

export default function StackControl() {
  const [stack, setStack] = useState<StackItemType[]>([]);
  const [stackSize, setStackSize] = useState(0);

  const getRandomColor = () =>
    `hsl(${Math.floor(Math.random() * 360)}, 70%, 80%)`;

  const pushItem = () => {
    if (stack[0]?.paused === "push") {
      // resume paused push
      const next = [...stack];
      next[0] = { ...next[0], paused: undefined };
      setStack(next);
      return;
    }
    const newItem: StackItemType = {
      i: stack.length,
      path: `path-${stack.length}`,
      color: getRandomColor(),
    };
    setStack([newItem, ...stack]);
    setStackSize((s) => s + 1);
  };

  const pushPauseItem = () => {
    const newItem: StackItemType = {
      i: stack.length,
      path: `path-${stack.length}`,
      color: getRandomColor(),
      paused: "push",
    };
    setStack([newItem, ...stack]);
    setStackSize((s) => s + 1);
  };

  const popPauseItem = () => {
    if (!stack.length) return;
    const next = [...stack];
    next[0] = { ...next[0], paused: "pop" };
    setStack(next);
  };

  const popItem = () => {
    if (!stack.length) return;

    if (stack[0]?.paused === "pop") {
      // actually remove paused pop
      setStack(stack.slice(1));
      setStackSize((s) => Math.max(0, s - 1));
    } else {
      // normal remove
      setStack(stack.slice(1));
      setStackSize((s) => Math.max(0, s - 1));
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setStackSize(value);

    if (value > stack.length) {
      const add = value - stack.length;
      const newItems = Array.from({ length: add }, (_, i) => {
        const idx = stack.length + i;
        return {
          i: idx,
          path: `path-${idx}`,
          color: getRandomColor(),
        } as StackItemType;
      });
      setStack([...newItems, ...stack]);
    } else if (value < stack.length) {
      setStack(stack.slice(0, value));
    }
  };

  return (
    <>
      <div className="flex gap-4 mb-4">
        <button
          onClick={pushItem}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Push
        </button>
        <button
          onClick={popItem}
          disabled={!stack.length}
          className="px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50 hover:bg-red-600 disabled:hover:bg-red-500"
        >
          Pop
        </button>
        <button
          onClick={pushPauseItem}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Push Pause
        </button>
        <button
          onClick={popPauseItem}
          disabled={!stack.length}
          className="px-4 py-2 bg-purple-500 text-white rounded disabled:opacity-50 hover:bg-purple-600 disabled:hover:bg-purple-500"
        >
          Pop Pause
        </button>
      </div>

      <input
        type="range"
        min="0"
        max="20"
        value={stackSize}
        onChange={handleSliderChange}
        className="w-72 mb-6"
      />

      <div className="stack-container flex flex-col justify-end items-center w-72 h-96 border border-transparent">
        <AnimatePresence>
          {stack.map((item) => (
            <StackItem key={item.i} item={item} />
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
