import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Layout & Base
          "flex h-11 w-full rounded-lg px-3 py-2 text-sm transition-all duration-300",
          // Glass / Transparent Style
          "bg-black/20 border border-white/10 text-white placeholder:text-gray-400",
          "backdrop-blur-sm",
          // Hover State
          "hover:bg-black/30 hover:border-white/20",
          // Focus State (The Glow)
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-violet-500",
          "focus-visible:border-violet-500/50 focus-visible:bg-black/40",
          "focus-visible:shadow-[0_0_15px_rgba(139,92,246,0.3)]", // Violet glow
          // Disabled
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
