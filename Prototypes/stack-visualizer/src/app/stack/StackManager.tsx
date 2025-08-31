"use client";

import React from "react";
import Stack from "./Stack";
import StackControl from "./StackControl";
import StackItem from "./StackItem";
import { useHistory } from "./useHistory";
import { StackItemType, STACK_ITEM_HEIGHT } from "./StackItemConstants";

let idCounter = 0;

// Allowed StackItem states
const allowedStates: StackItemType["state"][] = [
  "start",
  "push",
  "prePush",
  "prePop",
  "popping",
];

// Ensure an item has a valid state
const sanitizeStackItem = (item: StackItemType): StackItemType => ({
  ...item,
  state: allowedStates.includes(item.state) ? item.state : "start",
});

export default function StackManager() {
  const [stack, setStack] = React.useState<StackItemType[]>([]);
  const [prePushItem, setPrePushItem] = React.useState<StackItemType | null>(null);
  const history = useHistory<StackItemType[]>(stack);

  const getRandomColor = () => `hsl(${Math.floor(Math.random() * 360)}, 70%, 80%)`;

  // Only top item can be prePop
  const normalizePrePop = (arr: StackItemType[]): StackItemType[] =>
    arr
      .map((item, index) =>
        item.state === "prePop" && index !== 0
          ? { ...item, state: "push" } as StackItemType
          : item
      )
      .map(item => sanitizeStackItem(item) as StackItemType);

  // Stop all prePop before pushing a new item
  const stopAllPrePop = (arr: StackItemType[]): StackItemType[] =>
    arr
      .map(it => (it.state === "prePop" ? { ...it, state: "push" } as StackItemType : it))
      .map(item => sanitizeStackItem(item) as StackItemType);

  const prePush = () => {
    if (prePushItem || stack[0]?.state === "prePop") return;

    const newItem: StackItemType = {
      id: idCounter++,
      i: stack.length,
      start: stack.length,
      color: getRandomColor(),
      state: "prePush",
    };

    setPrePushItem(newItem);
    history.push([...stack, newItem]);
  };

  const push = () => {
    if (prePushItem) {
      const newStack = [
        { ...prePushItem, state: "push" } as StackItemType, // Cast after spreading
        ...stack
      ]

      setStack(newStack);
      setPrePushItem(null);
      history.push(newStack);
    } else {
      const newItem: StackItemType = {
        id: idCounter++,
        i: stack.length,
        start: stack.length,
        color: getRandomColor(),
        state: "push",
      };
      const newStack = [newItem, ...stopAllPrePop(stack)];
      setStack(newStack);
      history.push(newStack);
    }
  };

  const prePop = () => {
    if (!stack.length || stack[0].state !== "push") return;
    const next = [...stack];
    next[0] = { ...next[0], state: "prePop" } as StackItemType;
    setStack(next.map(item => sanitizeStackItem(item) as StackItemType));
    history.push(next);
  };

  const pop = () => {
    if (!stack.length || stack[0].state === "prePush") return;
    const next = [...stack];
    next.shift();
    setStack(next.map(item => sanitizeStackItem(item) as StackItemType));
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

  let disabledPrePush = !!prePushItem || topState === "prePop";
  let disabledPush = false;
  let disabledPrePop = topState !== "push";
  let disabledPop = !stack.length || topState === "prePush";
  let canGoBack = history.canGoBack;
  let canGoForward = history.canGoForward;

  if (prePushItem) {
    disabledPrePush = true;
    disabledPrePop = true;
    disabledPop = true;
    disabledPush = false;
  }

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

      {prePushItem && (
        <div
          style={{
            position: "absolute",
            top: stack.length * STACK_ITEM_HEIGHT - 5,
            left: "50%",
            transform: "translateX(-50%)",
            width: "288px",
            height: STACK_ITEM_HEIGHT,
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          <StackItem
            item={prePushItem}
            stopShaking={false}
            isFloatingPrePush
          />
        </div>
      )}
    </div>
  );
}
