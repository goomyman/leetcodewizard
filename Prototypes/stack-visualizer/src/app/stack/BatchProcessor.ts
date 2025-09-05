import { ControlItem, ControlItemState } from "./ControlTypes";

export interface Batch<T extends ControlItem> {
  inserts?: { input: T; targetIndex: number }[];
  updates?: { input: T; targetIndex: number }[];
  deletes?: { targetIndex: number }[];
}

export class BatchProcessor<T extends ControlItem> {
  private snapshots: T[][] = [];

  constructor(initialItems: T[][] = []) {
    // Start with initial snapshot
    if (initialItems.length === 0) {
      this.snapshots.push([]);
    } else {
      this.snapshots = initialItems.map(s => [...s]);
    }
  }

  private get currentSnapshot(): T[] {
    return this.snapshots[this.snapshots.length - 1];
  }

  private cloneCurrent(): T[] {
    return this.currentSnapshot.map(item => ({ ...item }));
  }

  // Apply a batch (automatically finalizes pre-states first)
  applyBatch(batch: Batch<T>) {
    console.log("📦 Applying batch:", batch);

    // Clone current snapshot
    const snapshot = this.cloneCurrent();

    // Advance existing pre-states to final states
    snapshot.forEach(item => {
      if (item.state === ControlItemState.PreInsert || item.state === ControlItemState.PreUpdate) {
        item.state = ControlItemState.Inserted;
      } else if (item.state === ControlItemState.PreRemove) {
        item.state = ControlItemState.Removed;
      }
    });

    // --- Deletes ---
    batch.deletes?.forEach(d => {
      const idx = d.targetIndex;
      if (snapshot[idx]) snapshot[idx].state = ControlItemState.PreRemove;
    });

    // --- Updates ---
    batch.updates?.forEach(u => {
      const idx = u.targetIndex ?? 0;
      if (snapshot[idx]) snapshot[idx].state = ControlItemState.PreRemove;

      const newNode: T = {
        ...u.input,
        state: ControlItemState.PreUpdate,
        targetIndex: idx,
      };

      snapshot.splice(idx, 0, newNode);
    });

    // --- Inserts ---
    batch.inserts?.forEach(i => {
      const idx = i.targetIndex ?? 0;
      const newNode: T = {
        ...i.input,
        state: ControlItemState.PreInsert,
        targetIndex: idx,
      };
      snapshot.splice(idx, 0, newNode);
    });

    // Push new snapshot
    this.snapshots.push(snapshot);

    console.log("✅ Snapshot after batch applied:", snapshot);
  }

  // Get the history
  getHistory(): T[][] {
    return this.snapshots;
  }
}
