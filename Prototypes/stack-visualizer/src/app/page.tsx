"use client";

import StackManager from "./stack/StackManager";

export default function Page() {
  return (
    <div className="flex flex-col items-center p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Stack Visualizer - Volume Style</h1>
      <StackManager /> {/* This mounts the full stack + buttons */}
    </div>
  );
}
