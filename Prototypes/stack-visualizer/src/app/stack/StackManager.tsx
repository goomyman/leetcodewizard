import React, { useState } from "react";
import StackControl from "./StackControl";
import { useHistory } from "./useHistory";

type StackItem = {
  id: number;
  state: "prePush" | "push" | "prePop" | "pop";
};

let idCounter = 0;

const StackManager: React.FC = () => {
  const [stack, setStack] = useState<StackItem[]>([]);
  const history = useHistory<StackItem[]>(stack);

  const topItem = history.current[history.current.length - 1];

  const addStateToHistory = (newStack: StackItem[]) => {
    setStack(newStack);
    history.push(newStack);
  };

  const handlePrePush = () => {
    const newItem: StackItem = { id: idCounter++, state: "prePush" };
    addStateToHistory([...stack, newItem]);
  };

  const handlePush = () => {
    if (!stack.length) {
      // create directly in push state
      const newItem: StackItem = { id: idCounter++, state: "push" };
      addStateToHistory([...stack, newItem]);
    } else {
      const updated = [...stack];
      const top = { ...updated[updated.length - 1] };
      if (top.state === "prePush") {
        top.state = "push";
        updated[updated.length - 1] = top;
      } else {
        updated.push({ id: idCounter++, state: "push" });
      }
      addStateToHistory(updated);
    }
  };

  const handlePrePop = () => {
    if (!stack.length) return;
    const updated = [...stack];
    const top = { ...updated[updated.length - 1] };
    if (top.state === "push") {
      top.state = "prePop";
      updated[updated.length - 1] = top;
      addStateToHistory(updated);
    }
  };

  const handlePop = () => {
    if (!stack.length) return;
    const updated = [...stack];
    updated.pop();
    addStateToHistory(updated);
  };

  return (
    <div className="p-4">
      <div className="flex flex-col items-center gap-2">
        {history.current.map((item) => (
          <div
            key={item.id}
            className={`w-32 h-12 flex items-center justify-center rounded shadow ${
              item.state === "prePush"
                ? "bg-blue-200"
                : item.state === "push"
                ? "bg-green-300"
                : item.state === "prePop"
                ? "bg-red-300 animate-pulse"
                : "bg-gray-200"
            }`}
          >
            {item.state} (i{item.id})
          </div>
        ))}
      </div>

      <StackControl
        onPrePush={handlePrePush}
        onPush={handlePush}
        onPrePop={handlePrePop}
        onPop={handlePop}
        onBack={history.back}
        onForward={history.forward}
        topState={topItem?.state}
        canGoBack={history.canGoBack}
        canGoForward={history.canGoForward}
      />
    </div>
  );
};

export default StackManager;
