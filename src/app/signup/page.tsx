"use client";

import SignUpForm from "@/components/auth/SignUpForm";

export default function SignUpPage() {
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
