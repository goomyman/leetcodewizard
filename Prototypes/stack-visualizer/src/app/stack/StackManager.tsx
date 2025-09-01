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
    state: StackItemState = StackItemState.Insert
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

  const preInsert = (index?: number) => {
    if (topState === StackItemState.PreRemove) return;
    insertItemAt(currentInput, index ?? 0, StackItemState.PreInsert);
  };

  const insert = (index?: number) => {
    if (topState === StackItemState.PreInsert || topState === StackItemState.PreRemove) {
      const newStack = [{ ...topItem, state: StackItemState.Insert }, ...stack.slice(1)];
      history.push(newStack);
    } else {
      insertItemAt(currentInput, index ?? 0, StackItemState.Insert);
    }
  };

  const preRemove = () => {
    if (!stack.length || topState !== StackItemState.Insert) return;
    const next = [{ ...topItem, state: StackItemState.PreRemove }, ...stack.slice(1)];
    history.push(next);
  };

  const remove = () => {
    if (!stack.length || topState === StackItemState.PreInsert) return;
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
  const disabledPrePush = topState === StackItemState.PreInsert || topState === StackItemState.PreRemove;
  const disabledPush = topState === StackItemState.PreRemove;
  const disabledPrePop = topState !== StackItemState.Insert;
  const disabledPop = !stack.length || topState === StackItemState.PreInsert;
  const canGoBack = history.canGoBack;
  const canGoForward = history.canGoForward;

  return (
    <div className="p-4 flex flex-col items-center gap-4 relative w-full max-w-md">
      <StackControl
        onPrePush={preInsert}
        onPush={insert}
        onPrePop={preRemove}
        onPop={remove}
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
