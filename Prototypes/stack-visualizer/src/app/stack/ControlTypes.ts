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

export interface HistoryItem {
  id: string;
  value?: any;
  text?: string;
  level?: number;
  color?: string;
  state: ControlItemState;
}

export interface Batch<T> {
  inserts?: { index: number; input: Partial<T> }[];
  deletes?: number[];
  updates?: { index: number; input: Partial<T> }[];
}

// Generic control
export interface Control<T> {
  id: string;
  type: ControlTypes;
  items: T[];
  batch?: Batch<T>;
  color?: string;
  size?: number;
}

// Stack-specific item
export interface StackItemType {
  id: number;
  text: string;
  level?: number | null;
  color?: string;
  state: ControlItemState;
}

// Array-specific item
export interface ArrayItemType {
  id: number;
  value: string | number | null;
  color?: string;
  state: ControlItemState;
}

// StackControl & ArrayControl are just Control with proper item type
export type StackControl = Control<StackItemType>;
export type ArrayControl = Control<ArrayItemType>;

// Union type
export type AnyControl = StackControl | ArrayControl;
