"use client";

import { useState } from "react";
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
  const [duplicateEmail, setDuplicateEmail] = useState<string | null>(null);

  // Initialize React Hook Form with Zod Resolver
  const form = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
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
    setDuplicateEmail(null);

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
          setDuplicateEmail(data.email);
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
    <div className="w-full space-y-8">
      {/* Header Section */}
      <div className="space-y-2 text-left">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Create an account
        </h1>
        <p className="text-base text-gray-500">
          Enter your details below to create your account and get started.
        </p>
      </div>

      {/* Duplicate User Alert with Login Link */}
      {duplicateEmail ? (
        <div
          className="flex items-center gap-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          role="alert"
        >
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <div className="space-y-1">
            <p>User with this email already exists.</p>
            <Link
              href={`/login?email=${encodeURIComponent(duplicateEmail)}`}
              className="font-bold underline underline-offset-4 hover:text-red-900"
            >
              Want to login instead?
            </Link>
          </div>
        </div>
      ) : errors.root?.serverError?.message ? (
        /* Global Server Error Alert (Fallback) */
        <div
          className="flex items-center gap-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          role="alert"
        >
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <p>{errors.root.serverError.message}</p>
        </div>
      ) : null}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email Field */}
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-bold text-gray-900"
          >
            Email
          </label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            {...register("email")}
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label
            htmlFor="password"
            className="block text-sm font-bold text-gray-900"
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
            <p className="text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-bold text-gray-900"
          >
            Confirm Password
          </label>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Re-enter your password"
            {...register("confirmPassword")}
            aria-invalid={!!errors.confirmPassword}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-600">
              {errors.confirmPassword.message}
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
          Create account
        </Button>

        {/* Social Registration (Visual Only) */}
        <div className="space-y-3">
          <Button variant="outline" className="w-full relative" type="button">
            {/* Google Icon SVG */}
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Sign up with Google
          </Button>
          <Button variant="outline" className="w-full relative" type="button">
            {/* Facebook Icon SVG */}
            <svg
              className="mr-2 h-4 w-4 text-[#1877F2]"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 2.848-5.978 5.817-5.978.952 0 1.904.07 2.856.208v3.25h-1.96c-1.986 0-2.37.944-2.37 2.33v1.77h3.693l-.48 3.667h-3.213v7.98H9.101Z" />
            </svg>
            Sign up with Facebook
          </Button>
        </div>

        {/* Login Link Footer */}
        <div className="text-center text-sm">
          <span className="text-gray-500">Already have an account? </span>
          <Link
            href="/login"
            className="font-bold text-gray-900 hover:underline underline-offset-4"
          >
            Log in
          </Link>
        </div>
      </form>
    </div>
  );
}
