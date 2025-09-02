export interface ArrayItemType {
  id: number;
  value: string;
  color: string;
  state: ArrayItemState;
}

export enum ArrayItemState {
  Normal = "Normal",
  PreUpdate = "PreUpdate",
}

export const ARRAY_ITEM_SIZE = 60;
