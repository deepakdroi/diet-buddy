"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !password) {
      alert("Please fill all fields.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    alert("Account created (mock). You can now sign in.");
    router.push("/signin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <main className="w-full max-w-md rounded-lg bg-white p-8 shadow-sm dark:bg-black">
        <h1 className="mb-2 text-2xl font-semibold text-black dark:text-zinc-50">
          Create an account
        </h1>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          <label className="flex flex-col text-sm">
            <span className="mb-1 text-zinc-700 dark:text-zinc-300">
              Full name
            </span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="rounded border px-3 py-2 text-black dark:text-zinc-50"
            />
          </label>

          <label className="flex flex-col text-sm">
            <span className="mb-1 text-zinc-700 dark:text-zinc-300">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded border px-3 py-2 text-black dark:text-zinc-50"
            />
          </label>

          <label className="flex flex-col text-sm">
            <span className="mb-1 text-zinc-700 dark:text-zinc-300">
              Password
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="rounded border px-3 py-2 text-black dark:text-zinc-50"
            />
          </label>

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 rounded-full bg-foreground py-2 text-background font-medium hover:opacity-95"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create account"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/signin")}
              className="flex-1 rounded-full border border-black/8 py-2 font-medium hover:bg-black/4 dark:border-white/[.145]"
            >
              Back to sign in
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
