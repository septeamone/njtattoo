"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

type Box = { left: number; top: number; width: number; height: number };

const box = (el: Element, origin?: DOMRect): Box => {
  const r = el.getBoundingClientRect();
  return { left: r.left - (origin?.left ?? 0), top: r.top - (origin?.top ?? 0), width: r.width, height: r.height };
};
const mix = (a: Box, b: Box, t: number): Box => ({
  left: a.left + (b.left - a.left) * t,
  top: a.top + (b.top - a.top) * t,
  width: a.width + (b.width - a.width) * t,
  height: a.height + (b.height - a.height) * t,
});
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * The opening sequence, driven by scroll (scrub, no smoothing).
 *
 *  0 – 46%   the two marks of the poster travel into the header and become the logo; the poster's
 *            small texts leave. The live dot stays on NJ's full stop the whole way.
 * 36 – 80%   the statement opens line by line: each line starts condensed and widens to its fitted width.
 * 70 – 90%   the sentence below it appears. Then it holds.
 *
 * The marks are not copies: the header's own logo pieces are lifted to the poster's position and set
 * down again, so there is one logo, one full stop, one dot. Size changes through width/height (not a CSS
 * scale), so the vector stays sharp at every step.
 */
// On a short window (a phone held sideways, a browser zoomed to 200%) three huge lines plus the sentence
// cannot fit one pinned screen, so the sequence does not run: poster and statement are two plain screens.
const SHORT = "(max-height: 620px)";

export function IntroMotion() {
  const [enabled, setEnabled] = useState(() => typeof window === "undefined" || !matchMedia(SHORT).matches);
  useLayoutEffect(() => {
    const mq = matchMedia(SHORT);
    const on = () => setEnabled(!mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  useLayoutEffect(() => {
    const root = document.documentElement;
    const intro = document.querySelector<HTMLElement>("[data-intro]");
    const stage = intro?.querySelector<HTMLElement>("[data-stage]");
    const lockNj = document.querySelector<HTMLElement>('[data-lock="nj"]');
    const lockTt = document.querySelector<HTMLElement>('[data-lock="tattoo"]');
    const slotNj = intro?.querySelector<HTMLElement>('[data-slot="nj"]');
    const slotTt = intro?.querySelector<HTMLElement>('[data-slot="tattoo"]');
    const statement = intro?.querySelector<HTMLElement>("[data-statement]");
    if (!intro || !stage || !lockNj || !lockTt || !slotNj || !slotTt || !statement) return;

    if (!enabled || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.dataset.dock = "ready";
      return;
    }

    root.dataset.seq = "on";
    const lines = [...intro.querySelectorAll<HTMLElement>("[data-fit-inner]")];
    const text = intro.querySelector<HTMLElement>("[data-statement-text]");
    const fades = [...intro.querySelectorAll<HTMLElement>("[data-fade]")];
    const dock = { p: 0 };
    let head: { nj: Box; tt: Box } | null = null;
    let slots: { nj: Box; tt: Box } | null = null;

    const release = () => {
      for (const el of [lockNj, lockTt]) el.removeAttribute("style");
    };
    const measure = () => {
      release();
      head = { nj: box(lockNj), tt: box(lockTt) };
      const st = stage.getBoundingClientRect();
      // slot positions relative to the pinned stage (which sits at the viewport origin while pinned)
      slots = { nj: box(slotNj, st), tt: box(slotTt, st) };
    };
    const place = (el: HTMLElement, from: Box, to: Box, t: number) => {
      const b = mix(from, to, t);
      el.style.cssText = `position:fixed;left:${b.left}px;top:${b.top}px;width:${b.width}px;height:${b.height}px;transform:none`;
    };
    const apply = () => {
      if (!head || !slots) return;
      if (dock.p >= 0.999) {
        release();
        return;
      }
      const t = ease(dock.p);
      place(lockNj, slots.nj, head.nj, t);
      place(lockTt, slots.tt, head.tt, t);
    };
    measure();
    apply();
    root.dataset.dock = "ready";

    const run = () => intro.offsetHeight - stage.offsetHeight;
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: intro,
        start: "top top",
        end: () => `+=${run()}`,
        scrub: true,
        invalidateOnRefresh: true,
      },
    });
    tl.to(dock, { p: 1, duration: 0.46, onUpdate: apply }, 0)
      .to(fades, { opacity: 0, duration: 0.18 }, 0)
      .set(statement, { visibility: "visible" }, 0.34);
    lines.forEach((el, i) => {
      tl.fromTo(
        el,
        { opacity: 0, fontStretch: "62%" },
        {
          opacity: 1,
          fontStretch: () => `${el.dataset.stretch ?? 100}%`,
          duration: 0.24,
          ease: "power2.out",
        },
        0.36 + i * 0.1,
      );
    });
    if (text) tl.fromTo(text, { opacity: 0 }, { opacity: 1, duration: 0.16 }, 0.72);

    const onRefresh = () => {
      measure();
      apply();
    };
    ScrollTrigger.addEventListener("refreshInit", release);
    ScrollTrigger.addEventListener("refresh", onRefresh);
    let t = 0;
    const onFit = () => {
      window.clearTimeout(t);
      t = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    };
    window.addEventListener("nj:fit", onFit);
    document.fonts.ready.then(() => ScrollTrigger.refresh());

    return () => {
      window.removeEventListener("nj:fit", onFit);
      window.clearTimeout(t);
      ScrollTrigger.removeEventListener("refreshInit", release);
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      tl.scrollTrigger?.kill();
      tl.kill();
      release();
      gsap.set([...lines, ...fades, ...(text ? [text] : [])], { clearProps: "all" });
      delete root.dataset.seq;
    };
  }, [enabled]);

  return null;
}
