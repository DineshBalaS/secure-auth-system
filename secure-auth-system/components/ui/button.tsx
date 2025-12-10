"use client"; // Required for framer-motion in a UI component if strictly separating

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/50 hover:from-violet-500 hover:to-indigo-500 border border-indigo-400/20",
        destructive:
          "bg-red-500/10 text-red-400 border border-red-500/50 hover:bg-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.2)]",
        outline:
          "border border-white/10 bg-white/5 hover:bg-white/10 hover:text-white text-gray-200 backdrop-blur-sm",
        secondary: "bg-white/10 text-white hover:bg-white/20 backdrop-blur-md",
        ghost: "hover:bg-white/5 hover:text-white text-gray-300",
        link: "text-violet-400 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-md px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// Combine Framer Motion props with HTML Button props
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    isLoading?: boolean;
  };

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading,
      children,
      ...props
    },
    ref
  ) => {
    // If asChild is true, we strictly use Slot (no animation wrapper in this simplified version for Radix comp)
    // But for the design requested, we usually want the motion.button.

    const Comp = asChild ? Slot : motion.button;

    return (
      // @ts-ignore - framer motion types with polymorphism can be tricky, casting for safety
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.96 }}
        disabled={isLoading || props.disabled}
        {...(asChild ? {} : { type: props.type || "button" })} // Motion button needs type explicit if not provided
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {children}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
