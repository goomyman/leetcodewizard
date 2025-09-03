import { Control, ControlType, ControlItem, ControlItemState } from "../stack/ControlTypes";

export const Page1Layout = {
  pageId: "home",
  controls: [
    {
      id: "stack1",
      type: ControlType.Stack,
      items: [
        { id: "stack1-item1", level: null, value: 10, color: "blue", state: ControlItemState.Inserted },
        { id: "stack1-item2", level: null, value: 20, color: "orange", state: ControlItemState.Inserted },
      ],
    } as Control<ControlItem>
  ],
};
