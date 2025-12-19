import Link from "next/link";
import { LogOut, ShieldCheck } from "lucide-react";

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
              {/* We will implement the actual logout logic button later */}
              <button
                disabled
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
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
