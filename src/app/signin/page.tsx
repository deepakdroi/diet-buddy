"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SignInForm from "@/components/auth/SignInForm";
import { authClient } from "@/lib/auth-client";

export default function SignInPage() {
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
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Sign in to Diet Buddy
          </h1>

          <SignInForm />

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
