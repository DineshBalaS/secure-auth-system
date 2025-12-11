"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";

// Import Schema and Types from the shared library
import { RegisterSchema, type RegisterInput } from "@/lib/validations";

// Import UI components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Define the expected error structure from the API for strict typing
interface APIErrorResponse {
  error: string;
  details?: {
    [key: string]: string[] | undefined;
  };
}

export function RegisterForm() {
  const router = useRouter();

  // Initialize React Hook Form with Zod Resolver
  const form = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur", // Validate fields when the user leaves them
  });

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting, isValid },
    setError,
  } = form;

  const onSubmit = async (data: RegisterInput) => {
    // 1. Clear previous global server errors before new request
    setError("root.serverError", { message: "" });

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result: APIErrorResponse | { message: string; userId: string } =
        await response.json();

      if (!response.ok) {
        // Cast result to Error type
        const errorResult = result as APIErrorResponse;

        // Handle 400 Validation Errors (Server Zod check failed)
        if (response.status === 400 && errorResult.details) {
          Object.keys(errorResult.details).forEach((key) => {
            const field = key as keyof RegisterInput;
            const messages = errorResult.details![field];
            if (messages && messages.length > 0) {
              setError(field, { message: messages[0] });
            }
          });
        }
        // Handle 409 Conflict (User already exists)
        else if (response.status === 409) {
          setError("root.serverError", { message: errorResult.error });
        }
        // Handle 500 or unknown errors
        else {
          setError("root.serverError", {
            message: errorResult.error || "An unknown error occurred.",
          });
        }
        return; // Stop execution
      }

      // Success! Redirect to login with a success query param
      router.push("/login?message=check_email");
    } catch (error) {
      console.error("[REGISTER_FORM_ERROR]", error);
      setError("root.serverError", {
        message: "Network error. Please check your connection.",
      });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 shadow-xl rounded-lg p-8 space-y-6 border border-gray-200 dark:border-gray-700">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
          Create Account
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Sign In
          </Link>
        </p>
      </div>

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
            autoComplete="new-password"
            placeholder="Min 8 characters"
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
          Register
        </Button>
      </form>
    </div>
  );
}
