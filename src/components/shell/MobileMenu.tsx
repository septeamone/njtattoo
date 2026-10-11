"use client";

import { useEffect, useRef, useState } from "react";
import { sections, type Locale, type Section } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { LangSwitch } from "./LangSwitch";
import { SectionLink } from "../ui/SectionLink";
import s from "./MobileMenu.module.css";

type Props = { lang: Locale; nav: Dictionary["nav"]; current?: Section | null };

export function MobileMenu({ lang, nav, current }: Props) {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const main = document.getElementById("main");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    document.documentElement.dataset.menu = "open";
    main?.setAttribute("inert", "");
    panel.current?.querySelector("a")?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      delete document.documentElement.dataset.menu;
      main?.removeAttribute("inert");
    };
  }, [open]);

  return (
    <div className={s.root}>
      <button
        ref={toggle}
        type="button"
        className={s.toggle}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((o) => !o)}
      >
        {open ? nav.close : nav.menu}
      </button>
      <div ref={panel} id="mobile-menu" className={`${s.panel} ${open ? s.open : ""}`} inert={!open}>
        <ul className={s.list}>
          {sections.map((p) => (
            <li key={p}>
              <SectionLink id={p} className={s.link} aria-current={current === p ? "true" : undefined} onClick={() => setOpen(false)}>
                {nav[p]}
              </SectionLink>
            </li>
          ))}
        </ul>
        <div className={s.lang}>
          <LangSwitch current={lang} label={nav.languages} />
        </div>
      </div>
    </div>
  );
}
