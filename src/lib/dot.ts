import gsap from "gsap";

/**
 * The live dot — the identity system in one object.
 *
 * Exactly one red dot exists on a page. It lives on the full stop of the logo and visits the full
 * stops that end headings as they come into view; when the pointer or keyboard focus is on a
 * navigational element, it steps beside it. Anchors are plain DOM markers:
 *   [data-dot-anchor="logo"]   the logo's period (home base)
 *   [data-dot-anchor="stop"]   a heading's full stop
 *   [data-dot-anchor="end"]    the closing stop in the footer
 *   [data-dot-hover]           an element the dot steps beside while hovered / focused
 *                              (value "row" = large type: dot scales with the type inside [data-dot-fs])
 * The dot only ever follows these live rects; it never owns layout. Without script the logo's period
 * is red by CSS and everything else stays text-coloured.
 *
 * Arriving at a heading's stop the dot does not fly straight to it: it first drops onto the start of the
 * heading's baseline, then rolls along the letters to the stop (two legs, one gesture).
 */

const BASE = 160; // the dot is drawn at 160px and only ever scaled down, so it stays crisp
const MIN = 7;

type Pos = { x: number; y: number; s: number };

const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b);
const lerp = (a: Pos, b: Pos, t: number): Pos => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, s: a.s + (b.s - a.s) * t });
const outCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const inOutQuad = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
/** share of a rolling flight spent dropping onto the start of the line; the rest is the roll */
const DROP = 0.36;

export class DotController {
  private cur: Pos | null = null;
  private from: Pos = { x: 0, y: 0, s: 0 };
  private prog = { p: 1 };
  private tween: gsap.core.Tween | null = null;
  private targetEl: Element | null = null;
  private visits: Element[] = [];
  private logo: Element | null = null;
  private dirty = true;
  private hover: Element | null = null;
  private visiting: Element | null = null;
  /** the heading (or fitted line) whose letters the dot is rolling along to reach its stop; null for a straight flight */
  private rollHost: Element | null = null;
  private leave = 0;
  private reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  private fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  private mo: MutationObserver;

  constructor(private el: HTMLElement) {
    this.mo = new MutationObserver(() => (this.dirty = true));
  }

  start() {
    document.documentElement.dataset.dot = "live";
    this.mo.observe(document.body, { childList: true, subtree: true });
    gsap.ticker.add(this.tick);
    document.addEventListener("pointerover", this.onOver);
    document.addEventListener("pointerout", this.onOut);
    document.addEventListener("focusin", this.onFocusIn);
    document.addEventListener("focusout", this.onFocusOut);
  }

  stop() {
    gsap.ticker.remove(this.tick);
    this.mo.disconnect();
    this.tween?.kill();
    document.removeEventListener("pointerover", this.onOver);
    document.removeEventListener("pointerout", this.onOut);
    document.removeEventListener("focusin", this.onFocusIn);
    document.removeEventListener("focusout", this.onFocusOut);
    delete document.documentElement.dataset.dot;
  }

  /** Force the next frame to re-read anchors (route changes, late layout). */
  refresh() {
    this.dirty = true;
  }

  // ----- pointer / focus -----
  private setHover(el: Element | null) {
    window.clearTimeout(this.leave);
    if (el) this.hover = el;
    else this.leave = window.setTimeout(() => (this.hover = null), 90);
  }
  private onOver = (e: PointerEvent) => {
    if (!this.fine) return;
    this.setHover((e.target as Element).closest?.("[data-dot-hover]") ?? null);
  };
  private onOut = (e: PointerEvent) => {
    if (!this.fine) return;
    const to = (e.relatedTarget as Element | null)?.closest?.("[data-dot-hover]") ?? null;
    if (!to) this.setHover(null);
  };
  private onFocusIn = (e: FocusEvent) => {
    const t = e.target as HTMLElement;
    if (t.matches?.(":focus-visible")) this.setHover(t.closest("[data-dot-hover]"));
  };
  private onFocusOut = () => this.setHover(null);

  // ----- anchors -----
  private collect() {
    this.dirty = false;
    this.logo = document.querySelector('[data-dot-anchor="logo"]');
    this.visits = [...document.querySelectorAll('[data-dot-anchor="stop"], [data-dot-anchor="end"]')];
    if (this.visiting && !this.visits.includes(this.visiting)) this.visiting = null;
    if (this.hover && !document.contains(this.hover)) this.hover = null;
  }

  private headerH() {
    return (document.querySelector("[data-header]") as HTMLElement | null)?.offsetHeight ?? 72;
  }

  /** An anchor inside a line that is still hidden (opening sequence) must not attract the dot. */
  private shown(el: Element) {
    if (getComputedStyle(el).visibility === "hidden") return false;
    const host = el.closest("[data-fit-inner]");
    return !host || parseFloat(getComputedStyle(host).opacity) > 0.55;
  }

  private pickVisit(): Element | null {
    const vh = innerHeight;
    const hh = this.headerH();
    const inStay = (el: Element) => {
      const r = el.getBoundingClientRect();
      const y = r.top + r.height / 2;
      return r.width > 0 && y > hh + 4 && y < vh * 0.93 && this.shown(el);
    };
    if (this.visiting && inStay(this.visiting)) return this.visiting;
    let best: Element | null = null;
    let bestD = Infinity;
    for (const el of this.visits) {
      const r = el.getBoundingClientRect();
      if (!r.width || !this.shown(el)) continue;
      const y = r.top + r.height / 2;
      // the closing stop in the footer is where the dot comes to rest at the end of the page,
      // so it may be taken from lower on the screen than a heading's stop
      const end = (el as HTMLElement).dataset.dotAnchor === "end";
      if (y > hh + 8 && y < vh * (end ? 0.95 : 0.78)) {
        const d = end ? -1 : Math.abs(y - vh * 0.42);
        if (d < bestD) {
          bestD = d;
          best = el;
        }
      }
    }
    this.visiting = best;
    return best;
  }

  private geom(el: Element, hover: boolean): Pos | null {
    const r = el.getBoundingClientRect();
    if (!r.width && !r.height) return null;
    if (hover) {
      const h = el as HTMLElement;
      const big = h.dataset.dotHover === "row";
      if (big) {
        const fsEl = (h.querySelector("[data-dot-fs]") as HTMLElement | null) ?? h;
        const fr = fsEl.getBoundingClientRect();
        const fs = parseFloat(getComputedStyle(fsEl).fontSize) || 16;
        const s = clamp(fs * 0.17, 10, 34);
        return { x: r.left - s * 1.1 - s / 2, y: fr.top + fr.height * 0.6, s };
      }
      return { x: r.left - 14, y: r.top + r.height / 2, s: MIN };
    }
    // +1.2px: the dot slightly overlaps the period it sits on, so no fringe of the slot shows around it
    return { x: r.left + r.width / 2, y: r.top + r.height / 2, s: Math.max(r.width, MIN) + 1.2 };
  }

  /** Where the roll begins: the left end of the line the stop closes, on the stop's own baseline. Null when the line is too short to roll along. */
  private rollStart(want: Pos): Pos | null {
    const r = this.rollHost!.getBoundingClientRect();
    const x = r.left + want.s / 2;
    return want.x - x > want.s * 4 ? { x, y: want.y, s: want.s } : null;
  }

  // ----- frame -----
  private tick = () => {
    if (this.dirty) this.collect();

    let el: Element | null = null;
    let hover = false;
    if (this.hover) {
      el = this.hover;
      hover = true;
    } else {
      el = this.pickVisit() ?? this.logo;
    }

    const want = el ? this.geom(el, hover) : null;
    if (!want) {
      this.el.style.opacity = "0";
      return;
    }

    if (!this.cur) {
      this.cur = { ...want };
      this.targetEl = el;
    } else if (el !== this.targetEl) {
      this.from = { ...this.cur };
      this.targetEl = el;
      this.prog.p = 0;
      this.tween?.kill();
      const node = el as Element; // want is only set for a real element
      const stop = !hover && (node as HTMLElement).dataset.dotAnchor === "stop";
      this.rollHost = stop ? node.closest("[data-fit-inner], h1, h2, h3") : null;
      this.tween = gsap.to(this.prog, {
        p: 1,
        duration: this.reduced ? 0.001 : hover ? 0.4 : this.rollHost ? 1.8 : 0.9,
        // fast departure, soft landing: the flight reads as a gesture, not as a glide that stalls at the end
        // (a rolling flight shapes its two legs itself, see below)
        ease: this.rollHost ? "none" : hover ? "power3.out" : "power4.out",
      });
    }

    if (this.prog.p < 1) {
      const p = this.prog.p;
      const start = this.rollHost && !this.reduced ? this.rollStart(want) : null;
      if (start) {
        this.cur = p < DROP ? lerp(this.from, start, outCubic(p / DROP)) : lerp(start, want, inOutQuad((p - DROP) / (1 - DROP)));
      } else {
        this.cur = lerp(this.from, want, this.rollHost ? outCubic(p) : p);
      }
    } else {
      this.cur = want;
    }

    const { x, y, s } = this.cur;
    this.el.style.transform = `translate3d(${x - s / 2}px, ${y - s / 2}px, 0) scale(${s / BASE})`;
    this.el.style.opacity = "1";
  };
}
