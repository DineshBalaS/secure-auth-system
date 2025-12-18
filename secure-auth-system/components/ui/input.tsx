import * as React from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const isPassword = type === "password";

    const displayedType = isPassword
      ? showPassword
        ? "text"
        : "password"
      : type;

    return (
      <div className="relative">
        <input
          type={displayedType}
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
            "focus-visible:shadow-[0_0_15px_rgba(139,92,246,0.3)]",
            // Disabled
            "disabled:cursor-not-allowed disabled:opacity-50",
            // Add right padding for the icon
            isPassword && "pr-10",
            className
          )}
          ref={ref}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-200 transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
