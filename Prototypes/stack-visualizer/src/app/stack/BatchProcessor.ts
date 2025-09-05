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
    console.log("📦 Snapshot before applying:", JSON.stringify(snapshot, null, 2));

    // Advance pre-states to final states
    snapshot.forEach(item => {
      if (item.state === ControlItemState.PreInsert || item.state === ControlItemState.PreUpdate) {
        item.state = ControlItemState.Inserted;
      } else if (item.state === ControlItemState.PreRemove) {
        item.state = ControlItemState.Removed;
      }
    });

    // --- Deletes by targetIndex mapping to actual node ---
    batch.deletes?.forEach(d => {
      const node = snapshot.find(item => item.targetIndex === d.targetIndex && item.state !== ControlItemState.PreUpdate && item.state !== ControlItemState.PreRemove);
      if (node) node.state = ControlItemState.PreRemove;
    });

    // --- Updates ---
    batch.updates?.forEach(u => {
      // Mark original node for removal by targetIndex
      const nodeToRemove = snapshot.find(item => item.targetIndex === u.targetIndex && item.state !== ControlItemState.PreUpdate && item.state !== ControlItemState.PreRemove);
      if (nodeToRemove) nodeToRemove.state = ControlItemState.PreRemove;

      // Insert new PreUpdate node
      const newNode: T = {
        ...u.input,
        state: ControlItemState.PreUpdate,
        targetIndex: u.targetIndex,
      };

      // Find insert position based on targetIndex
      const insertPos = snapshot.findIndex(item => item.targetIndex >= u.targetIndex);
      if (insertPos >= 0) snapshot.splice(insertPos, 0, newNode);
      else snapshot.push(newNode);
    });

    // --- Inserts ---
    batch.inserts?.forEach(i => {
      const newNode: T = {
        ...i.input,
        state: ControlItemState.PreInsert,
        targetIndex: i.targetIndex,
      };

      const insertPos = snapshot.findIndex(item => item.targetIndex >= i.targetIndex);
      if (insertPos >= 0) snapshot.splice(insertPos, 0, newNode);
      else snapshot.push(newNode);
    });

    // Push new snapshot
    this.snapshots.push(snapshot);
    console.log("✅ Snapshot after batch applied:", JSON.stringify(snapshot, null, 2));
  }


  // Get the history
  getHistory(): T[][] {
    return this.snapshots;
  }
}
