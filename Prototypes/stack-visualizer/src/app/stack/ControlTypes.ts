export enum StackItemState {
  Start = "Start",
  PreInsert = "PreInsert",
  Inserted = "Inserted",
  PreRemove = "PreRemove",
}

export interface StackItemType {
  id: number;
  text: string;
  level?: number | null;
  color?: string;
  state: StackItemState
}

// Array update
export interface ArrayUpdate {
  index: number;
  value: string;
}

// Stack control
export interface StackControl {
  id: string;
  type: "stack";
  items: StackItemType[];
}

// Array control
export interface ArrayControl {
  id: string;
  type: "array";
  size: number;
  updates: ArrayUpdate[];
}

// Union type for controls
export type Control = StackControl | ArrayControl;
