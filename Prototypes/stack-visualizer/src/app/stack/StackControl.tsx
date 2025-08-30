"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import StackItem, { StackItemType } from "./StackItem";
import "./Stack.css"; // optional for custom rules if needed

export default function StackControl() {
  const [stack, setStack] = useState<StackItemType[]>([]);
  const [stackSize, setStackSize] = useState<number>(0);

  const getRandomColor = (): string =>
    `hsl(${Math.floor(Math.random() * 360)}, 70%, 80%)`;

  const pushItem = () => {
    const newItem: StackItemType = {
      i: stack.length,
      start: 1,
      color: getRandomColor(),
      height: 20
    };
    setStack([newItem, ...stack]);
    setStackSize(stack.length + 1);
  };

  const popItem = () => {
    if (stack.length === 0) return;
    setStack(stack.slice(1)); // remove top visually
    setStackSize(stack.length - 1);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setStackSize(value);

    if (value > stack.length) {
      const newItems = Array.from({ length: value - stack.length }, (_, i) => ({
        i: stack.length + i,
        start: 1,
        color: getRandomColor(),
        height: 20,
      }));
      setStack([...newItems, ...stack]);
    } else if (value < stack.length) {
      setStack(stack.slice(stack.length - value)); // keep top items
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
          disabled={stack.length === 0}
          className="px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50 hover:bg-red-600 disabled:hover:bg-red-500"
        >
          Pop
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
