"use client";

import { useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import StackItem, { type StackItemType, STACK_ITEM_HEIGHT } from "./StackItem";

export default function StackControl() {
  const [stack, setStack] = useState<StackItemType[]>([]);
  const [stackSize, setStackSize] = useState<number>(0);

  const nextIdRef = useRef<number>(0);
  const timeoutsRef = useRef<number[]>([]);

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach((t) => clearTimeout(t));
    timeoutsRef.current = [];
  };

  const getRandomColor = () =>
    `hsl(${Math.floor(Math.random() * 360)}, 70%, 80%)`;

  const pushItem = () => {
    // If top is half-pushed or half-popped, complete it to full center.
    if (stack[0]?.state === "halfPush" || stack[0]?.state === "halfPop") {
      setStack((prev) => {
        if (!prev.length) return prev;
        const next = [...prev];
        next[0] = { ...next[0], state: "fullPush" };
        return next;
      });
      return;
    }

    // Otherwise create a new halfPush item (stops halfway).
    const id = nextIdRef.current++;
    const newItem: StackItemType = {
      id,
      path: `path-${id}`,
      color: getRandomColor(),
      state: "halfPush",
    };
    setStack((prev) => [newItem, ...prev]);
    setStackSize((s) => s + 1);
  };

  const popItem = () => {
    if (!stack.length) return;

    // If the top is already halfPop, remove it fully.
    if (stack[0].state === "halfPop") {
      setStack((prev) => prev.slice(1));
      setStackSize((s) => Math.max(0, s - 1));
      return;
    }

    // Otherwise mark top as halfPop (it will slide halfway out).
    setStack((prev) => {
      if (!prev.length) return prev;
      const next = [...prev];
      next[0] = { ...next[0], state: "halfPop" };
      return next;
    });
  };

  // Slider increases/decreases should respect the two-step animation.
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    clearAllTimeouts();

    // Increase: add `delta` items, each starts halfPush then completes to fullPush in a small stagger.
    if (value > stack.length) {
      const delta = value - stack.length;
      for (let i = 0; i < delta; i++) {
        const id = nextIdRef.current++;
        const newItem: StackItemType = {
          id,
          path: `path-${id}`,
          color: getRandomColor(),
          state: "halfPush",
        };
        // add immediately (half-way)
        setStack((prev) => [newItem, ...prev]);

        // schedule completion to fullPush with stagger
        const t = window.setTimeout(() => {
          setStack((prev) => {
            return prev.map((it) => (it.id === id ? { ...it, state: "fullPush" } : it));
          });
        }, 250 + i * 150);
        timeoutsRef.current.push(t);
      }
    } else if (value < stack.length) {
      // Decrease: remove items one-by-one: mark halfPop, then remove after short delay (staggered)
      const delta = stack.length - value;
      for (let i = 0; i < delta; i++) {
        // schedule marking top as halfPop
        const t1 = window.setTimeout(() => {
          setStack((prev) => {
            if (!prev.length) return prev;
            const next = [...prev];
            next[0] = { ...next[0], state: "halfPop" };
            return next;
          });
        }, i * 180);
        timeoutsRef.current.push(t1);

        // schedule full removal shortly after
        const t2 = window.setTimeout(() => {
          setStack((prev) => prev.slice(1));
        }, 250 + i * 180);
        timeoutsRef.current.push(t2);
      }
    }

    setStackSize(value);
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
            <StackItem key={item.id} item={item} />
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
