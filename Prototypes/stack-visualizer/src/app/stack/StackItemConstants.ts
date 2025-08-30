// stack/StackItemConstants.ts
export const STACK_ITEM_HEIGHT = 20;

export type StackItemType = {
  id: number;
  color: string;
  state?: "halfPush" | "fullPush" | "halfPop";
};
