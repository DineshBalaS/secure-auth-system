"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, CheckCircle, ChevronLeft } from "lucide-react";

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
    <div className="w-full space-y-8">
      {/* Top Navigation */}
      <div className="flex items-center">
        <Link
          href="/"
          className="group flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ChevronLeft className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to website
        </Link>
      </div>

      {/* Header Section */}
      <div className="space-y-2 text-left">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Welcome!
        </h1>
        <p className="text-base text-gray-500">
          Create a free account or log in to get started using SecureAuth.
        </p>
      </div>

      {/* Success/Info Alert (e.g. redirected from Register) */}
      {alertMessage && (
        <div
          className="flex items-center gap-3 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700"
          role="alert"
        >
          <CheckCircle className="h-5 w-5 flex-shrink-0" />
          <p>{alertMessage.text}</p>
        </div>
      )}

      {/* Global Server Error Alert */}
      {errors.root?.serverError?.message && (
        <div
          className="flex items-center gap-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
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
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-sm font-bold text-gray-900"
            >
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-gray-500 hover:text-gray-900 underline-offset-4 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            {...register("password")}
            aria-invalid={!!errors.password}
          />
          {errors.password && (
            <p className="text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          isLoading={isSubmitting}
          disabled={!isValid || isSubmitting}
        >
          Log in
        </Button>
        {/* Social Logins */}
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
            Log in with Google
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
            Log in with Facebook
          </Button>
        </div>
      </form>
    </div>
  );
}
