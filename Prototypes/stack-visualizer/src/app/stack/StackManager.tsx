"use client";

import React from "react";
import Stack from "./Stack";
import StackControl from "./StackControl";
import { useHistory } from "./useHistory";
import { StackItemType, STACK_ITEM_WIDTH, STACK_ITEM_HEIGHT } from "./StackItemConstants";

let idCounter = 0;

const allowedStates: StackItemType["state"][] = [
  "start",
  "push",
  "prePush",
  "prePop",
  "popping",
];

// Type guard to ensure StackItemType
const isValidStackItem = (item: any): item is StackItemType =>
  item &&
  typeof item.id === "number" &&
  typeof item.i === "number" &&
  typeof item.start === "number" &&
  typeof item.color === "string" &&
  allowedStates.includes(item.state);

export default function StackManager() {
  const history = useHistory<StackItemType[]>([]);

  const getRandomColor = () =>
    `hsl(${Math.floor(Math.random() * 360)}, 70%, 80%)`;

  const normalizePrePop = (arr: StackItemType[]): StackItemType[] =>
    arr.map((item, index) =>
      item.state === "prePop" && index !== 0
        ? { ...item, state: "push" }
        : item
    ).filter(isValidStackItem);

  const stopAllPrePop = (arr: StackItemType[]): StackItemType[] =>
    arr.map(it =>
      it.state === "prePop" ? { ...it, state: "push" } : it
    ).filter(isValidStackItem);

  const prePush = () => {
    const stack = history.current;

    if (stack[0]?.state === "prePop") return;

    const newItem: StackItemType = {
      id: idCounter++,
      i: stack.length,
      start: stack.length,
      color: getRandomColor(),
      state: "prePush",
    };

    history.push([newItem, ...stack]);
  };

  const push = () => {
    const stack = history.current;
    let newStack: StackItemType[];

    if (stack[0]?.state === "prePush" || stack[0]?.state === "prePop") {
      newStack = [{ ...stack[0], state: "push" }, ...stack.slice(1)];
    } else {
      const newItem: StackItemType = {
        id: idCounter++,
        i: stack.length,
        start: stack.length,
        color: getRandomColor(),
        state: "push",
      };
      newStack = [newItem, ...stack];
    }

    history.push(newStack);
  };

  const prePop = () => {
    const stack = history.current;
    if (!stack.length || stack[0].state !== "push") return;

    const next = [{ ...stack[0], state: "prePop" }, ...stack.slice(1)];
    history.push(next);
  };

  const pop = () => {
    const stack = history.current;
    if (!stack.length || stack[0].state === "prePush") return;

    history.push(stack.slice(1));
  };

  const back = () => {
    if (!history.canGoBack) return;
    const prevIndex = history.index - 1;
    if (prevIndex < 0) return;

    const restored = normalizePrePop([...history.history[prevIndex]]);
    history.setIndex(prevIndex);
  };

  const forward = () => {
    if (!history.canGoForward) return;
    const nextIndex = history.index + 1;
    if (nextIndex >= history.history.length) return;

    const restored = normalizePrePop([...history.history[nextIndex]]);
    history.setIndex(nextIndex);
  };

  const stack = history.current;
  const topState = stack[0]?.state;

  const disabledPrePush = topState === "prePush" || topState === "prePop";
  const disabledPush = topState === "prePop"; 
  const disabledPrePop = topState !== "push";
  const disabledPop = !stack.length || topState === "prePush";
  const canGoBack = history.canGoBack;
  const canGoForward = history.canGoForward;

  return (
    <div className="p-4 flex flex-col items-center gap-4 relative">
      <StackControl
        onPrePush={prePush}
        onPush={push}
        onPrePop={prePop}
        onPop={pop}
        onBack={back}
        onForward={forward}
        disabledPrePush={disabledPrePush}
        disabledPush={disabledPush}
        disabledPrePop={disabledPrePop}
        disabledPop={disabledPop}
        canGoBack={canGoBack}
        canGoForward={canGoForward}
      />

      <Stack stack={stack} />
    </div>
  );
}
