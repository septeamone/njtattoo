"use client";

import { createContext, useContext } from "react";
import type { Locale } from "@/i18n/config";

type ShellValue = {
  lang: Locale;
  /** Navigate with the page transition (falls back to a plain push). */
  go: (href: string, label?: string) => void;
};

export const ShellContext = createContext<ShellValue | null>(null);

export function useShell() {
  const v = useContext(ShellContext);
  if (!v) throw new Error("useShell outside <Shell>");
  return v;
}
