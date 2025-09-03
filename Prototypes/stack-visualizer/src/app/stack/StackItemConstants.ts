export const STACK_ITEM_HEIGHT = 20;
export const STACK_ITEM_WIDTH = 288;

export interface StackItemInputDto {
  text: string;
  level?: number | null;
  color?: string;
}