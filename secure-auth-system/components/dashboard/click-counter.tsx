"use client";

import { useState } from "react";
import { MousePointerClick } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ClickCounter() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-neutral-900 rounded-xl border border-neutral-800 shadow-xl w-full max-w-md mx-auto aspect-video">
      <div className="flex flex-col items-center space-y-6">
        <div className="p-4 bg-neutral-800 rounded-full">
          <MousePointerClick className="w-8 h-8 text-neutral-400" />
        </div>

        <div className="space-y-2 text-center">
          <h2 className="text-4xl font-bold tracking-tight text-white tabular-nums">
            {count}
          </h2>
          <p className="text-sm font-medium text-neutral-500 uppercase tracking-widest">
            Total Clicks
          </p>
        </div>

        <Button
          onClick={() => setCount((c) => c + 1)}
          size="lg"
          className="w-full bg-white text-black hover:bg-neutral-200 transition-colors font-semibold"
        >
          Click Me
        </Button>

        <p className="text-sm text-neutral-500 italic mt-6 pt-4 border-t border-neutral-800 w-full text-center">
          Your homepage goes here
        </p>
      </div>
    </div>
  );
}
