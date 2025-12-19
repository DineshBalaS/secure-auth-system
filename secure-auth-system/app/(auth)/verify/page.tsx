import { VerifyForm } from "@/components/auth/verify-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Email | SecureAuth",
  description: "Verify your email address to activate your account.",
};

export default function VerifyPage() {
  return (
    // No hidden <h1> needed here as VerifyForm has a visible <h1>
    <VerifyForm />
  );
}
