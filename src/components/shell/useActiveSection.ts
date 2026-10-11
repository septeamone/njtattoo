"use client";

import { useEffect, useState } from "react";
import { sections, type Section } from "@/i18n/config";

/** The section of the landing that crosses the middle of the window (null over the opening). */
export function useActiveSection(): Section | null {
  const [active, setActive] = useState<Section | null>(null);
  useEffect(() => {
    const els = sections.map((id) => document.getElementById(id)).filter((e): e is HTMLElement => !!e);
    const seen = new Map<string, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) seen.set(e.target.id, e.isIntersecting);
        setActive(sections.find((id) => seen.get(id)) ?? null);
      },
      // a thin band across the middle of the window: only the section under it counts
      { rootMargin: "-50% 0px -50% 0px" },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);
  return active;
}
