// ControlTypes.ts

export enum ControlItemState {
  Start = "Start",
  PreInsert = "PreInsert",
  Inserted = "Inserted",
  PreRemove = "PreRemove",
  PreUpdate = "PreUpdate",
}

export enum ControlTypes {
  Stack = "stack",
  Array = "array",
}

export interface ControlItem {
  id: number;
  value?: any;
  level?: number | null;
  color?: string;
  state: ControlItemState;
}

export interface Batch<T> {
  inserts?: { index: number; input: Partial<T> }[];
  deletes?: number[];
  updates?: { index: number; input: Partial<T> }[];
}

export interface Control<T = ControlItem> {
  id: string;
  type: ControlTypes;
  items: T[];
  batch?: Batch<T>;
  color?: string;
  size?: number;
  gridPosition?: { col: number; row: number; colSpan?: number; rowSpan?: number };
}

export type AnyControl = Control<ControlItem>;
