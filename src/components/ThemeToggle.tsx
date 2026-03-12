"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();

  // Render a button even before the theme is resolved so the markup
  // matches between server and client. The icon remains invisible until
  // hydration completes, avoiding mismatch errors.
  const themeReady = resolvedTheme !== undefined;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() =>
        setTheme(themeReady && resolvedTheme === "dark" ? "light" : "dark")
      }
      aria-label="Toggle theme"
      className={
        themeReady
          ? resolvedTheme === "dark"
            ? "bg-white text-black"
            : "bg-black text-white"
          : "opacity-0"
      } // hide until ready and invert colors by theme
    >
      {themeReady ? (
        resolvedTheme === "dark" ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4 text-white" />
        )
      ) : (
        // placeholder element of same size keeps structure stable
        <Sun className="h-4 w-4 opacity-0" />
      )}
    </Button>
  );
}
