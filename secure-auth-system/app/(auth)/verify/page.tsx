"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

// 1. The Core Logic Component
function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying"
  );
  const [message, setMessage] = useState("");

  // Prevent double-firing in React Strict Mode
  const [hasFired, setHasFired] = useState(false);

  useEffect(() => {
    // Guard clauses
    if (hasFired) return;
    if (!token) {
      setStatus("error");
      setMessage("Missing verification token.");
      return;
    }

    setHasFired(true);

    // 2. The API Trigger
    const verifyToken = async () => {
      try {
        const res = await fetch("/api/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (res.ok) {
          setStatus("success");
          setMessage("Email verified successfully!");
          // Optional: Auto-redirect after 3 seconds
          setTimeout(() => router.push("/login"), 3000);
        } else {
          setStatus("error");
          setMessage(data.error || "Verification failed");
        }
      } catch (error) {
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      }
    };

    verifyToken();
  }, [token, hasFired, router]);

  // 3. UI States
  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white border border-gray-100 rounded-xl shadow-sm text-center">
      {/* HEADER */}
      <div className="flex flex-col items-center space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Email Verification
        </h1>
        <p className="text-sm text-gray-500">
          We are validating your secure token.
        </p>
      </div>

      {/* STATE: VERIFYING */}
      {status === "verifying" && (
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
          <p className="text-gray-600">Verifying your email...</p>
        </div>
      )}

      {/* STATE: SUCCESS */}
      {status === "success" && (
        <div className="flex flex-col items-center justify-center py-4 space-y-4 animate-in fade-in zoom-in duration-300">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900">Verified!</h2>
            <p className="text-gray-600">{message}</p>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-4 py-2 mt-4 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 transition-colors w-full"
          >
            Go to Login
          </Link>
        </div>
      )}

      {/* STATE: ERROR */}
      {status === "error" && (
        <div className="flex flex-col items-center justify-center py-4 space-y-4 animate-in fade-in zoom-in duration-300">
          <XCircle className="h-16 w-16 text-red-500" />
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900">
              Verification Failed
            </h2>
            <p className="text-red-600">{message}</p>
          </div>
          <Link
            href="/register"
            className="text-sm text-gray-500 hover:text-gray-900 underline underline-offset-4"
          >
            Back to Registration
          </Link>
        </div>
      )}
    </div>
  );
}

// 4. The Suspense Wrapper (Mandatory for Next.js 15 useSearchParams)
export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-md p-8 text-center text-gray-600">
          Loading verification...
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
