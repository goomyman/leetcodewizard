import { Control, ControlTypes } from "./ControlTypes";

export const initialControls: { controls: Control[] } = {
  controls: [
    {
      id: "array1",
      type: ControlTypes.Array,
      size: 5,
      items: [], // start empty
      batch: {},
      gridPosition: { col: 1, row: 1, colSpan: 3, rowSpan: 1 } // full width top
    },
    {
      id: "stack1",
      type: ControlTypes.Stack,
      items: [], // start empty
      batch: {},
      gridPosition: { col: 1, row: 2, colSpan: 3, rowSpan: 1 } // full width bottom
    }
  ]
};
