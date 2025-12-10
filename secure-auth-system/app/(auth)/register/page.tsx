import { RegisterForm } from "@/components/auth/register-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register | SecureAuth",
  description: "Create a new account to get started with SecureAuth.",
};

export default function RegisterPage() {
  return (
    <>
      {/* Screen reader only heading for accessibility structure */}
      <h1 className="sr-only">Register for SecureAuth</h1>
      <RegisterForm />
    </>
  );
}
