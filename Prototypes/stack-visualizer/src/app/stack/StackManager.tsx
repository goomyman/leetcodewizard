"use client";

import React, { useState } from "react";
import Stack from "./Stack";
import StackControl from "./StackControl";
import SliderControl from "./SliderControl";
import { useHistory } from "./useHistory";
import { StackItemType, StackItemState, StackItemInputDto, getRandomColor } from "./StackItemConstants";

let idCounter = 0;

export default function StackManager() {
  const history = useHistory<StackItemType[]>([]);
  const stack = history.current;

  const [currentInput, setCurrentInput] = useState<StackItemInputDto>({
    text: "abcd",
    level: null,
    color: undefined,
  });

  const [stagedPreInserts, setStagedPreInserts] = useState<{ index: number; text: string }[]>([]);
  const [stagedPreRemoves, setStagedPreRemoves] = useState<number[]>([]);

  /** Helper to create a StackItem */
  const makeStackItem = (
    input: StackItemInputDto,
    state: StackItemState,
    id: number,
    text?: string
  ): StackItemType => ({
    id,
    text: text ?? input.text,
    level: input.level,
    color: input.color ?? getRandomColor(),
    state,
  });

  const hasItems = stack.length > 0;
  const hasStagedPreInserts = stagedPreInserts.length > 0;
  const hasStagedPreRemoves = stagedPreRemoves.length > 0;

  /** states */
  const disabledPreInsert = hasStagedPreRemoves;
  const disabledCompletePreInsert = !hasStagedPreInserts || !hasItems;
  const disabledInsert = stagedPreInserts.length > 0 || stagedPreRemoves.length > 0;
  const disabledPreRemove = !hasItems || hasStagedPreInserts;
  const disabledCompletePreRemove = !hasStagedPreRemoves || !hasItems;
  const disabledRemove = stagedPreInserts.length > 0 || stagedPreRemoves.length > 0 || !hasItems;

  const canGoBack = history.canGoBack;
  const canGoForward = history.canGoForward;

  /** PreInsert: stage an insert with PreInsert state */
  const preInsert = (index?: number, text?: string) => {
    if (disabledPreInsert) return;
    if (index === undefined || text == null) throw new Error("Index and text required");

    const newItem = makeStackItem(currentInput, StackItemState.PreInsert, idCounter++, text);
    const newStack = [...stack.slice(0, index), newItem, ...stack.slice(index)];
    history.push(newStack);

    setStagedPreInserts([...stagedPreInserts, { index, text }]);
  };

  /** Complete staged PreInserts: commit by changing state → Insert */
  const completePreInsert = () => {
    if (disabledCompletePreInsert) return;
    let newStack = stack.map(item =>
      item.state === StackItemState.PreInsert ? { ...item, state: StackItemState.Insert } : item
    );
    history.push(newStack);
    setStagedPreInserts([]);
  };

  const insert = (index?: number, text?: string) => {
    if (disabledInsert) return;
    const idx = index ?? 0;
    const newItem = makeStackItem(currentInput, StackItemState.Insert, idCounter++, text);
    const newStack = [...stack.slice(0, idx), newItem, ...stack.slice(idx)];
    history.push(newStack);
  };

  /** PreRemove: stage removal by setting state → PreRemove */
  const preRemove = (index?: number) => {
    if (disabledRemove) return;
    if (index === undefined) throw new Error("Index required");

    if (!stagedPreRemoves.includes(index)) setStagedPreRemoves([...stagedPreRemoves, index]);

    const newStack = stack.map((item, i) =>
      i === index ? { ...item, state: StackItemState.PreRemove } : item
    );
    history.push(newStack);
  };

  /** Complete staged PreRemoves: remove items from stack */
  const completePreRemove = () => {
    if (disabledPreRemove) return;
    const sortedIndices = [...stagedPreRemoves].sort((a, b) => b - a);
    let newStack = [...stack];
    sortedIndices.forEach(idx => {
      if (idx >= 0 && idx < newStack.length) newStack.splice(idx, 1);
    });
    history.push(newStack);
    setStagedPreRemoves([]);
  };

  const remove = () => {
    if (disabledRemove) return;
    if (stagedPreInserts.length > 0 || stagedPreRemoves.length > 0) return;

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

  return (
    <div className="p-4 flex flex-col items-center gap-4 relative w-full min-w-[900px]">
      <StackControl
        onPreInsert={preInsert}
        onCompletePreInsert={completePreInsert}
        onInsert={insert}
        onPreRemove={preRemove}
        onCompletePreRemove={completePreRemove}
        onRemove={remove}
        onBack={back}
        onForward={forward}
        disabledPreInsert={disabledPreInsert}
        disabledCompletePreInsert={disabledCompletePreInsert}
        disabledInsert={disabledInsert}
        disabledPreRemove={disabledPreRemove}
        disabledCompletePreRemove={disabledCompletePreRemove}
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
