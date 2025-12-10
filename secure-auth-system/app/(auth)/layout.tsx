import React from "react";
import { NebulaBackground } from "@/components/ui/nebula-background";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden font-sans text-gray-100">
      {/* 1. Background Layer */}
      <NebulaBackground />

      {/* 2. Content Layer */}
      <div className="relative z-10 w-full max-w-md px-4 py-8">
        {/* Optional: Project Logo / Branding Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 shadow-lg shadow-indigo-500/30 mb-4">
            {/* Simple Logo Icon */}
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white drop-shadow-md">
            Secure Auth
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            Enter the void. Securely.
          </p>
        </div>

        {/* 3. The Form Container */}
        {children}
      </div>

      {/* 4. Footer / Copyright (Optional) */}
      <div className="absolute bottom-6 text-center text-xs text-gray-600 mix-blend-plus-lighter">
        &copy; {new Date().getFullYear()} Secure Auth System. All rights
        reserved.
      </div>
    </div>
  );
}
