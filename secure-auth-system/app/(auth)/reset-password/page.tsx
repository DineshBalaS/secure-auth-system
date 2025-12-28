"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetPasswordSchema, ResetPasswordInput } from "@/lib/validations";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";

export default function ResetPasswordPage() {
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
      token: token || "", // Auto-fill token from URL
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

  if (!token) {
    return (
      <GlassCard className="w-full max-w-md p-8 text-center">
        <h1 className="text-xl font-bold text-red-400 mb-2">Invalid Link</h1>
        <p className="text-gray-300 mb-4">
          This password reset link is missing a valid token.
        </p>
        <Button
          onClick={() => router.push("/forgot-password")}
          variant="outline"
        >
          Request a new link
        </Button>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="w-full max-w-md p-8">
      <h1 className="text-2xl font-bold text-center mb-6 text-white">
        Set New Password
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Hidden Token Input */}
        <input type="hidden" {...register("token")} />

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">
            New Password
          </label>
          <Input
            type="password"
            {...register("password")}
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="text-red-400 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">
            Confirm Password
          </label>
          <Input
            type="password"
            {...register("confirmPassword")}
            placeholder="••••••••"
          />
          {errors.confirmPassword && (
            <p className="text-red-400 text-xs mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {serverError && (
          <p className="text-red-400 text-sm text-center bg-red-900/20 p-2 rounded">
            {serverError}
          </p>
        )}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </GlassCard>
  );
}
