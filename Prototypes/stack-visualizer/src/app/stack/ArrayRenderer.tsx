"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";

interface Update {
  index: number;
  value: string;
}

interface ArrayControl {
  id: string;
  type: "array";
  size: number;              // fixed array size
  updates?: Update[];
}

interface ArrayRendererProps {
  control: ArrayControl;
  sliderValue: number;       // shared history / slider
}

interface ArrayCell {
  index: number;
  value: string | null;
  isPreUpdate?: boolean;
}

const CELL_SIZE = 60;

export default function ArrayRenderer({ control, sliderValue }: ArrayRendererProps) {
  const [cells, setCells] = useState<ArrayCell[]>(
    Array.from({ length: control.size }, (_, i) => ({
      index: i,
      value: null,
    }))
  );

  // Track pre-updates separately so they can "shake + drop"
  const [preUpdates, setPreUpdates] = useState<Update[]>([]);

  useEffect(() => {
    // For now we’ll do a simple "apply all updates" based on sliderValue
    // Later you can expand this to step through like you do for stacks
    if (!control.updates) return;

    const appliedCells = [...cells];
    const nextPreUpdates: Update[] = [];

    control.updates.forEach((u, idx) => {
      if (idx === sliderValue) {
        // Show as pre-update (shake above target cell)
        nextPreUpdates.push(u);
      } else if (idx < sliderValue) {
        // Already applied
        appliedCells[u.index] = { index: u.index, value: u.value };
      }
    });

    setCells(appliedCells);
    setPreUpdates(nextPreUpdates);
  }, [sliderValue, control.updates]);

  return (
    <div className="flex flex-col gap-2 items-center">
      <h3 className="text-white font-semibold">{control.id}</h3>

      {/* Array cells */}
      <div className="flex">
        {cells.map((cell) => (
          <div
            key={cell.index}
            style={{
              width: CELL_SIZE,
              height: CELL_SIZE,
              border: "2px solid white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              backgroundColor: cell.value ? "#4ade80" : "#1f2937", // green if filled
            }}
            className="text-white font-bold"
          >
            {cell.value ?? ""}
          </div>
        ))}
      </div>

      {/* Pre-update overlays */}
      {preUpdates.map((u) => (
        <PreUpdate key={`pre-${u.index}`} update={u} />
      ))}
    </div>
  );
}

function PreUpdate({ update }: { update: Update }) {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      y: [ -CELL_SIZE, -CELL_SIZE - 5, -CELL_SIZE, -CELL_SIZE - 5, -CELL_SIZE ],
      scale: [1, 1.05, 1, 1.05, 1],
      transition: {
        duration: 2.5,
        repeat: Infinity,
        repeatType: "loop",
      },
    });
  }, [controls]);

  return (
    <motion.div
      animate={controls}
      style={{
        position: "absolute",
        top: 0,
        left: update.index * CELL_SIZE,
        width: CELL_SIZE,
        height: CELL_SIZE,
        border: "2px solid red",
        backgroundColor: "#f87171",
        borderRadius: 4,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 20,
      }}
      className="text-black font-bold"
    >
      {update.value}
    </motion.div>
  );
}
