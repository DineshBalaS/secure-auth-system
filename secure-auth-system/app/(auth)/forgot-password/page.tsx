"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { ForgotPasswordSchema, ForgotPasswordInput } from "@/lib/validations";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
    <div className="w-full space-y-6">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Reset Password
        </h1>
        <p className="text-sm text-gray-500">
          Enter your email to receive a reset link.
        </p>
      </div>

      {successMessage ? (
        <div className="rounded-md bg-green-50 p-4 border border-green-200">
          <div className="flex flex-col items-center justify-center text-center">
            <p className="text-sm font-medium text-green-800 mb-2">
              {successMessage}
            </p>
            <Link
              href="/login"
              className="text-sm font-medium text-green-700 hover:text-green-900 hover:underline"
            >
              &larr; Back to Login
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <Input
              {...register("email")}
              placeholder="name@example.com"
              type="email"
              className="bg-white text-gray-900 border-gray-300 focus:ring-gray-900"
            />
            {errors.email && (
              <p className="text-red-600 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {serverError && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200 text-center">
              {serverError}
            </div>
          )}

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </Button>

          <div className="text-center mt-4">
            <Link
              href="/login"
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors hover:underline"
            >
              Back to Login
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
