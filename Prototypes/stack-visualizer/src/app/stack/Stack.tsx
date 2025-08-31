"use client";

import { useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import StackItem from "./StackItem";
import { StackItemType, STACK_ITEM_HEIGHT } from "./StackItemConstants";

type StackState = StackItemType[];

export default function StackControl() {
  const [stack, setStack] = useState<StackItemType[]>([]);
  const [history, setHistory] = useState<StackState[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const nextIdRef = useRef<number>(0);

  const getRandomColor = () =>
    `hsl(${Math.floor(Math.random() * 360)}, 70%, 80%)`;

  const recordHistory = (newStack: StackItemType[]) => {
    const slicedHistory = history.slice(0, historyIndex + 1);
    setHistory([...slicedHistory, newStack]);
    setHistoryIndex((s) => s + 1);
  };

  const prePush = () => {
    if (stack[0]?.state === "prePush") return; // only one prePush at top
    const id = nextIdRef.current++;
    const newItem: StackItemType = {
      id,
      color: getRandomColor(),
      state: "prePush",
      i: stack.length,
      start: 0,
    };
    const newStack = [newItem, ...stack];
    setStack(newStack);
    recordHistory(newStack);
  };

  const push = () => {
    if (!stack.length) return prePush(); // if empty, create one directly
    const top = stack[0];
    if (top.state === "prePush") {
      const newStack = [
        { ...top, state: "push" },
        ...stack.slice(1),
      ];
      setStack(newStack);
      recordHistory(newStack);
    } else {
      // create a new push item directly in the middle
      const id = nextIdRef.current++;
      const newItem: StackItemType = {
        id,
        color: getRandomColor(),
        state: "push",
        i: stack.length,
        start: 0,
      };
      const newStack = [newItem, ...stack];
      setStack(newStack);
      recordHistory(newStack);
    }
  };

  const prePop = () => {
    const top = stack[0];
    if (!top || top.state === "prePop") return;
    const newStack = [{ ...top, state: "prePop" }, ...stack.slice(1)];
    setStack(newStack);
    recordHistory(newStack);
  };

  const pop = () => {
    if (!stack.length) return;
    const top = stack[0];
    if (top.state === "prePop") {
      const newStack = stack.slice(1);
      setStack(newStack);
      recordHistory(newStack);
    } else {
      const newStack = [{ ...top, state: "pop" }, ...stack.slice(1)];
      setStack(newStack);
      // schedule removal after animation duration
      setTimeout(() => {
        const finalStack = stack.slice(1);
        setStack(finalStack);
        recordHistory(finalStack);
      }, 400); // match animation
    }
  };

  const back = () => {
    if (historyIndex <= 0) return;
    const newIndex = historyIndex - 1;
    setStack(history[newIndex]);
    setHistoryIndex(newIndex);
  };

  const forward = () => {
    if (historyIndex >= history.length - 1) return;
    const newIndex = historyIndex + 1;
    setStack(history[newIndex]);
    setHistoryIndex(newIndex);
  };

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        <button
          onClick={back}
          disabled={historyIndex <= 0}
          className="px-4 py-2 bg-gray-400 text-white rounded disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={forward}
          disabled={historyIndex >= history.length - 1}
          className="px-4 py-2 bg-gray-400 text-white rounded disabled:opacity-50"
        >
          Forward
        </button>
        <button
          onClick={prePush}
          disabled={stack[0]?.state === "prePush"}
          className="px-4 py-2 bg-yellow-500 text-white rounded disabled:opacity-50"
        >
          PrePush
        </button>
        <button
          onClick={push}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Push
        </button>
        <button
          onClick={prePop}
          disabled={stack[0]?.state === "prePop" || !stack.length}
          className="px-4 py-2 bg-orange-500 text-white rounded disabled:opacity-50"
        >
          PrePop
        </button>
        <button
          onClick={pop}
          disabled={!stack.length}
          className="px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50"
        >
          Pop
        </button>
      </div>

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
