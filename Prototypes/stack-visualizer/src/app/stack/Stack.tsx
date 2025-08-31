"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import StackItem from "./StackItem";
import { StackItemType, StackItemState } from "./StackItemConstants";
import { useHistory } from "./useHistory";

export default function Stack() {
  const nextIdRef = useRef(0);
  const nextIRef = useRef(0);

  // Initialize history with empty stack
  const [stack, setStack] = useState<StackItemType[]>([]);
  const history = useHistory<StackItemType[]>(stack);

  const getRandomColor = () =>
    `hsl(${Math.floor(Math.random() * 360)}, 70%, 80%)`;

  const stopAllPrePop = (prev: StackItemType[]) =>
    prev.map(it =>
      it.state === "prePop" ? { ...it, state: "push" as StackItemState } : it
    );

  // --- Stack actions ---

  const prePush = () => {
    if (stack[0]?.state === "prePush") return;

    const id = nextIdRef.current++;
    const newItem: StackItemType = {
      id,
      i: nextIRef.current++,
      start: stack.length,
      color: getRandomColor(),
      state: "prePush" as StackItemState,
    };

    const newStack = [newItem, ...stopAllPrePop(stack)];
    setStack(newStack);
    history.push(newStack);
  };

  const push = () => {
    if (stack.length > 0 && stack[0].state === "prePush") {
      const next = [...stack];
      next[0] = { ...next[0], state: "push" as StackItemState };
      setStack(next);
      history.push(next);
    } else {
      const id = nextIdRef.current++;
      const newItem: StackItemType = {
        id,
        i: nextIRef.current++,
        start: stack.length,
        color: getRandomColor(),
        state: "push" as StackItemState,
      };
      const newStack = [newItem, ...stopAllPrePop(stack)];
      setStack(newStack);
      history.push(newStack);
    }
  };

  const prePop = () => {
    if (!stack.length || stack[0].state === "prePush") return;

    const next = [...stack];
    next[0] = { ...next[0], state: "prePop" as StackItemState };
    setStack(next);
    history.push(next);
  };

  const pop = () => {
    if (!stack.length) return;

    const next = [...stack];
    next.shift(); // remove top
    setStack(next);
    history.push(next);
  };

  // --- Optional: automatically convert prePush → push after delay ---
  useEffect(() => {
    if (stack[0]?.state === "prePush") {
      const timer = setTimeout(() => push(), 500); // adjust delay as needed
      return () => clearTimeout(timer);
    }
  }, [stack]);

  // --- History navigation ---
  const back = () => {
    history.back();
    setStack(history.current);
  };
  const forward = () => {
    history.forward();
    setStack(history.current);
  };

  return (
    <>
      <div className="flex gap-2 mb-4">
        <button
          onClick={back}
          disabled={!history.canGoBack}
          className="px-3 py-1 bg-gray-500 text-white rounded disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={forward}
          disabled={!history.canGoForward}
          className="px-3 py-1 bg-gray-500 text-white rounded disabled:opacity-50"
        >
          Forward
        </button>
        <button
          onClick={prePush}
          disabled={stack[0]?.state === "prePush"}
          className="px-3 py-1 bg-blue-300 text-white rounded disabled:opacity-50"
        >
          PrePush
        </button>
        <button
          onClick={push}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          Push
        </button>
        <button
          onClick={prePop}
          disabled={stack[0]?.state === "prePush" || stack.length === 0}
          className="px-3 py-1 bg-red-300 text-white rounded disabled:opacity-50"
        >
          PrePop
        </button>
        <button
          onClick={pop}
          disabled={stack.length === 0}
          className="px-3 py-1 bg-red-500 text-white rounded disabled:opacity-50"
        >
          Pop
        </button>
      </div>

      <div className="stack-container flex flex-col justify-end items-center w-72 h-96 border border-transparent">
        <AnimatePresence>
          {stack.map(item => (
            <StackItem
              key={item.id}
              item={item}
              stopShaking={item.state !== "prePop"}
            />
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
