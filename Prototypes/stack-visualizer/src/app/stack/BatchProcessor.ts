import { ControlItem, ControlItemState } from "./ControlTypes";

export type Batch<T extends ControlItem> = {
  inserts?: { input: T; targetIndex?: number }[];
  updates?: { input: T; targetIndex: number }[];
  deletes?: { targetIndex: number }[];
};

export class BatchProcessor<T extends ControlItem> {
  private history: T[][] = [];

  constructor(initial: T[][]) {
    this.history = initial.map(step => step.map(item => ({ ...item })));
  }

  getHistory() {
    return this.history;
  }

  /**
   * Apply a batch in a single snapshot.
   * PreInsert/PreUpdate/PreRemove nodes are created correctly with targetIndex,
   * old nodes are marked as PreRemove if updated/deleted.
   * Pre states are preserved for animation; no immediate conversion to Inserted/Removed.
   */
  applyBatch(batch: Batch<T>) {
    const last = this.history[this.history.length - 1] || [];
    const next: T[] = last.map(item => ({ ...item }));

    // --- Deletes / PreRemove ---
    batch.deletes?.forEach(({ targetIndex }) => {
      const oldNode = next[targetIndex];
      if (oldNode) {
        oldNode.state = ControlItemState.PreRemove;
        oldNode.targetIndex = targetIndex;
      }
    });

    // --- Updates / PreUpdate ---
    batch.updates?.forEach(({ input, targetIndex }) => {
      // Mark old node as PreRemove
      const oldNode = next[targetIndex];
      if (oldNode) {
        oldNode.state = ControlItemState.PreRemove;
        oldNode.targetIndex = targetIndex;
      }

      // Add new PreUpdate node at same targetIndex
      const preUpdateNode: T = {
        ...input,
        state: ControlItemState.PreUpdate,
        targetIndex,
      };
      next.push(preUpdateNode);
    });

    // --- Inserts / PreInsert ---
    batch.inserts?.forEach(({ input, targetIndex }) => {
      const preInsertNode: T = {
        ...input,
        state: ControlItemState.PreInsert,
        targetIndex,
      };
      next.push(preInsertNode);
    });

    this.history.push(next); // single snapshot
  }
}
