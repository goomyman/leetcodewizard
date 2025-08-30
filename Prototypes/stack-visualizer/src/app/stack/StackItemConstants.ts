// Height constant for all stack items
export const STACK_ITEM_HEIGHT = 20;

// Type for a stack item
export interface StackItemType {
  id: number;
  path?: string;
  color?: string;
  state?: "halfPush" | "fullPush" | "halfPop";
}
