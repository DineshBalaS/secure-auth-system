"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
}

export function GlassCard({ children, className, ...props }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "relative overflow-hidden rounded-2xl",
        // High blur, low opacity background for frosted glass effect
        "bg-white/5 backdrop-blur-2xl",
        // Thin, gradient border simulating light reflection
        "border-[1px] border-transparent bg-gradient-to-b from-white/20 to-white/5 bg-clip-border",
        "shadow-2xl shadow-black/50",
        className
      )}
      {...props}
    >
      <div className="relative z-10 p-8">{children}</div>
    </motion.div>
  );
}
