"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link"; // Added for navigation
import { ResetPasswordSchema, ResetPasswordInput } from "@/lib/validations";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      token: token?.trim() || "", // Sanitize incoming token
    },
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    setServerError(null);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      const result = await res.json();

      if (!res.ok) {
        setServerError(result.error || "Failed to reset password.");
        return;
      }

      // Success: Redirect to login
      router.push("/login?reset=success");
    } catch (error) {
      setServerError("Network error. Please try again.");
    }
  };

  // 1. Missing Token State (Styled for Light Mode)
  if (!token) {
    return (
      <div className="w-full space-y-6 text-center">
        <div className="rounded-md bg-red-50 p-6 border border-red-200">
          <h1 className="text-lg font-semibold text-red-800 mb-2">
            Invalid Link
          </h1>
          <p className="text-sm text-red-600 mb-6">
            This password reset link is invalid or missing a token.
          </p>
          <Button
            onClick={() => router.push("/forgot-password")}
            variant="outline"
            className="w-full bg-white border-red-200 text-red-900 hover:bg-red-50"
          >
            Request a new link
          </Button>
        </div>
        <div className="text-center">
          <Link
            href="/login"
            className="text-sm text-gray-500 hover:text-gray-900 hover:underline"
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  // 2. Main Form (Refactored for Light Mode)
  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Set New Password
        </h1>
        <p className="text-sm text-gray-500">
          Please enter your new password below.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Hidden Token Input */}
        <input type="hidden" {...register("token")} />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            New Password
          </label>
          <Input
            type="password"
            {...register("password")}
            placeholder="••••••••"
            className="bg-white text-gray-900 border-gray-300 focus:ring-gray-900"
          />
          {errors.password && (
            <p className="text-red-600 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <Input
            type="password"
            {...register("confirmPassword")}
            placeholder="••••••••"
            className="bg-white text-gray-900 border-gray-300 focus:ring-gray-900"
          />
          {errors.confirmPassword && (
            <p className="text-red-600 text-xs mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {serverError && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200 text-center">
            {serverError}
          </div>
        )}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-center p-4">Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
