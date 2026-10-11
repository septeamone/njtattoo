"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { ShellContext } from "./context";
import { Dot } from "./Dot";
import { Header } from "./Header";
import { Veil, type VeilHandle } from "./Veil";

gsap.registerPlugin(ScrollTrigger);

const HOME = /^\/(en|kr|ru)\/?$/;

export function Shell({ lang, nav, children }: { lang: Locale; nav: Dictionary["nav"]; children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const veil = useRef<VeilHandle>(null);
  const busy = useRef(false);
  const waiting = useRef(false);
  const current = useRef(pathname);
  /** the destination of the latest click while the veil is closing: the last click wins */
  const target = useRef<string | null>(null);
  const [announce, setAnnounce] = useState("");

  // ----- page transition -----
  const go = useCallback(
    (href: string, label?: string) => {
      const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (href === current.current && !busy.current) {
        window.scrollTo({ top: 0 });
        return;
      }
      if (reduced || !veil.current) {
        router.push(href);
        return;
      }
      target.current = href;
      if (busy.current) {
        // a transition is already under way: just retarget it (and update the word on the veil)
        veil.current.relabel(label ?? "");
        return;
      }
      busy.current = true;
      veil.current.cover(label ?? "").then(() => {
        const next = target.current ?? href;
        if (next === current.current) {
          // the visitor changed their mind back to the page they are on: nothing to load
          target.current = null;
          veil.current?.reveal().then(() => (busy.current = false));
          return;
        }
        waiting.current = true;
        router.push(next);
        // if the new page never arrives (network), do not leave the visitor under the veil
        window.setTimeout(() => {
          if (waiting.current) {
            waiting.current = false;
            busy.current = false;
            veil.current?.reveal();
          }
        }, 6000);
      });
    },
    [router],
  );
  const value = useMemo(() => ({ lang, go }), [lang, go]);

  // ----- route change: html flags, scroll to top under the veil, focus, reveal -----
  useEffect(() => {
    const first = current.current === pathname && !waiting.current;
    current.current = pathname;
    const root = document.documentElement;
    const home = HOME.test(pathname);
    root.dataset.home = home ? "1" : "0";
    root.dataset.top = home && window.scrollY < 8 ? "1" : "0";
    if (!home) root.dataset.dock = "ready";
    if (waiting.current) {
      waiting.current = false;
      target.current = null;
      window.scrollTo({ top: 0 });
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          ScrollTrigger.refresh();
          // keyboard and screen-reader users land at the new page, not on the link they used
          const main = document.getElementById("main");
          if (main) {
            main.tabIndex = -1;
            main.focus({ preventScroll: true });
          }
          setAnnounce(document.title);
          veil.current?.reveal().then(() => (busy.current = false));
        }),
      );
    } else if (!first) {
      setAnnounce(document.title);
    }
  }, [pathname]);

  // ----- header: transparent over the opening poster, tone follows light sections -----
  useEffect(() => {
    const root = document.documentElement;
    const onScroll = () => {
      root.dataset.top = HOME.test(location.pathname.slice((process.env.NEXT_PUBLIC_BASE ?? "").length)) && window.scrollY < 8 ? "1" : "0";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const header = document.querySelector<HTMLElement>("[data-header]");
    if (!header) return;
    const triggers: ScrollTrigger[] = [];
    const raf = requestAnimationFrame(() => {
      document.querySelectorAll<HTMLElement>('[data-tone="light"]').forEach((el) => {
        triggers.push(
          ScrollTrigger.create({
            trigger: el,
            start: "top 36px",
            end: "bottom 36px",
            onToggle: (self) => {
              header.dataset.tone = self.isActive ? "light" : "dark";
            },
          }),
        );
      });
    });
    header.dataset.tone = "dark";
    return () => {
      cancelAnimationFrame(raf);
      triggers.forEach((t) => t.kill());
    };
  }, [pathname]);

  return (
    <ShellContext.Provider value={value}>
      <a className="skip" href="#main">
        {nav.skip}
      </a>
      <Header lang={lang} nav={nav} />
      {children}
      <Veil ref={veil} />
      <Dot />
      <div className="sr-only" role="status" aria-live="polite">
        {announce}
      </div>
    </ShellContext.Provider>
  );
}
