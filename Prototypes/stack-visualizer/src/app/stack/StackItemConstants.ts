export const STACK_ITEM_HEIGHT = 20; // px

export type StackState = "prePush" | "push" | "prePop" | "pop" | "normal";

export interface StackItemType {
  id: number;
  path: string;
  color: string;
  state: StackState;
  i?: number;
  start?: number;
}
