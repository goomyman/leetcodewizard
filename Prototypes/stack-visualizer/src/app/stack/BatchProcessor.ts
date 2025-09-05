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
   * Apply a batch in a single snapshot
   * - PreInsert / PreUpdate / PreRemove nodes are added at the correct targetIndex
   * - Old nodes are marked PreRemove if updated/deleted
   * - Pre states are preserved for animation
   */
  applyBatch(batch: Batch<T>) {
    // Clone last snapshot
    const last = this.history[this.history.length - 1] || [];
    const next: T[] = last.map(item => ({ ...item }));

    // --- Deletes ---
    batch.deletes?.forEach(({ targetIndex }) => {
      const oldNode = next[targetIndex];
      if (oldNode && oldNode.state !== ControlItemState.Removed) {
        oldNode.state = ControlItemState.PreRemove;
        oldNode.targetIndex = targetIndex;
      }
    });

    // --- Updates ---
    batch.updates?.forEach(({ input, targetIndex }) => {
      const oldNode = next[targetIndex];
      if (oldNode && oldNode.state !== ControlItemState.Removed) {
        oldNode.state = ControlItemState.PreRemove;
        oldNode.targetIndex = targetIndex;
      }

      // New node in PreUpdate state above target
      const preUpdateNode: T = {
        ...input,
        state: ControlItemState.PreUpdate,
        targetIndex,
      };
      next.push(preUpdateNode);
    });

    // --- Inserts ---
    batch.inserts?.forEach(({ input, targetIndex }) => {
      const preInsertNode: T = {
        ...input,
        state: ControlItemState.PreInsert,
        targetIndex,
      };
      next.push(preInsertNode);
    });

    this.history.push(next);
  }

  /**
   * Convert all Pre states in the last snapshot to final states
   * - PreInsert / PreUpdate → Inserted
   * - PreRemove → Removed
   */
  advancePreStates() {
    const last = this.history[this.history.length - 1];
    if (!last) return;

    const advanced = last.map(item => {
      if (item.state === ControlItemState.PreInsert || item.state === ControlItemState.PreUpdate) {
        return { ...item, state: ControlItemState.Inserted };
      }
      if (item.state === ControlItemState.PreRemove) {
        return { ...item, state: ControlItemState.Removed };
      }
      return item;
    });

    // Replace last snapshot with advanced snapshot
    this.history[this.history.length - 1] = advanced;
  }
}
