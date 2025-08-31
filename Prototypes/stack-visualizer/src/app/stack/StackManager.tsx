"use client";

import React from "react";
import Stack from "./Stack";
import StackControl from "./StackControl";
import StackItem from "./StackItem";
import { useHistory } from "./useHistory";
import { StackItemType, STACK_ITEM_HEIGHT } from "./StackItemConstants";

let idCounter = 0;

export default function StackManager() {
  const [stack, setStack] = React.useState<StackItemType[]>([]);
  const [prePushItem, setPrePushItem] = React.useState<StackItemType | null>(null);
  const history = useHistory<StackItemType[]>(stack);

  const getRandomColor = () =>
    `hsl(${Math.floor(Math.random() * 360)}, 70%, 80%)`;

  // Stop all prePop except top
  const normalizePrePop = (arr: StackItemType[]) =>
    arr.map((item, index) =>
      item.state === "prePop" && index !== 0
        ? { ...item, state: "push" }
        : item
    );

  const stopAllPrePop = (prev: StackItemType[]) =>
    prev.map(it =>
      it.state === "prePop" ? { ...it, state: "push" } : it
    );

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
    history.push([...stack, newItem]); // optional history entry
  };

  const push = () => {
    if (prePushItem) {
      const newStack = [{ ...prePushItem, state: "push" }, ...stack];
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
    next[0] = { ...next[0], state: "prePop" };
    setStack(next);
    history.push(next);
  };

  const pop = () => {
    if (!stack.length || stack[0].state === "prePush") return;
    const next = [...stack];
    next.shift();
    setStack(next);
    history.push(next);
  };

  // Back / Forward restores stack immediately and normalizes prePop
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

  // Button enable/disable logic
  let disabledPrePush = !!prePushItem || topState === "prePop";
  let disabledPush = false;
  let disabledPrePop = topState !== "push";
  let disabledPop = !stack.length || topState === "prePush";
  let canGoBack = history.canGoBack;
  let canGoForward = history.canGoForward;

  // Strict prePush mode: only push/back enabled
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

      {/* Floating PrePush item just above stack */}
      {prePushItem && (
        <div
          style={{
            position: "absolute",
            top: -(STACK_ITEM_HEIGHT + 4), // 4px above top stack item
            left: 0,
            width: "100%",
            height: STACK_ITEM_HEIGHT,
          }}
        >
          <StackItem item={prePushItem} stopShaking={false} isFloatingPrePush />
        </div>
      )}
    </div>
  );
}
