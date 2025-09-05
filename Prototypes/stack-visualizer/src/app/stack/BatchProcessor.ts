import { ControlItem, ControlItemState } from "./ControlTypes";

export interface Batch<T extends ControlItem> {
  inserts?: { input: T; targetIndex: number }[];
  updates?: { input: T; targetIndex: number }[];
  deletes?: { targetIndex: number }[];
}

export class BatchProcessor<T extends ControlItem> {
  private snapshots: T[][] = [];

  constructor(initialItems: T[][] = []) {
    if (initialItems.length === 0) {
      this.snapshots.push([]);
    } else {
      this.snapshots = initialItems.map(s => s.map(item => ({ ...item })));
    }
  }

  private get currentSnapshot(): T[] {
    return this.snapshots[this.snapshots.length - 1];
  }

  private cloneCurrent(): T[] {
    // Deep clone to avoid mutations affecting previous snapshots
    return this.currentSnapshot.map(item => ({ ...item }));
  }

  applyBatch(batch: Batch<T>) {
    const snapshot = this.cloneCurrent();

    // Advance pre-states to final states
    snapshot.forEach(item => {
      if (item.state === ControlItemState.PreInsert || item.state === ControlItemState.PreUpdate) {
        item.state = ControlItemState.Inserted;
      } else if (item.state === ControlItemState.PreRemove) {
        item.state = ControlItemState.Removed;
      }
    });

    // --- Deletes ---
    batch.deletes?.forEach(d => {
      const node = snapshot.find(
        item => item.targetIndex === d.targetIndex &&
          item.state !== ControlItemState.PreUpdate &&
          item.state !== ControlItemState.PreRemove
      );
      if (node) node.state = ControlItemState.PreRemove;
    });

    // --- Updates ---
    batch.updates?.forEach(u => {
      // Mark original node for removal
      const nodeToRemove = snapshot.find(
        item => item.targetIndex === u.targetIndex &&
          item.state !== ControlItemState.PreUpdate &&
          item.state !== ControlItemState.PreRemove
      );
      if (nodeToRemove) nodeToRemove.state = ControlItemState.PreRemove;

      // Insert new PreUpdate node
      const newNode: T = { ...u.input, state: ControlItemState.PreUpdate, targetIndex: u.targetIndex };
      const insertPos = snapshot.findIndex(item => item.targetIndex >= u.targetIndex);
      if (insertPos >= 0) snapshot.splice(insertPos, 0, newNode);
      else snapshot.push(newNode);
    });

    // --- Inserts ---
    batch.inserts?.forEach(i => {
      const newNode: T = { ...i.input, state: ControlItemState.PreInsert, targetIndex: i.targetIndex };
      const insertPos = snapshot.findIndex(item => item.targetIndex >= i.targetIndex);
      if (insertPos >= 0) snapshot.splice(insertPos, 0, newNode);
      else snapshot.push(newNode);
    });

    // Push cloned snapshot
    this.snapshots.push(snapshot);
  }

  getHistory(): T[][] {
    const historyCopy = this.snapshots.map(snap => snap.map(item => ({ ...item })));
    console.log("📜 getHistory called, returning history length:", historyCopy.length);
    historyCopy.forEach((snap, idx) => {
      console.log(`  Step ${idx}:`, JSON.stringify(snap, null, 2));
    });
    return historyCopy;
  }
}
