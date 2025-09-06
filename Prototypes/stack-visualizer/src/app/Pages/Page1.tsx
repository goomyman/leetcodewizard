import { Control, ControlType, ControlItem, ControlItemState } from "../stack/ControlTypes";

export const Page1Layout = {
  pageId: "home",
  controls: [
    {
      id: "array1",
      type: ControlType.Array,
      items: [
        { id: "array1-item0", level: null, value: 10, color: "blue", state: ControlItemState.Inserted},
        { id: "array1-item1", level: null, value: 20, color: "orange", state: ControlItemState.Inserted},
      ],
    } as Control<ControlItem>,
    {
      id: "stack1",
      type: ControlType.Stack,
      items: [
        { id: "stack1-item0", level: null, value: 10, color: "blue", state: ControlItemState.Inserted},
        { id: "stack1-item1", level: null, value: 20, color: "orange", state: ControlItemState.Inserted},
      ],
    } as Control<ControlItem>
    
  ],
};
