import { LoginForm } from "@/components/auth/login-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | SecureAuth",
  description: "Sign in to your account to access the dashboard.",
};

interface LoginPageProps {
  // In Next.js 15+, searchParams is a Promise that must be awaited
  searchParams: Promise<{
    message?: string;
    email?: string;
  }>;
}

export default async function LoginPage(props: LoginPageProps) {
  // Await the search params to extract the 'message' query
  const searchParams = await props.searchParams;

  return (
    <>
      {/* Screen reader only heading for accessibility structure */}
      <h1 className="sr-only">Login to SecureAuth</h1>
      <LoginForm message={searchParams.message} email={searchParams.email} />
    </>
  );
}
