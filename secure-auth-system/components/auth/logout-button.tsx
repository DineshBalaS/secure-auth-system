"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // 1. Call the backend to destroy the session cookie
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        // 2. Redirect to login and refresh to clear client-side cache
        router.push("/login");
        router.refresh();
      }
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
    >
      <LogOut className="h-4 w-4" />
      Logout
    </button>
  );
}
