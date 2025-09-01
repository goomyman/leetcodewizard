"use client";

import React, { useState } from "react";
import Stack from "./Stack";
import StackControl from "./StackControl";
import SliderControl from "./SliderControl";
import { useHistory } from "./useHistory";
import { StackItemType, StackItemState, getRandomColor, StackItemInputDto } from "./StackItemConstants";
import { createStackItem } from "./StackItemUtil";

let idCounter = 0;

export default function StackManager() {

  const [currentInput, setCurrentInput] = useState<StackItemInputDto>({
    text: "abcd",
    level: null,
    color: undefined
  });

  const history = useHistory<StackItemType[]>([]);

  const stack = history.current;
  const topItem = stack[0];
  const topState = topItem?.state;

  const prePush = () => {
    const stack = history.current;
    if (topState === StackItemState.PrePop) return;
    const newItem = createStackItem(currentInput, idCounter++, StackItemState.PrePush);
    history.push([newItem, ...stack]);
  };

  const push = () => {
    const stack = history.current;
    let newStack: StackItemType[];
    if (topState === StackItemState.PrePush || topState === StackItemState.PrePop) {
      newStack = [{ ...topItem, state: StackItemState.Push }, ...stack.slice(1)];
    } else {
      const newItem = createStackItem(currentInput, idCounter++, StackItemState.Push);
      newStack = [newItem, ...stack];
    }
    history.push(newStack);
  };

  const prePop = () => {

    if (!stack.length || topState !== StackItemState.Push) return;
    const next = [{ ...topItem, state: StackItemState.PrePop }, ...stack.slice(1)];
    history.push(next);
  };

  const pop = () => {
    const stack = history.current;
    if (!stack.length || topState === StackItemState.PrePush) return;
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
