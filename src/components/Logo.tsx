"use client";

import { Poppins } from "next/font/google";
import Link from "next/link";

const poppins = Poppins({
  weight: ["700", "800"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

interface LogoProps {
  size?: "sm" | "md" | "lg";
  href?: string;
}

export default function Logo({ size = "md", href = "/" }: LogoProps) {
  const sizeClasses = {
    sm: "text-lg font-bold",
    md: "text-2xl font-bold",
    lg: "text-4xl font-bold",
  };

  const content = (
    <span
      className={`${poppins.variable} font-[--font-poppins] tracking-tight text-neutral-900 dark:text-neutral-50 ${sizeClasses[size]}`}
    >
      🏋️ Diet Buddy
    </span>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
