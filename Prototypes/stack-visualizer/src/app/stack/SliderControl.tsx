"use client";

import React from "react";

interface SliderControlProps {
  historyLength: number;
  currentIndex: number;
  onChange: (index: number) => void;
}

export default function SliderControl({ historyLength, currentIndex, onChange }: SliderControlProps) {
  return (
    <input
      type="range"
      min={0}
      max={historyLength - 1}
      value={currentIndex}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full mt-4"
    />
  );
}
