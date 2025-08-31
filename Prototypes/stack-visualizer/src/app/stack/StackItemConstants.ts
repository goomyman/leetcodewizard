export const STACK_ITEM_HEIGHT = 20;
export const STACK_ITEM_WIDTH = 288;

export type StackItemState = "start" | "prePush" | "push" | "prePop" | "pop" | "popping";

export interface StackItemType {
  id: number;
  i: number;
  start: number;
  color: string;
  state: StackItemState;
}
