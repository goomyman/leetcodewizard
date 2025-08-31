export const STACK_ITEM_HEIGHT = 20;

export type StackItemState = "prePush" | "push" | "prePop" | "pop";

export interface StackItemType {
  id: number;
  i: number;
  start: number;
  color: string;
  state: StackItemState;
}
