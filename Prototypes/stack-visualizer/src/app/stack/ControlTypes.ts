export enum ControlItemState {
  Start = "Start",
  PreInsert = "PreInsert",
  Inserted = "Inserted",
  PreRemove = "PreRemove",
  PreUpdate = "PreUpdate"
}

export enum ControlTypes
{
    Stack = "stack",
    Array = "array",
}

export interface StackItemType {
  id: number;
  text: string;
  level?: number | null;
  color?: string;
  state: ControlItemState
}

// Array update
export interface ArrayUpdate {
  index: number;
  value: string;
}

// Stack control
export interface StackControl {
  id: string;
  type: ControlTypes.Stack;
  items: StackItemType[];
}

// Array control
export interface ArrayControl {
  id: string;
  type: ControlTypes.Array;
  size: number;
  updates: ArrayUpdate[];
}

// Union type for controls
export type Control = StackControl | ArrayControl;
