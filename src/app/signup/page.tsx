"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import SignUpForm from "@/components/auth/SignUpForm";
import { authClient } from "@/lib/auth-client";

export default function SignUpPage() {
  const router = useRouter();
  const session = authClient.useSession();

  useEffect(() => {
    // If already authenticated, redirect to profile
    if (session.data) {
      router.push("/profile");
    }
  }, [session.data, router]);

  if (session.data) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
      <main className="w-full max-w-md rounded-lg bg-white p-8 shadow-sm dark:bg-black">
        <h1 className="mb-6 text-2xl font-semibold text-black dark:text-white">
          Create an account
        </h1>

        <SignUpForm />

      </main>
    </div>
  );
}
