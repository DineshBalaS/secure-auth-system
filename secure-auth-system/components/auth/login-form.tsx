"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, CheckCircle } from "lucide-react";

// Import Schema and Types
import { LoginSchema, type LoginInput } from "@/lib/validations";

// Import UI components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Define expected API error structure
interface APIErrorResponse {
  error: string;
}

interface LoginFormProps {
  message?: string;
}

export function LoginForm({ message }: LoginFormProps) {
  const router = useRouter();

  const form = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting, isValid },
    setError,
  } = form;

  const onSubmit = async (data: LoginInput) => {
    // Clear previous errors
    setError("root.serverError", { message: "" });

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result: APIErrorResponse | { message: string; user: any } =
        await response.json();

      if (!response.ok) {
        const errorResult = result as APIErrorResponse;

        // Specific handling for Unverified Users (403)
        if (response.status === 403) {
          setError("root.serverError", {
            message: errorResult.error || "Please verify your email first.",
          });
        }
        // Generic handling for Invalid Credentials (401)
        else if (response.status === 401) {
          setError("root.serverError", {
            message: errorResult.error || "Invalid email or password.",
          });
        }
        // Fallback for Server Errors (500)
        else {
          setError("root.serverError", {
            message: "An unexpected error occurred. Please try again.",
          });
        }
        return;
      }

      // Success (200 OK)
      // The server has already set the HttpOnly cookie.
      // We strictly redirect to the dashboard.
      router.push("/dashboard");
      router.refresh(); // Ensure the layout updates to show the logged-in state
    } catch (error) {
      console.error("[LOGIN_FORM_ERROR]", error);
      setError("root.serverError", {
        message: "Network error. Please check your connection.",
      });
    }
  };

  // Helper to interpret query params into user-friendly messages
  const getAlertMessage = (queryMessage?: string) => {
    if (queryMessage === "check_email") {
      return {
        text: "Account created successfully. Please check your email to verify.",
        type: "success",
      };
    }
    return null;
  };

  const alertMessage = getAlertMessage(message);

  return (
    <div className="bg-white dark:bg-gray-900 shadow-xl rounded-lg p-8 space-y-6 border border-gray-200 dark:border-gray-700">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
          Welcome Back
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Register here
          </Link>
        </p>
      </div>

      {/* Success/Info Alert (e.g. redirected from Register) */}
      {alertMessage && (
        <div
          className="flex items-center gap-3 rounded-md border border-green-400 bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900/20 dark:border-green-600 dark:text-green-400"
          role="alert"
        >
          <CheckCircle className="h-5 w-5 flex-shrink-0" />
          <p>{alertMessage.text}</p>
        </div>
      )}

      {/* Global Server Error Alert */}
      {errors.root?.serverError?.message && (
        <div
          className="flex items-center gap-3 rounded-md border border-red-400 bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:border-red-600 dark:text-red-400"
          role="alert"
        >
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <p>{errors.root.serverError.message}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email Field */}
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Email address
          </label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            {...register("email")}
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Password
          </label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="Your secure password"
            {...register("password")}
            aria-invalid={!!errors.password}
          />
          {errors.password && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          isLoading={isSubmitting}
          disabled={!isValid || isSubmitting}
        >
          Sign In
        </Button>
      </form>
    </div>
  );
}
