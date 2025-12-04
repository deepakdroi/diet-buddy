"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const session = authClient.useSession();

  useEffect(() => {
    if (session.data) {
      setIsAuthenticated(true);
      setUserName(session.data.user.name || session.data.user.email);
    } else {
      setIsAuthenticated(false);
      setUserName("");
    }
    setIsLoading(false);
  }, [session.data]);

  async function handleSignOut() {
    try {
      await authClient.signOut();
      setIsAuthenticated(false);
      setUserName("");
      router.push("/");
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  }

  return (
    <nav className="w-full border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-black">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Logo size="lg" href="/" />

        <div className="flex items-center gap-2">
          {!isLoading && isAuthenticated ? (
            <>
              <div className="flex items-center gap-3 mr-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {userName}
                </span>
              </div>
              <Button
                variant="ghost"
                asChild
                className="text-black dark:text-white"
              >
                <Link href="/profile">Profile</Link>
              </Button>
              <Button
                onClick={handleSignOut}
                className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/signin" className="text-black dark:text-white">
                  Sign in
                </Link>
              </Button>
              <Button
                variant="default"
                asChild
                className="bg-black text-white hover:opacity-95 dark:bg-white dark:text-black"
              >
                <Link href="/signup">Sign up</Link>
              </Button>
            </>
          )}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
