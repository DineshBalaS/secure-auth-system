import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { LogoutButton } from "@/components/auth/logout-button";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      {/* Navigation Bar */}
      <nav className="border-b bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex items-center">
              <Link href="/dashboard" className="flex items-center gap-2">
                <ShieldCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  SecureAuth
                </span>
              </Link>
            </div>
            <div className="flex items-center">
              <LogoutButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
