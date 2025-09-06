import { ControlItem, ControlItemState } from "./ControlTypes";

export interface Batch<T extends ControlItem> {
  inserts?: { input: T; index: number }[];
  updates?: { input: T; id: string; index: number }[];
  deletes?: number[]; // visual indices
}

export class BatchProcessor<T extends ControlItem> {
  private snapshots: T[][] = [];

  constructor(initialItems: T[][] = []) {
    if (initialItems.length === 0) {
      this.snapshots.push([]);
    } else {
      // keep full T[], including targetIndex internally
      this.snapshots = initialItems.map(s => s.map(item => ({ ...item })));
    }
  }

  private get currentSnapshot(): T[] {
    return this.snapshots[this.snapshots.length - 1];
  }

  private cloneCurrent(): T[] {
    return this.currentSnapshot.map(item => ({ ...item }));
  }

  applyBatch(batch: Batch<T>) {
    const snapshot = this.cloneCurrent();

    // Advance PreInsert / PreUpdate → Inserted
    snapshot.forEach(item => {
      if (item.state === ControlItemState.PreInsert || item.state === ControlItemState.PreUpdate) {
        item.state = ControlItemState.Inserted;
      }
    });

    const visibleItems = snapshot.filter(item => item.state !== ControlItemState.Removed);

    // Deletes by visual index
    batch.deletes?.forEach(idx => {
      const itemToDelete = visibleItems[idx];
      if (itemToDelete) {
        const node = snapshot.find(item => item.id === itemToDelete.id);
        if (node && node.state !== ControlItemState.PreRemove) {
          node.state = ControlItemState.PreRemove;
        }
      }
    });

    // Updates
    batch.updates?.forEach(u => {
      const nodeToRemove = snapshot.find(item => item.id === u.id && item.state !== ControlItemState.PreRemove);
      if (nodeToRemove) nodeToRemove.state = ControlItemState.PreRemove;

      const insertPos = u.index <= visibleItems.length ? u.index : snapshot.length;
      snapshot.splice(insertPos, 0, { ...u.input, state: ControlItemState.PreUpdate });
    });

    // Inserts
    batch.inserts?.forEach(i => {
      const insertPos = i.index <= visibleItems.length ? i.index : snapshot.length;
      snapshot.splice(insertPos, 0, { ...i.input, state: ControlItemState.PreInsert });
    });

    this.snapshots.push(snapshot);
  }

  advanceRemovals() {
    const snapshot = this.cloneCurrent();
    snapshot.forEach(item => {
      if (item.state === ControlItemState.PreRemove) {
        item.state = ControlItemState.Removed;
      }
    });
    this.snapshots.push(snapshot);
  }

  getHistory(): T[][] {

    const historyCopy = this.snapshots.map(snap => snap.map(item => ({ ...item })));
    console.log("📜 getHistory called, returning history length:", historyCopy.length);
    historyCopy.forEach((snap, idx) => {
      console.log(`  Step ${idx}:`, JSON.stringify(snap, null, 2));
    });

    return this.snapshots.map(snap => snap.map(item => ({ ...item })));
  }

}
