export const STACK_ITEM_HEIGHT = 20;
export const STACK_ITEM_WIDTH = 288;

export type StackItemState = "start" | "prePush" | "push" | "prePop" | "pop";

export interface StackItemType {
  id: number;
  text: string;
  color: string;
  state: StackItemState;
}
