"use client";

import React from "react";
import Stack from "./Stack";
import StackControl from "./StackControl";
import SliderControl from "./SliderControl";
import { useHistory } from "./useHistory";
import { StackItemType } from "./StackItemConstants";

let idCounter = 0;
const allowedStates: StackItemType["state"][] = ["start", "push", "prePush", "prePop"];
const isValidStackItem = (item: any): item is StackItemType =>
  item && typeof item.id === "number" && typeof item.i === "number" && typeof item.start === "number" && typeof item.color === "string" && allowedStates.includes(item.state);

export default function StackManager() {
  const history = useHistory<StackItemType[]>([]);

  const getRandomColor = () => `hsl(${Math.floor(Math.random() * 360)}, 70%, 80%)`;

  const normalizePrePop = (arr: StackItemType[]): StackItemType[] =>
    arr.map((item, index) => item.state === "prePop" && index !== 0 ? { ...item, state: "push" as StackItemType["state"] } : item)
       .filter(isValidStackItem);

  const prePush = () => {
    const stack = history.current;
    if (stack[0]?.state === "prePop") return;
    const newItem: StackItemType = { id: idCounter++, text: "abc", color: getRandomColor(), state: "prePush" as StackItemType["state"] };
    history.push([newItem, ...stack]);
  };

  const push = () => {
    const stack = history.current;
    let newStack: StackItemType[];
    if (stack[0]?.state === "prePush" || stack[0]?.state === "prePop") {
      newStack = [{ ...stack[0], state: "push" as StackItemType["state"] }, ...stack.slice(1)];
    } else {
      const newItem: StackItemType = { id: idCounter++, text: "abc", color: getRandomColor(), state: "push" as StackItemType["state"] };
      newStack = [newItem, ...stack];
    }
    history.push(newStack);
  };

  const prePop = () => {
    const stack = history.current;
    if (!stack.length || stack[0].state !== "push") return;
    const next = [{ ...stack[0], state: "prePop" as StackItemType["state"] }, ...stack.slice(1)];
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
    normalizePrePop([...history.history[prevIndex]]);
    history.setIndex(prevIndex);
  };

  const forward = () => {
    if (!history.canGoForward) return;
    const nextIndex = history.index + 1;
    if (nextIndex >= history.history.length) return;
    normalizePrePop([...history.history[nextIndex]]);
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
    <div className="p-4 flex flex-col items-center gap-4 relative w-full max-w-md">
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

      <SliderControl
        historyLength={history.history.length}
        currentIndex={history.index}
        onChange={history.setIndex}
      />

      <Stack stack={stack} />
    </div>
  );
}
