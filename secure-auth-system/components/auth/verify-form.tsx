"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, CheckCircle, XCircle, ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

interface APIVerifyResponse {
  message?: string;
  error?: string;
}

export function VerifyForm() {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const onSubmit = useCallback(async () => {
    if (success || error) return;

    if (!token) {
      setError("Missing verification token.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data: APIVerifyResponse = await response.json();

      if (!response.ok) {
        setError(data.error || "Verification failed.");
      } else {
        setSuccess(data.message || "Email verified successfully!");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [token, success, error]);

  // Auto-trigger verification on mount
  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <div className="w-full space-y-8">
      {/* Top Navigation */}
      <div className="flex items-center">
        <Link
          href="/login"
          className="group flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ChevronLeft className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to login
        </Link>
      </div>

      {/* Header Section */}
      <div className="space-y-2 text-left">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Verify Account
        </h1>
        <p className="text-base text-gray-500">
          We are verifying your email address.
        </p>
      </div>

      <div className="flex flex-col items-start gap-4 py-4">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center gap-3 text-gray-500">
            <Loader2 className="h-6 w-6 animate-spin text-gray-900" />
            <p>Verifying your token...</p>
          </div>
        )}

        {/* Success State */}
        {!isLoading && success && (
          <div className="w-full space-y-6">
            <div className="flex items-center gap-3 rounded-md border border-green-200 bg-green-50 p-4 text-green-700">
              <CheckCircle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm font-medium">{success}</p>
            </div>
            <Button onClick={() => router.push("/login")} className="w-full">
              Continue to Login
            </Button>
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="w-full space-y-6">
            <div className="flex items-center gap-3 rounded-md border border-red-200 bg-red-50 p-4 text-red-700">
              <XCircle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push("/login")}
              className="w-full"
            >
              Back to Login
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
