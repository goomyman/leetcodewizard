// ControlTypes.ts

export const getRandomColor = () => `hsl(${Math.floor(Math.random() * 360)}, 70%, 80%)`;

export enum ControlItemState {
  PreInsert = "PreInsert",
  Inserted = "Inserted",
  PreRemove = "PreRemove",
  PreUpdate = "PreUpdate",
  Removed = "Removed"
}

export enum ControlType {
  Stack = "stack",
  Array = "array",
}

export interface ControlItem {
  id: string;
  value?: any;
  level?: number | null;
  color?: string;
  state: ControlItemState;
  _isRemoved?: boolean;
}

export interface Batch<T> {
  inserts?: { index: number; input: Partial<T> }[];
  deletes?: { index: number; input: Partial<T> }[];
  updates?: { index: number; input: Partial<T> }[];
}

export interface Control<T = ControlItem> {
  id: string;
  type: ControlType;
  items: T[];
  batch?: Batch<T>;
  color?: string;
  size?: number;
}

export type AnyControl = Control<ControlItem>;
