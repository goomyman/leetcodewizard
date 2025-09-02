"use client";

import React from "react";
import { StackItemType, StackControl } from "./ControlTypes";
import StackItem from "./StackItem";

interface StackRendererProps {
  control: StackControl;
  sliderValue: number;
  stopShaking?: boolean;
}

export default function StackRenderer({
  control,
  sliderValue,
  stopShaking = false,
}: StackRendererProps) {
  const currentStack: StackItemType[] = control.history?.[sliderValue] || [];

  return (
    <div className="flex flex-col gap-1 w-full max-w-2xl p-2 bg-gray-800 border rounded justify-center items-center min-h-[200px]">
      <h3 className="font-semibold text-white mb-2">{control.id}</h3>
      {currentStack.map((item, idx) => (
        <StackItem
          key={item.id}
          item={item}
          stopShaking={stopShaking}
          stackIndex={idx}
        />
      ))}
    </div>
  );
}
