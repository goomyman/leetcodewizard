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

  const history = useHistory<StackItemType[]>([]);
  const stack = history.current;
  const topItem = stack[0];
  const topState = topItem?.state;

  /** Insert at arbitrary index */
  const insertItemAt = (
    input: StackItemInputDto,
    index: number,
    state: StackItemState = StackItemState.Push
  ) => {
    const newItem = createStackItem(input, idCounter++, state);
    const newStack = [...stack.slice(0, index), newItem, ...stack.slice(index)];
    history.push(newStack);
  };

  const [currentInput, setCurrentInput] = useState<StackItemInputDto>({
    text: "abcd",
    level: null,
    color: undefined
  });

  const prePush = (index?: number) => {
    if (topState === StackItemState.PrePop) return;
    insertItemAt(currentInput, index ?? 0, StackItemState.PrePush);
  };

  /** Push at top */
  const push = (index?: number) => {
    if (topState === StackItemState.PrePush || topState === StackItemState.PrePop) {
      const newStack = [{ ...topItem, state: StackItemState.Push }, ...stack.slice(1)];
      history.push(newStack);
    } else {
      insertItemAt(currentInput, index ?? 0, StackItemState.Push);
    }
  };

  /** PrePop top item */
  const prePop = () => {
    if (!stack.length || topState !== StackItemState.Push) return;
    const next = [{ ...topItem, state: StackItemState.PrePop }, ...stack.slice(1)];
    history.push(next);
  };

  /** Pop top item */
  const pop = () => {
    if (!stack.length || topState === StackItemState.PrePush) return;
    history.push(stack.slice(1));
  };

  /** History navigation */
  const back = () => {
    if (!history.canGoBack) return;
    history.setIndex(history.index - 1);
  };

  const forward = () => {
    if (!history.canGoForward) return;
    history.setIndex(history.index + 1);
  };

  /** Button states */
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
