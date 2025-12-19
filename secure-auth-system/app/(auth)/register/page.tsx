import { RegisterForm } from "@/components/auth/register-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create an Account | SecureAuth",
  description: "Create a new account to get started with SecureAuth.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
