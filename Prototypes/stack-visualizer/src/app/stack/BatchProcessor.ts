import { ControlItemState } from "./ControlTypes";

export interface UploadBatch<T> {
  inserts?: { index: number; input: Omit<T, "id" | "state" | "targetIndex"> }[];
  deletes?: number[];
  updates?: { index: number; input: Omit<T, "id" | "state" | "targetIndex"> }[];
}

export interface HistoryItem {
  id: string | number;
  state: ControlItemState;
  targetIndex?: number; // used for floating items and falling items
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

    // 1️⃣ Remove previously Removed items
    if (this.stagedPreRemoves.length > 0) {
      current = current.filter(item => !this.stagedPreRemoves.includes(item.id));
    }

    // 2️⃣ Commit previous PreInsert / PreUpdate → Inserted
    current = current.map(item =>
      item.state === ControlItemState.PreInsert || item.state === ControlItemState.PreUpdate
        ? { ...item, state: ControlItemState.Inserted, targetIndex: undefined }
        : item
    );

    // 3️⃣ Apply deletes → mark as PreRemove, set targetIndex for animation
    const deleteIndices: number[] = Array.from(
      new Set(batch.deletes?.filter(i => i >= 0 && i < current.length) ?? [])
    );

    current = current.map((item, idx) =>
      deleteIndices.includes(idx) && item.state !== ControlItemState.PreRemove
        ? { ...item, state: ControlItemState.PreRemove, targetIndex: idx }
        : item
    );

    // 4️⃣ Apply inserts → mark as PreInsert, floating above index
    const insertItems: T[] =
      (batch.inserts ?? []).map(({ index, input }) => ({
        ...input,
        id: Date.now() + Math.random(),
        state: ControlItemState.PreInsert,
        targetIndex: index,
      })) as T[];

    insertItems.forEach(item => {
      const idx = Math.min(item.targetIndex ?? 0, current.length);
      current.splice(idx, 0, item);
    });

    // 5️⃣ Apply updates → old item PreRemove, new item PreUpdate floating above
    const updateItems: T[] =
      (batch.updates ?? []).map(({ index, input }) => {
        if (index >= 0 && index < current.length) {
          const oldItem = current[index];
          // Mark existing as PreRemove
          current[index] = { ...oldItem, state: ControlItemState.PreRemove, targetIndex: index };
        }

        return {
          ...input,
          id: Date.now() + Math.random(),
          state: ControlItemState.PreUpdate,
          targetIndex: index,
        } as T;
      });

    updateItems.forEach(item => {
      const idx = Math.min(item.targetIndex ?? 0, current.length);
      current.splice(idx, 0, item);
    });

    // 6️⃣ Save history
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
