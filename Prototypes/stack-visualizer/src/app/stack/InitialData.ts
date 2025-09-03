import { Control, ControlItemState, ControlTypes } from "./ControlTypes";

export const initialControls: { controls: Control[] } = {
  controls: [
    {
      id: "stack1",
      type: ControlTypes.Stack,
      items: [], // start empty
      batch: {
        inserts: [
          { index: 0, input: { value: "A", state: ControlItemState.Start } },
          { index: 1, input: { value: "B", state: ControlItemState.Start } }
        ],
        deletes: []
      }
    },
    {
      id: "array1",
      type: ControlTypes.Array,
      size: 5,
      items: [], // start empty
      batch: {
        updates: [
          { index: 0, input: { value: "X", state: ControlItemState.Start } },
          { index: 3, input: { value: "Y", state: ControlItemState.Start } }
        ]
      }
    }
  ]
};
