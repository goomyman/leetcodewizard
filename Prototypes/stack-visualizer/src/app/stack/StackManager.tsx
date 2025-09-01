"use client";

import React from "react";
import Stack from "./Stack";
import StackControl from "./StackControl";
import SliderControl from "./SliderControl";
import { useHistory } from "./useHistory";
import { StackItemType, StackItemState, getRandomColor } from "./StackItemConstants";
import { createStackItem } from "./StackItemUtil";

let idCounter = 0;

export default function StackManager() {
  const history = useHistory<StackItemType[]>([]);

  const prePush = () => {
    const stack = history.current;
    if (stack[0]?.state === StackItemState.PrePop) return;
    const newItem: StackItemType = { id: idCounter++, state: StackItemState.PrePush as StackItemType["state"],  text: "abc", level: null, color: getRandomColor()};
    history.push([newItem, ...stack]);
  };

  const push = () => {
    const stack = history.current;
    let newStack: StackItemType[];
    if (stack[0]?.state === StackItemState.PrePush || stack[0]?.state === StackItemState.PrePop) {
      newStack = [{ ...stack[0], state: StackItemState.Push as StackItemType["state"] }, ...stack.slice(1)];
    } else {
      const newItem: StackItemType = { id: idCounter++, state: StackItemState.Push as StackItemType["state"], text: "abc", level: null, color: getRandomColor()};
      newStack = [newItem, ...stack];
    }
    history.push(newStack);
  };

  const prePop = () => {
    const stack = history.current;
    if (!stack.length || stack[0].state !== StackItemState.Push) return;
    const next = [{ ...stack[0], state: StackItemState.PrePop as StackItemType["state"] }, ...stack.slice(1)];
    history.push(next);
  };

  const pop = () => {
    const stack = history.current;
    if (!stack.length || stack[0].state === StackItemState.PrePush) return;
    history.push(stack.slice(1));
  };

  const back = () => {
    if (!history.canGoBack) return;
    const prevIndex = history.index - 1;
    if (prevIndex < 0) return;
    history.setIndex(prevIndex);
  };

  const forward = () => {
    if (!history.canGoForward) return;
    const nextIndex = history.index + 1;
    if (nextIndex >= history.history.length) return;
    history.setIndex(nextIndex);
  };

  const stack = history.current;
  const topState = stack[0]?.state;

  const disabledPrePush = topState === StackItemState.PrePush || topState === StackItemState.PrePop;
  const disabledPush = topState === StackItemState.PrePop;
  const disabledPrePop = topState !== StackItemState.Push;
  const disabledPop = !stack.length || topState === StackItemState.PrePush;
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
