"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { fitLines } from "@/lib/fit";
import { Stop } from "./Stop";
import s from "./FitLines.module.css";

// useLayoutEffect on the client (fits before paint), plain effect during SSR
const useIso = typeof window === "undefined" ? useEffect : useLayoutEffect;

type Props = {
  lines: readonly string[];
  className?: string;
  /** element type for the block; the lines inside are always spans */
  as?: "p" | "h1" | "h2" | "div";
  align?: "left" | "right";
  /** A final full stop is drawn as the live dot's circle (the sentence is a heading-like statement). */
  stop?: boolean;
};

/** A block of lines, each fitted to the container width by `font-stretch` (see lib/fit.ts). */
export function FitLines({ lines, className, as: Tag = "p", align = "left", stop = false }: Props) {
  const ref = useRef<HTMLElement>(null);

  useIso(() => {
    const root = ref.current;
    if (!root) return;
    const run = () => {
      fitLines(root);
      window.dispatchEvent(new Event("nj:fit"));
    };
    run();
    const ro = new ResizeObserver(() => run());
    ro.observe(root);
    document.fonts.ready.then(run);
    return () => ro.disconnect();
  }, [lines]);

  return (
    <Tag
      ref={ref as never}
      className={`${s.block} ${align === "right" ? s.right : ""} ${className ?? ""}`}
      data-fit="pending"
      data-fit-block
    >
      {lines.map((l, i) => {
        const end = stop && i === lines.length - 1 && l.endsWith(".");
        return (
          <span key={l} className={s.line} data-fit-line>
            <span className={s.inner} data-fit-inner>
              {end ? l.slice(0, -1) : l}
              {end && <Stop />}
            </span>
          </span>
        );
      })}
    </Tag>
  );
}
