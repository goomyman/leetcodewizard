export const STACK_ITEM_HEIGHT = 20;

export interface StackItemType {
  i: number;
  start: number;
  color: string;
  state?: "halfPush" | "fullPush" | "halfPop";
}
