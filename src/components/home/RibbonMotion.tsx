"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);
const ease = (t: number) => t * t * (3 - 2 * t);

/**
 * Scroll drives two lanes of the twenty styles in opposite directions (the section is pinned by CSS sticky).
 * Lane A starts with its first name on the centre line and ends with its last; lane B runs the other way.
 * The name on the centre line is at weight 900; weight and opacity fall off with the distance from it.
 * Each name sits in a slot as wide as its heaviest state, so the lane never jitters while weights change.
 * Positions come from cached measurements, not from layout reads in the scroll handler.
 */
export function RibbonMotion() {
  useLayoutEffect(() => {
    const section = document.querySelector<HTMLElement>("[data-ribbon]");
    if (!section) return;
    const laneEls = [...section.querySelectorAll<HTMLElement>("[data-lane]")];
    const lanesEl = laneEls[0]?.parentElement;
    const items = [...section.querySelectorAll<HTMLElement>("ul li[data-i]")];
    const stage = section.firstElementChild as HTMLElement | null;
    if (!lanesEl || !stage || laneEls.length !== 2) return;

    // remember where the visitor is inside the section, so a flip between pinned and static form (phone rotated,
    // window resized) puts them back at the same place instead of at the footer or the top
    let place: number | null = null;
    const track = () => {
      const top = section.getBoundingClientRect().top + scrollY;
      place = scrollY >= top && scrollY <= top + section.offsetHeight ? (scrollY - top) / section.offsetHeight : null;
    };
    const QUERY = "(prefers-reduced-motion: no-preference) and (min-height: 621px)";
    const mq = matchMedia(QUERY);
    const restore = () => {
      const keep = place;
      if (keep === null) return;
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          ScrollTrigger.refresh();
          scrollTo(0, section.getBoundingClientRect().top + scrollY + keep * section.offsetHeight);
        }),
      );
    };
    window.addEventListener("scroll", track, { passive: true });
    mq.addEventListener("change", restore);
    track();

    const mm = gsap.matchMedia();
    mm.add(QUERY, () => {
      section.dataset.ribbon = "on";
      const lanes = laneEls.map((el, li) => ({
        el,
        reverse: li === 1,
        words: [...el.querySelectorAll<HTMLElement>("[data-i]")],
        centers: [] as number[],
      }));
      let vc = 0;
      let reach = 1;
      let active = new Set<number>();
      let p = 0;

      const measure = () => {
        const W = lanesEl.getBoundingClientRect().width;
        let big = 0;
        for (const l of lanes) {
          const slots = () => {
            l.el.style.transform = "none";
            for (const w of l.words) {
              w.style.fontWeight = "500";
              w.style.fontStretch = `${w.dataset.wdth}%`;
              w.style.width = "";
            }
            return l.words.map((w) => w.getBoundingClientRect().width);
          };
          l.el.style.fontSize = "";
          let size = parseFloat(getComputedStyle(l.el).fontSize);
          // the small lane stays about half the big one, whatever the language does to the big one
          if (big) {
            size = Math.min(size, big * 0.52);
            l.el.style.fontSize = `${size}px`;
          }
          let widths = slots();
          // a long name (Russian ones are) must still fit the screen at full weight: scale the lane down to it
          const widest = Math.max(...widths) * 1.12;
          if (widest > W * 0.9) {
            size = (size * W * 0.9) / widest;
            l.el.style.fontSize = `${size}px`;
            widths = slots();
          }
          if (!big) big = size;
          l.words.forEach((w, i) => (w.style.width = `${widths[i]}px`));
          const gap = parseFloat(getComputedStyle(l.el).columnGap) || 0;
          let x = 0;
          l.centers = widths.map((wd) => {
            const c = x + wd / 2;
            x += wd + gap;
            return c;
          });
        }
        vc = W / 2;
        reach = Math.min(W * 0.4, (lanes[0].centers[1] - lanes[0].centers[0]) * 0.9);
      };
      // weight steps of 25 and width traded against weight (heavier = narrower), so a name keeps its slot
      const apply = (w: HTMLElement, f: number) => {
        const wght = Math.round((150 + 750 * f) / 25) * 25;
        if (w.dataset.wg === String(wght)) return;
        w.dataset.wg = String(wght);
        w.style.fontWeight = String(wght);
        w.style.fontStretch = `${Math.max(62, Number(w.dataset.wdth) * (1 - 0.12 * f)).toFixed(1)}%`;
        w.style.opacity = (0.52 + 0.48 * f).toFixed(2);
      };
      const render = () => {
        const next = new Set<number>();
        for (const l of lanes) {
          const t = l.reverse ? 1 - p : p;
          const first = l.centers[0];
          const last = l.centers[l.centers.length - 1];
          const x = vc - (first + (last - first) * t);
          l.el.style.transform = `translate3d(${x.toFixed(1)}px,0,0)`;
          let best = -1;
          let bestD = Infinity;
          l.words.forEach((w, i) => {
            const d = Math.abs(x + l.centers[i] - vc);
            if (d < vc * 2.2) apply(w, 1 - ease(clamp01(d / reach)));
            if (d < bestD) {
              bestD = d;
              best = Number(w.dataset.i);
            }
          });
          next.add(best);
        }
        if (next.size !== active.size || [...next].some((i) => !active.has(i))) {
          active = next;
          for (const li of items) {
            if (active.has(Number(li.dataset.i))) li.setAttribute("data-on", "");
            else li.removeAttribute("data-on");
          }
        }
      };
      const run = () => section.offsetHeight - stage.offsetHeight;

      measure();
      render();
      const st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${run()}`,
        scrub: 0.35,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          p = self.progress;
          render();
        },
      });
      const remeasure = () => {
        for (const l of lanes) for (const w of l.words) delete w.dataset.wg;
        measure();
        render();
      };
      ScrollTrigger.addEventListener("refresh", remeasure);
      document.fonts.ready.then(() => ScrollTrigger.refresh());

      return () => {
        ScrollTrigger.removeEventListener("refresh", remeasure);
        st.kill();
        for (const l of lanes) {
          l.el.removeAttribute("style");
          for (const w of l.words) w.removeAttribute("style");
        }
        for (const li of items) li.removeAttribute("data-on");
        section.dataset.ribbon = "off";
      };
    });
    return () => {
      window.removeEventListener("scroll", track);
      mq.removeEventListener("change", restore);
      mm.revert();
    };
  }, []);
  return null;
}
