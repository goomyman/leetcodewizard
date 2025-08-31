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

const sanitizeStackItem = (item: StackItemType): StackItemType => ({
  ...item,
  state: allowedStates.includes(item.state) ? item.state : "start",
});

export default function StackManager() {
  const [stack, setStack] = React.useState<StackItemType[]>([]);
  const history = useHistory<StackItemType[]>(stack);

  const getRandomColor = () =>
    `hsl(${Math.floor(Math.random() * 360)}, 70%, 80%)`;

  const normalizePrePop = (arr: StackItemType[]): StackItemType[] =>
    arr.map((item, index) =>
      item.state === "prePop" && index !== 0
        ? { ...item, state: "push" } as StackItemType
        : item
    ).map(sanitizeStackItem);

  const stopAllPrePop = (arr: StackItemType[]): StackItemType[] =>
    arr.map(it =>
      it.state === "prePop" ? { ...it, state: "push" } as StackItemType : it
    ).map(sanitizeStackItem);

  const prePush = () => {
    if (stack[0]?.state === "prePop") return;

    const newItem: StackItemType = {
      id: idCounter++,
      i: stack.length,
      start: stack.length,
      color: getRandomColor(),
      state: "prePush",
    };

    const newStack = [newItem, ...stack];
    setStack(newStack);
    history.push(newStack);
  };

  const push = () => {
    let newStack: StackItemType[];

    if (stack[0]?.state === "prePush") {
      newStack = [{ ...stack[0], state: "push" } as StackItemType, ...stack.slice(1)];
    } else if (stack[0]?.state === "prePop") {
      // convert top prePop to push
      newStack = [{ ...stack[0], state: "push" } as StackItemType, ...stack.slice(1)];
    } else {
      // push new item
      const newItem: StackItemType = {
        id: idCounter++,
        i: stack.length,
        start: stack.length,
        color: getRandomColor(),
        state: "push",
      };
      newStack = [newItem, ...stack];
    }

    setStack(newStack);
    history.push(newStack);
  };

  const prePop = () => {
    if (!stack.length || stack[0].state !== "push") return;
    const next = [{ ...stack[0], state: "prePop" } as StackItemType, ...stack.slice(1)];
    setStack(next);
    history.push(next);
  };

  const pop = () => {
    if (!stack.length || stack[0].state === "prePush") return;
    const next = stack.slice(1);
    setStack(next);
    history.push(next);
  };

  const back = () => {
    if (!history.canGoBack) return;
    const prevIndex = history.index - 1;
    if (prevIndex < 0) return;

    const restored = normalizePrePop([...history.history[prevIndex]]);
    history.setIndex(prevIndex);
    setStack(restored);
  };

  const forward = () => {
    if (!history.canGoForward) return;
    const nextIndex = history.index + 1;
    if (nextIndex >= history.history.length) return;

    const restored = normalizePrePop([...history.history[nextIndex]]);
    history.setIndex(nextIndex);
    setStack(restored);
  };

  const topState = stack[0]?.state;

  let disabledPrePush = topState === "prePush" || topState === "prePop";
  let disabledPush = topState === "prePop"; 
  let disabledPrePop = topState !== "push";
  let disabledPop = !stack.length || topState === "prePush";
  let canGoBack = history.canGoBack;
  let canGoForward = history.canGoForward;

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
