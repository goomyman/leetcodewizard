import { useState } from "react";

export function useHistory<T>(initial: T) {
  const [history, setHistory] = useState<T[]>([initial]);
  const [index, setIndex] = useState(0);

  const current = history[index] ?? initial;

  const push = (state: T) => {
    const newHistory = history.slice(0, index + 1);
    newHistory.push(state);
    setHistory(newHistory);
    setIndex(newHistory.length - 1);
  };

  const back = () => {
    if (index > 0) setIndex(index - 1);
  };

  const forward = () => {
    if (index < history.length - 1) setIndex(index + 1);
  };

  return {
    current,
    push,
    back,
    forward,
    setIndex, // <-- add this
    canGoBack: index > 0,
    canGoForward: index < history.length - 1,
    history,
    index,
  };
}
