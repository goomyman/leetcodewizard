// InitialData.ts (optional)
import { Control, ControlTypes, StackItemState } from "./ControlTypes";

export const initialControls: { controls: Control[] } = {
  controls: [
    {
      id: "stack1",
      type: ControlTypes.Stack,
      items: [
        { id: 1, text: "A", state: StackItemState.Start, color: "#f87171" },
        { id: 2, text: "B", state: StackItemState.Start, color: "#4ade80" }
      ]
    },
    {
      id: "array1",
      type: ControlTypes.Array,
      size: 5,
      updates: [
        { index: 0, value: "X" },
        { index: 2, value: "Y" }
      ]
    }
  ]
};
