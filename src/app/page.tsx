import Link from "next/link";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col items-center gap-8 rounded-lg bg-white p-12 shadow-sm dark:bg-black">
        <Logo size="lg" />

        <h1 className="text-4xl font-semibold leading-tight text-black dark:text-white">
          Welcome to Diet Buddy
        </h1>

        <p className="max-w-xl text-center text-lg text-gray-700 dark:text-gray-300">
          Track meals, set goals, and build healthier habits. Sign in to
          continue or create a new account.
        </p>

        <div className="flex w-full max-w-sm gap-3 sm:justify-center">
          <Button
            variant="default"
            asChild
            className="w-1/2 bg-black text-white hover:opacity-95 dark:bg-white dark:text-black"
          >
            <Link href="/signin">Sign in</Link>
          </Button>

          <Button
            variant="outline"
            asChild
            className="w-1/2  bg-white text-black hover:opacity-95 dark:bg-black dark:text-white"
          >
            <Link href="/signup">Sign up</Link>
          </Button>
        </div>

        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
          No account yet? Click Sign up to get started.
        </p>
      </main>
    </div>
  );
}
