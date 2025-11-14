"use client";

import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <nav className="w-full border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-black">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Logo size="lg" href="/" />

        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/signin" className="text-black dark:text-white">Sign in</Link>
          </Button>
          <Button
            variant="default"
            asChild
            className="bg-black text-white hover:opacity-95 dark:bg-white dark:text-black"
          >
            <Link href="/signup">Sign up</Link>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
