"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

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
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
      <main className="w-full max-w-md rounded-lg bg-white p-8 shadow-sm dark:bg-black">
        <h1 className="mb-6 text-2xl font-semibold text-black dark:text-white">
          Create an account
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-800 dark:text-gray-300">
              Full name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
              className="bg-white text-black placeholder-gray-500 border border-gray-300 dark:bg-black dark:text-white dark:placeholder-gray-400 dark:border-gray-700"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-800 dark:text-gray-300">
              Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="bg-white text-black placeholder-gray-500 border border-gray-300 dark:bg-black dark:text-white dark:placeholder-gray-400 dark:border-gray-700"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-800 dark:text-gray-300">
              Password
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="pr-10 bg-white text-black placeholder-gray-500 border border-gray-300 dark:bg-black dark:text-white dark:placeholder-gray-400 dark:border-gray-700"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {mounted ? (showPassword ? <EyeOff size={18} /> : <Eye size={18} />) : null}
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" className="flex-1 bg-black text-white dark:bg-white dark:text-black" disabled={loading}>
              {loading ? "Creating..." : "Create account"}
            </Button>

            <Button type="button" variant="outline" className="flex-1" onClick={() => router.push("/signin")}>
              Back to sign in
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
