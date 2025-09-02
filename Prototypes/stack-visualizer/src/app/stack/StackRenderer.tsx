"use client";

import React from "react";
import StackItem from "./StackItem";
import { HistoryControl } from "./ControlTypes";

interface StackRendererProps {
  control: HistoryControl;
  sliderValue: number;
}

export default function StackRenderer({ control }: StackRendererProps) {
  return (
    <div className="p-2 bg-gray-800 border rounded flex flex-col items-center justify-center min-h-[200px] w-full max-w-2xl">
      <h3 className="font-semibold text-white mb-2">{control.id}</h3>
      {control.items.map((item, idx) => (
        <StackItem key={item.id} item={item} stopShaking={item.state !== 1} stackIndex={idx} />
      ))}
    </div>
  );
}
