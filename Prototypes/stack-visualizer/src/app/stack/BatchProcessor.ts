import { ControlItemState } from "./ControlTypes";

export interface UploadBatch<T> {
  inserts?: { index: number; input: Omit<T, "id" | "state" | "targetIndex"> }[];
  deletes?: number[];
  updates?: { index: number; input: Omit<T, "id" | "state" | "targetIndex"> }[];
}

export interface HistoryItem {
  id: string | number;
  state: ControlItemState;
  targetIndex?: number; // for floating items
  [key: string]: any;
}

export class BatchProcessor<T extends HistoryItem> {
  private stagedPreRemoves: (string | number)[] = [];

  constructor(private history: T[][] = [[]]) {}

  getCurrent(): T[] {
    return this.history[this.history.length - 1];
  }

  public applyBatch(batch: UploadBatch<T>) {
    let current = [...this.getCurrent()];

    // 1️⃣ Commit previous PreUpdate → Inserted
    current = current.map(item =>
      item.state === ControlItemState.PreUpdate
        ? { ...item, state: ControlItemState.Inserted, targetIndex: undefined }
        : item
    );

    // 2️⃣ Commit previous PreRemove → Removed (they will animate falling)
    current = current.map(item =>
      item.state === ControlItemState.PreRemove
        ? { ...item, state: ControlItemState.Removed }
        : item
    );

    // 3️⃣ Apply deletes as PreRemove
    const deleteIndices = Array.from(
      new Set(batch.deletes?.filter(i => i >= 0 && i < current.length) ?? [])
    );

    current = current.map((item, idx) =>
      deleteIndices.includes(idx)
        ? { ...item, state: ControlItemState.PreRemove, targetIndex: idx }
        : item
    );

    // 4️⃣ Apply inserts as PreUpdate
    (batch.inserts ?? []).forEach(({ index, input }) => {
      const newItem: T = {
        ...input,
        id: Date.now() + Math.random(),
        state: ControlItemState.PreUpdate,
        targetIndex: index,
      } as T;
      current.splice(index, 0, newItem);
    });

    // 5️⃣ Apply updates
    (batch.updates ?? []).forEach(({ index, input }) => {
      if (index >= 0 && index < current.length) {
        // Mark existing item to be removed
        current[index] = {
          ...current[index],
          state: ControlItemState.PreRemove,
          targetIndex: index,
        };
      }

      // Add new PreUpdate item above
      const updatedItem: T = {
        ...input,
        id: Date.now() + Math.random(),
        state: ControlItemState.PreUpdate,
        targetIndex: index,
      } as T;

      current.splice(index, 0, updatedItem);
    });

    // 6️⃣ Save to history
    this.history.push(current);

    // 7️⃣ Stage PreRemove items for next batch
    this.stagedPreRemoves = current
      .filter(item => item.state === ControlItemState.PreRemove)
      .map(item => item.id);
  }

  public getHistory(): T[][] {
    return this.history;
  }
}
