"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { ForgotPasswordSchema, ForgotPasswordInput } from "@/lib/validations";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";

export default function ForgotPasswordPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setServerError(null);
    setSuccessMessage(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      const result = await res.json();

      if (!res.ok) {
        setServerError(result.error || "Something went wrong.");
        return;
      }

      setSuccessMessage(result.message);
    } catch (error) {
      setServerError("Network error. Please try again.");
    }
  };

  return (
    <GlassCard className="w-full max-w-md p-8">
      <h1 className="text-2xl font-bold text-center mb-2 text-white">
        Reset Password
      </h1>
      <p className="text-gray-400 text-center mb-6 text-sm">
        Enter your email to receive a reset link.
      </p>

      {successMessage ? (
        <div className="text-center bg-green-900/30 p-4 rounded-md border border-green-500/30">
          <p className="text-green-400 mb-4 text-sm">{successMessage}</p>
          <Link
            href="/login"
            className="text-blue-400 hover:text-blue-300 text-sm font-semibold"
          >
            &larr; Back to Login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Email Address
            </label>
            <Input
              {...register("email")}
              placeholder="name@example.com"
              type="email"
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {serverError && (
            <p className="text-red-400 text-sm text-center bg-red-900/20 p-2 rounded">
              {serverError}
            </p>
          )}

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </Button>

          <div className="text-center mt-4">
            <Link
              href="/login"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Back to Login
            </Link>
          </div>
        </form>
      )}
    </GlassCard>
  );
}
