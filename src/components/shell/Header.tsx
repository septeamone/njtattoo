"use client";

import { href, sections, type Locale, type Section } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { NjMark, TattooMark } from "../marks/Marks";
import { LangSwitch } from "./LangSwitch";
import { MobileMenu } from "./MobileMenu";
import { SectionLink } from "../ui/SectionLink";
import { TLink } from "./TLink";
import { useActiveSection } from "./useActiveSection";
import s from "./Header.module.css";

export function Header({ lang, nav }: { lang: Locale; nav: Dictionary["nav"] }) {
  const current = useActiveSection();

  return (
    <header className={s.header} data-header>
      <TLink href={href(lang)} className={s.lockup} aria-label={nav.home} data-lockup veil="NJ">
        <span className={s.lockNj} data-lock="nj">
          <NjMark variant="wide" anchor="logo" pulse />
        </span>
        <span className={s.lockTattoo} data-lock="tattoo">
          <TattooMark variant="cond" pulse />
        </span>
      </TLink>

      <nav className={s.nav} aria-label={nav.main}>
        <ul>
          {sections.filter((p: Section) => p !== "contact").map((p: Section) => (
            <li key={p}>
              <SectionLink id={p} className={s.link} aria-current={current === p ? "true" : undefined} data-dot-hover>
                {nav[p]}
              </SectionLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className={s.right}>
        <div className={s.lang}>
          <LangSwitch current={lang} label={nav.languages} />
        </div>
        <SectionLink id="contact" className={s.cta} aria-current={current === "contact" ? "true" : undefined} data-dot-hover>
          {nav.cta}
        </SectionLink>
        <MobileMenu lang={lang} nav={nav} current={current} />
      </div>
    </header>
  );
}
