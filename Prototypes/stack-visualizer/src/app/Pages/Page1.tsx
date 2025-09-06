import { Control, ControlType, ControlItem, ControlItemState } from "../stack/ControlTypes";

export const Page1Layout = {
  pageId: "home",
  controls: [
    {
      id: "array1",
      type: ControlType.Array,
      items: [
        { level: null, value: 10, color: "blue", state: ControlItemState.Inserted},
        { level: null, value: 20, color: "orange", state: ControlItemState.Inserted},
      ],
    } as Control<ControlItem>,
    {
      id: "stack1",
      type: ControlType.Stack,
      items: [
        { level: null, value: 10, color: "blue", state: ControlItemState.Inserted},
        { level: null, value: 20, color: "orange", state: ControlItemState.Inserted},
      ],
    } as Control<ControlItem>
    
  ],
};
