export const STACK_ITEM_HEIGHT = 20;
export const STACK_ITEM_WIDTH = 288;

export const getRandomColor = () => `hsl(${Math.floor(Math.random() * 360)}, 70%, 80%)`;

// StackItemConstants.ts
export enum StackItemState {
  Start = "Start",
  PrePush = "PrePush",
  Push = "Push",
  PrePop = "PrePop",
  Pop = "Pop",
}

export interface StackItemType {
  id: number
  state: StackItemState
  color: string
  text: string
  level?: number | null
}

export interface StackItemInputDto {
  text: string
  level?: number | null
  color?: string
}