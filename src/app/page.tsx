import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <main className="flex w-full max-w-3xl transform-gpu flex-col items-center gap-8 rounded-lg bg-white p-12 shadow-sm dark:bg-black">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Diet Buddy"
          width={120}
          height={30}
          priority
        />

        <h1 className="text-4xl font-semibold leading-tight text-black dark:text-zinc-50">
          Welcome to Diet Buddy
        </h1>

        <p className="max-w-xl text-center text-lg text-zinc-600 dark:text-zinc-400">
          Track meals, set goals, and build healthier habits. Sign in to
          continue or create a new account.
        </p>

        <div className="flex w-full max-w-sm gap-4 sm:justify-center">
          <Link
            href="/signin"
            className="flex w-1/2 items-center justify-center rounded-full bg-foreground px-6 py-3 text-background font-medium transition-colors hover:opacity-95"
            aria-label="Sign in"
          >
            Sign in
          </Link>

          <Link
            href="/signup"
            className="flex w-1/2 items-center justify-center rounded-full border border-solid border-black/8 px-6 py-3 text-foreground font-medium transition-colors hover:bg-black/4 dark:border-white/[.145]"
            aria-label="Sign up"
          >
            Sign up
          </Link>
        </div>

        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          No account yet? Click Sign up to get started.
        </p>
      </main>
    </div>
  );
}
