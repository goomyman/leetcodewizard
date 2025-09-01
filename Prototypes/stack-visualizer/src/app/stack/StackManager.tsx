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
    insertItemAt(currentInput, index ?? 0, StackItemState.Insert);
  };

  const preRemove = (index?: number) => {
    if (!stack.length || topState !== StackItemState.Insert) return;
    const next = [{ ...topItem, state: StackItemState.PreRemove }, ...stack.slice(1)];
    history.push(next);
  };

  const remove = (index?: number)  => {
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
  const disabledPreInsert = topState === StackItemState.PreInsert || topState === StackItemState.PreRemove;
  const disabledInsert = topState === StackItemState.PreRemove;
  const disabledPreRemove = topState !== StackItemState.Insert;
  const disabledRemove = !stack.length || topState === StackItemState.PreInsert;
  const canGoBack = history.canGoBack;
  const canGoForward = history.canGoForward;

  return (
    <div className="p-4 flex flex-col items-center gap-4 relative w-full max-w-md">
      <StackControl
        onPreInsert={preInsert}
        onInsert={insert}
        onPreRemove={preRemove}
        onRemove={remove}
        onBack={back}
        onForward={forward}
        disabledPreInsert={disabledPreInsert}
        disabledInsert={disabledInsert}
        disabledPreRemove={disabledPreRemove}
        disabledRemove={disabledRemove}
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
