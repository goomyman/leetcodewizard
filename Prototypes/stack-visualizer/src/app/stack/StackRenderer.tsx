"use client";

import React from "react";
import Stack from "./Stack";
import { StackControl } from "./ControlTypes";

interface StackRendererProps {
  control: StackControl;
  sliderValue: number;
}

export default function StackRenderer({ control, sliderValue }: StackRendererProps) {
  // Simply slice items based on sliderValue
  const currentStack = control.items.slice(0, sliderValue + 1);

  return (
    <div className="p-2 bg-gray-800 border rounded flex flex-col items-center justify-center min-h-[200px] w-full max-w-2xl">
      <h3 className="font-semibold text-white mb-2">{control.id}</h3>
      <Stack stack={currentStack} />
    </div>
  );
}
