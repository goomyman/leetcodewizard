"use client";

import { useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import StackItem, { StackItemType, STACK_ITEM_HEIGHT, StackItemState } from "./StackItem";

interface HistoryState {
  stack: StackItemType[];
  stackSize: number;
}

export default function StackControl() {
  const [stack, setStack] = useState<StackItemType[]>([]);
  const [stackSize, setStackSize] = useState(0);

  const nextIdRef = useRef(0);
  const historyRef = useRef<HistoryState[]>([]);
  const historyIndexRef = useRef(-1);

  const saveHistory = (newStack: StackItemType[]) => {
    const snapshot: HistoryState = { stack: [...newStack], stackSize: newStack.length };
    historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
    historyRef.current.push(snapshot);
    historyIndexRef.current++;
  };

  const getRandomColor = () =>
    `hsl(${Math.floor(Math.random() * 360)}, 70%, 80%)`;

  const createNewItem = (state: StackItemState): StackItemType => ({
    id: nextIdRef.current++,
    path: `path-${nextIdRef.current}`,
    color: getRandomColor(),
    state,
    i: stack.length,
    start: 0,
  });

  const prePush = () => {
    const newItem = createNewItem("prePush");
    const newStack = [newItem, ...stack];
    setStack(newStack);
    setStackSize(newStack.length);
    saveHistory(newStack);
  };

  const push = () => {
    let newStack = [...stack];
    if (newStack[0]?.state === "prePush") {
      newStack[0] = { ...newStack[0], state: "push" };
    } else {
      const newItem = createNewItem("push");
      newStack = [newItem, ...newStack];
    }
    setStack(newStack);
    setStackSize(newStack.length);
    saveHistory(newStack);
  };

  const prePop = () => {
    if (!stack.length) return;
    const newStack = [...stack];
    newStack[0] = { ...newStack[0], state: "prePop" };
    setStack(newStack);
    saveHistory(newStack);
  };

  const pop = () => {
    if (!stack.length) return;
    let newStack = [...stack];
    if (newStack[0].state === "prePush") {
      newStack = newStack.slice(1); // remove halfway prePush immediately
    } else {
      newStack[0] = { ...newStack[0], state: "pop" };
      newStack = newStack.slice(1); // remove
    }
    setStack(newStack);
    setStackSize(newStack.length);
    saveHistory(newStack);
  };

  const back = () => {
    if (historyIndexRef.current <= 0) return;
    historyIndexRef.current--;
    const prev = historyRef.current[historyIndexRef.current];
    setStack(prev.stack);
    setStackSize(prev.stackSize);
  };

  const forward = () => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return;
    historyIndexRef.current++;
    const next = historyRef.current[historyIndexRef.current];
    setStack(next.stack);
    setStackSize(next.stackSize);
  };

  return (
    <>
      <div className="flex gap-2 mb-4 flex-wrap">
        <button onClick={back} className="px-3 py-2 bg-gray-400 rounded hover:bg-gray-500">Back</button>
        <button onClick={forward} className="px-3 py-2 bg-gray-400 rounded hover:bg-gray-500">Forward</button>
        <button onClick={prePush} className="px-3 py-2 bg-yellow-400 rounded hover:bg-yellow-500">PrePush</button>
        <button onClick={push} className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Push</button>
        <button onClick={prePop} className="px-3 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">PrePop</button>
        <button onClick={pop} className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600">Pop</button>
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
