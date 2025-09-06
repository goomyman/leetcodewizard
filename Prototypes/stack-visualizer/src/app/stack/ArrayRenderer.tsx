"use client";

import React, { useState } from "react";
import ArrayItem from "./ArrayItem";
import { Control, ControlItem, ControlItemState } from "./ControlTypes";
import { ARRAY_ITEM_SIZE } from "./ArrayItemConstants";

interface ArrayRendererProps {
  control: Control<ControlItem>;
  onRemoved?: (id: string) => void;
}

export default function ArrayRenderer({ control, onRemoved }: ArrayRendererProps) {
  const [forceUpdate, setForceUpdate] = useState(0);
  const allItems = control.items;

  // Only items that occupy a slot (ignore PreUpdate)
  const layoutItems = allItems.filter(
    item => !item._isRemoved && item.state !== ControlItemState.PreUpdate
  );

  return (
    <div className="flex flex-col items-start">
      <h3 className="text-white font-semibold">{control.id}</h3>
      <div
        className="relative"
        style={{
          width: Math.max(layoutItems.length, 1) * ARRAY_ITEM_SIZE,
          height: ARRAY_ITEM_SIZE,
        }}
      >
        {allItems.map((item) => {
          // Default layout index for items that occupy a slot
          let layoutIndex = layoutItems.findIndex(i => i.id === item.id);
          if (layoutIndex < 0) layoutIndex = 0;

          let left = layoutIndex;
          let top = 0;

          // PreUpdate: float above the target item
          if (item.state === ControlItemState.PreUpdate && item.updateTargetId) {
            const targetIndex = layoutItems.findIndex(i => i.id === item.updateTargetId);
            left = targetIndex >= 0 ? targetIndex : 0;
            top = -ARRAY_ITEM_SIZE - 4; // float above target
          }

          // PreRemove / Removed remain in place
          else if (item.state === ControlItemState.PreRemove || item.state === ControlItemState.Removed) {
            top = 0;
          }

          return (
            <ArrayItem
              key={`${item.id}-${item.state}`}
              item={item}
              leftIndex={left}
              topOffset={top}
              onRemoved={(id) => {
                item._isRemoved = true;
                setForceUpdate(v => v + 1);
                onRemoved?.(id);
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
