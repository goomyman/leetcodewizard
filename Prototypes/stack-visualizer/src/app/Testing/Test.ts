import { ControlItem, ControlItemState } from "../stack/ControlTypes";

// Minimal Batch type for this test
type Batch<T extends ControlItem> = {
  deletes?: { targetIndex: number }[];
};

// Minimal BatchProcessor focused on deletes
class BatchProcessor<T extends ControlItem> {
  private history: T[][] = [];

  constructor(initial: T[][]) {
    // Ensure initial items have targetIndex
    this.history = initial.map(step =>
      step.map((item, idx) => ({ ...item, targetIndex: item.targetIndex ?? idx }))
    );
  }

  getHistory() {
    return this.history;
  }

  applyBatch(batch: Batch<T>) {
    const last = this.history[this.history.length - 1] || [];
    const next: T[] = last.map(item => ({ ...item }));

    batch.deletes?.forEach(({ targetIndex }) => {
      if (targetIndex >= 0 && targetIndex < next.length) {
        next[targetIndex].state = ControlItemState.PreRemove;
        next[targetIndex].targetIndex = targetIndex;
      } else {
        console.warn(`Delete targetIndex ${targetIndex} out of bounds`);
      }
    });

    this.history.push(next);
  }
}

// --- Test ---
const initialArray: ControlItem[] = [
  { id: "item0", value: 10, state: ControlItemState.Inserted },
  { id: "item1", value: 20, state: ControlItemState.Inserted },
  { id: "item2", value: 30, state: ControlItemState.Inserted },
];

// Wrap initial array in outer array to create history
const bp = new BatchProcessor([initialArray]);

// Apply delete on index 1
bp.applyBatch({ deletes: [{ targetIndex: 1 }] });

// Print results
console.log("Initial snapshot:", bp.getHistory()[0]);
console.log("After delete batch:", bp.getHistory()[1]);
