"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastVariant = "default" | "success" | "error" | "info";

export type ToastOptions = {
  title: string;
  description?: string;
  variant?: ToastVariant;
  durationMs?: number;
};

type Toast = ToastOptions & {
  id: string;
};

type ToastContextValue = {
  toast: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
};

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);
  const timers = React.useRef<Record<string, ReturnType<typeof setTimeout>>>(
    {},
  );

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
    if (timers.current[id]) {
      clearTimeout(timers.current[id]);
      delete timers.current[id];
    }
  }, []);

  const toast = React.useCallback(
    (options: ToastOptions) => {
      const id = crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
      const toast: Toast = {
        id,
        variant: "default",
        durationMs: 4000,
        ...options,
      };
      setToasts((prev) => [...prev, toast]);

      timers.current[id] = setTimeout(() => dismiss(id), toast.durationMs);
      return id;
    },
    [dismiss],
  );

  React.useEffect(() => {
    return () => {
      Object.values(timers.current).forEach(clearTimeout);
    };
  }, []);

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[999] flex w-full max-w-xs flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "pointer-events-auto w-full rounded-lg border px-4 py-3 shadow-lg transition transform",
              toast.variant === "success" &&
                "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-900/60 dark:text-emerald-100",
              toast.variant === "error" &&
                "border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-900/40 dark:bg-rose-900/60 dark:text-rose-100",
              toast.variant === "info" &&
                "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-900/40 dark:bg-blue-900/50 dark:text-blue-100",
              toast.variant === "default" &&
                "border-slate-200 bg-white text-slate-900 dark:border-slate-800/60 dark:bg-slate-950/40 dark:text-slate-100",
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <p className="text-sm font-semibold leading-5">{toast.title}</p>
                {toast.description ? (
                  <p className="text-sm leading-5 text-slate-700 dark:text-slate-200">
                    {toast.description}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                className="rounded p-1 text-slate-500 hover:text-slate-700 dark:text-slate-300 dark:hover:text-slate-100"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}
