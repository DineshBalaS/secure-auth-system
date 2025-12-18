import * as React from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string; // Enforce name for form handling
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
            "flex h-12 w-full rounded-lg px-3 py-2 text-sm transition-all duration-200",

            // Visual Style: Clean White & Gray
            "bg-white border border-gray-200 text-gray-900 placeholder:text-gray-500",

            // Focus State: High Contrast Black Ring (No Glow)
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:border-transparent",

            // Disabled State
            "disabled:cursor-not-allowed disabled:opacity-50",

            // Padding adjustment for password icon
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
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-900 transition-colors focus:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
            tabIndex={-1} // Skip tab focus for the eye icon to keep flow smooth
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
