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

  const [stagedPreInserts, setStagedPreInserts] = useState<StackItemType[]>([]);
  const [stagedPreRemoves, setStagedPreRemoves] = useState<number[]>([]);

  /** Helper to create a StackItem */
  const makeStackItem = (input: StackItemInputDto, state: StackItemState): StackItemType => ({
    id: idCounter++,
    text: input.text,
    level: input.level,
    color: input.color ?? getRandomColor(),
    state,
  });

  const hasItems = stack.length > 0;
  const hasStagedPreInserts = stagedPreInserts.length > 0;
  const hasStagedPreRemoves = stagedPreRemoves.length > 0;

  /** Button states */
  const disabledPreInsert = hasStagedPreRemoves;
  const disabledCompletePreInsert = !hasStagedPreInserts || !hasItems;
  const disabledInsert = hasStagedPreInserts || hasStagedPreRemoves;
  const disabledPreRemove = !hasItems || hasStagedPreInserts;
  const disabledCompletePreRemove = !hasStagedPreRemoves || !hasItems;
  const disabledRemove = hasStagedPreInserts || hasStagedPreRemoves || !hasItems;

  const canGoBack = history.canGoBack;
  const canGoForward = history.canGoForward;

  /** PreInsert batch: stage items at given indices */
  const preInsertBatch = (items: { index: number; input: StackItemInputDto }[]) => {
    if (disabledPreInsert || items.length === 0) return;

    const newItems = items.map(({ index, input }) => {
      const item = makeStackItem(input, StackItemState.PreInsert);
      return { ...item, __index: index }; // temporary property to track intended index
    });

    // Insert items into stack at intended positions
    let newStack = [...stack];
    newItems
      .sort((a, b) => b.__index - a.__index) // descending to not break indices
      .forEach(item => {
        const idx = Math.min(item.__index, newStack.length);
        newStack.splice(idx, 0, item);
        if ("__index" in item) {
          // optional fix
          delete (item as any).__index;
        }
      });

    history.push(newStack);
    setStagedPreInserts([...stagedPreInserts, ...newItems]);
  };

  /** Complete staged PreInserts: commit by changing state → Insert */
  const completePreInsert = () => {
    if (disabledCompletePreInsert) return;

    const newStack = stack.map(item =>
      item.state === StackItemState.PreInsert ? { ...item, state: StackItemState.Insert } : item
    );

    history.push(newStack);
    setStagedPreInserts([]);
  };

  /** Direct Insert batch with indices */
  const insertBatch = (items: { index: number; input: StackItemInputDto }[]) => {
    if (disabledInsert || items.length === 0) return;

    const newItems = items.map(({ input }) => makeStackItem(input, StackItemState.Insert));

    let newStack = [...stack];
    items
      .map((it, i) => ({ ...it, item: newItems[i] }))
      .sort((a, b) => b.index - a.index)
      .forEach(({ index, item }) => {
        const idx = Math.min(index, newStack.length);
        newStack.splice(idx, 0, item);
      });

    history.push(newStack);
  };

  /** PreRemove batch: stage removal of multiple indices */
  const preRemoveBatch = (indices: number[]) => {
    if (disabledPreRemove || indices.length === 0) return;

    const uniqueIndices = Array.from(new Set(indices.filter(idx => idx >= 0 && idx < stack.length)));
    const newStack = stack.map((item, i) =>
      uniqueIndices.includes(i) ? { ...item, state: StackItemState.PreRemove } : item
    );

    history.push(newStack);
    setStagedPreRemoves([...stagedPreRemoves, ...uniqueIndices]);
  };

  /** Complete staged PreRemoves */
  const completePreRemove = () => {
    if (disabledCompletePreRemove) return;

    const sortedIndices = [...stagedPreRemoves].sort((a, b) => b - a);
    const newStack = [...stack];
    sortedIndices.forEach(idx => newStack.splice(idx, 1));

    history.push(newStack);
    setStagedPreRemoves([]);
  };

  /** Direct remove: batch by indices or remove top */
  const remove = (indices?: number[]) => {
    if (disabledRemove) return;

    if (stagedPreInserts.length > 0 || stagedPreRemoves.length > 0) return;

    let newStack = [...stack];

    if (indices && indices.length > 0) {
      [...indices].sort((a, b) => b - a).forEach(idx => {
        if (idx >= 0 && idx < newStack.length) newStack.splice(idx, 1);
      });
    } else {
      newStack.shift();
    }

    history.push(newStack);
  };

  /** History navigation */
  const back = () => {
    if (canGoBack) history.setIndex(history.index - 1);
  };
  const forward = () => {
    if (canGoForward) history.setIndex(history.index + 1);
  };

  return (
    <div className="p-4 flex flex-col items-center gap-4 relative w-full min-w-[900px]">
      <StackControl
        onPreInsert={preInsertBatch}
        onCompletePreInsert={completePreInsert}
        onInsert={insertBatch}
        onPreRemove={preRemoveBatch}
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
