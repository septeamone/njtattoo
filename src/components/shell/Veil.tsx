"use client";

import gsap from "gsap";
import { forwardRef, useImperativeHandle, useRef } from "react";
import s from "./Veil.module.css";

export type VeilHandle = {
  /** Wipe up over the page and show the destination's name. Resolves when fully covered. */
  cover: (label: string) => Promise<void>;
  /** Change the word on the veil while it is closing (the visitor clicked another link). */
  relabel: (label: string) => void;
  /** Wipe off to the top, revealing the new page. */
  reveal: () => Promise<void>;
};

/** Page transition: one sunken-black panel that wipes up over the page and off again (≈ 1 s in total). */
export const Veil = forwardRef<VeilHandle>(function Veil(_, ref) {
  const panel = useRef<HTMLDivElement>(null);
  const word = useRef<HTMLSpanElement>(null);
  const wrap = useRef<HTMLSpanElement>(null);

  useImperativeHandle(ref, () => ({
    cover(text) {
      return new Promise<void>((resolve) => {
        if (word.current) word.current.textContent = text;
        gsap.set(panel.current, { clipPath: "inset(100% 0% 0% 0%)", visibility: "visible" });
        gsap.set(wrap.current, { yPercent: 40, opacity: 0 });
        gsap
          .timeline({ onComplete: resolve })
          .to(panel.current, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.45, ease: "power3.inOut" }, 0)
          .to(wrap.current, { yPercent: 0, opacity: 1, duration: 0.4, ease: "power3.out" }, 0.14);
      });
    },
    relabel(text) {
      if (word.current) word.current.textContent = text;
    },
    reveal() {
      return new Promise<void>((resolve) => {
        gsap.to(panel.current, {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: 0.5,
          ease: "power3.inOut",
          delay: 0.06,
          onComplete: () => {
            gsap.set(panel.current, { visibility: "hidden" });
            resolve();
          },
        });
      });
    },
  }));

  return (
    <div ref={panel} className={s.panel} aria-hidden="true">
      <span ref={wrap} className={s.label}>
        <span ref={word} />
        <i className={s.stop} />
      </span>
    </div>
  );
});
