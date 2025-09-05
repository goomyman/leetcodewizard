// BatchProcessor.ts
import { ControlItem, ControlItemState } from "./ControlTypes";

export interface Batch<T extends ControlItem> {
  inserts?: { input: T; targetIndex: number }[];
  updates?: { input: T; targetIndex: number }[];
  deletes?: { targetIndex?: number; index?: number }[];
}

export class BatchProcessor<T extends ControlItem> {
  private history: T[][] = [];

  constructor(initial: T[][]) {
    this.history = [...initial];
    console.log("🔵 BatchProcessor initialized with history:", this.history);
  }

  getHistory(): T[][] {
    return this.history;
  }

  private advancePreStates() {
    if (this.history.length === 0) return;

    const last = this.history[this.history.length - 1];
    console.log("⏩ Advancing pre-states from snapshot:", last);

    const advanced = last
      .map(item => {
        if (item.state === ControlItemState.PreInsert) {
          console.log("   ✅ PreInsert → Inserted:", item);
          return { ...item, state: ControlItemState.Inserted };
        }
        if (item.state === ControlItemState.PreUpdate) {
          console.log("   ✅ PreUpdate → Updated:", item);
          return { ...item, state: ControlItemState.Updated };
        }
        if (item.state === ControlItemState.PreRemove) {
          console.log("   ❌ Removing PreRemove item:", item);
          return null;
        }
        return item;
      })
      .filter((x): x is T => x !== null);

    this.history.push(advanced);
    console.log("✅ Advanced snapshot pushed:", advanced);
  }

  applyBatch(batch: Batch<T>) {
    // Always resolve pre-states first
    this.advancePreStates();

    const prev = this.history[this.history.length - 1] ?? [];
    console.log("📦 Applying batch:", batch, "to snapshot:", prev);

    let next = [...prev];

    // --- Deletes ---
    batch.deletes?.forEach(d => {
      const idx = d.index ?? d.targetIndex;
      if (idx !== undefined && idx >= 0 && idx < next.length) {
        console.log(`   ❌ Marking index ${idx} as PreRemove:`, next[idx]);
        next[idx] = {
          ...next[idx],
          state: ControlItemState.PreRemove,
        };
      }
    });

    // --- Updates ---
    batch.updates?.forEach(u => {
      const idx = u.targetIndex;
      if (idx !== undefined && idx >= 0 && idx < next.length) {
        console.log(`   ✏️ Marking index ${idx} as PreUpdate:`, u.input);
        next[idx] = {
          ...u.input,
          state: ControlItemState.PreUpdate,
        };
      }
    });

    // --- Inserts ---
    batch.inserts?.forEach(ins => {
      const newItem = {
        ...ins.input,
        state: ControlItemState.PreInsert,
      };
      console.log(`   ➕ Inserting PreInsert at index ${ins.targetIndex}:`, newItem);
      next.splice(ins.targetIndex, 0, newItem);
    });

    this.history.push(next);
    console.log("✅ Snapshot after batch applied:", next);
  }
}
