import { ControlItemState } from "./ControlTypes";

export interface UploadBatch<T> {
  inserts?: { index: number; input: Omit<T, "id" | "state"> }[];
  deletes?: number[]; // indices to remove
  updates?: { index: number; input: Omit<T, "id" | "state"> }[];
}

export interface HistoryItem {
  id: string | number;
  state: ControlItemState;
  [key: string]: any;
  __index?: number; // temporary for ordering during batch processing
}

export class BatchProcessor<T extends HistoryItem> {
  private stagedPreInserts: T[] = [];
  private stagedPreRemoves: (string | number)[] = [];

  constructor(private history: T[][] = [[]]) {}

  getCurrent(): T[] {
    return this.history[this.history.length - 1];
  }

  public applyBatch(batch: UploadBatch<T>) {
    let current = [...this.getCurrent()];

    // 1️⃣ Commit previous PreRemove items
    if (this.stagedPreRemoves.length > 0) {
      current = current.filter(item => !this.stagedPreRemoves.includes(item.id));
    }

    // 2️⃣ Commit previous PreInsert / PreUpdate → Inserted
    current = current.map(item =>
      item.state === ControlItemState.PreInsert || item.state === ControlItemState.PreUpdate
        ? { ...item, state: ControlItemState.Inserted }
        : item
    );

    // 3️⃣ Apply deletes as PreRemove
    const deleteIndices: number[] = Array.from(
      new Set(batch.deletes?.filter(i => i >= 0 && i < current.length) ?? [])
    );
    current = current.map((item, idx) =>
      deleteIndices.includes(idx) ? { ...item, state: ControlItemState.PreRemove } : item
    );

    // 4️⃣ Apply inserts as PreInsert
    const insertItems: T[] =
      (batch.inserts ?? []).map(({ index, input }) => ({
        ...input,
        id: Date.now() + Math.random(),
        state: ControlItemState.PreInsert,
        __index: index, // store target index
      })) as T[];

    insertItems
      .sort((a, b) => (a.__index ?? 0) - (b.__index ?? 0))
      .forEach(item => {
        const idx = Math.min(item.__index ?? 0, current.length);
        current.splice(idx, 0, item);
      });

    // 5️⃣ Apply updates as PreUpdate
    const updateItems: T[] =
      (batch.updates ?? []).map(({ index, input }) => {
        if (index >= 0 && index < current.length) {
          // Flag the existing item as PreRemove for animation
          current[index] = { ...current[index], state: ControlItemState.PreRemove };
        }

        return {
          ...input,
          id: Date.now() + Math.random(),
          state: ControlItemState.PreUpdate,
          __index: index, // target index
        } as T;
      });

    updateItems
      .sort((a, b) => (a.__index ?? 0) - (b.__index ?? 0))
      .forEach(item => {
        const idx = Math.min(item.__index ?? 0, current.length);
        current.splice(idx, 0, item);
      });

    // 6️⃣ Sort by __index to keep Inserted items at correct positions
    current.sort((a, b) => (a.__index ?? 0) - (b.__index ?? 0));
    current.forEach(item => delete item.__index);

    // 7️⃣ Save new history step
    this.history.push(current);

    // 8️⃣ Stage for next batch
    this.stagedPreInserts = insertItems.concat(updateItems);
    this.stagedPreRemoves = current
      .filter(item => item.state === ControlItemState.PreRemove)
      .map(item => item.id);
  }

  public getHistory(): T[][] {
    return this.history;
  }
}
