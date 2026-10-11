"use client";

import { useEffect, useRef } from "react";
import { DotController } from "@/lib/dot";
import s from "./Dot.module.css";

/** The one live red dot (see lib/dot.ts). Decorative: hidden from assistive technology. */
export function Dot() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const c = new DotController(el);
    c.start();
    return () => c.stop();
  }, []);
  return <div ref={ref} className={s.dot} aria-hidden="true" />;
}
