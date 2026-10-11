"use client";

import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";
import s from "./LangSwitch.module.css";

const labels: Record<Locale, string> = { en: "EN", kr: "KR", ru: "RU" };
const names: Record<Locale, string> = { en: "English", kr: "한국어", ru: "Русский" };

/**
 * Same page in the other languages. Plain <a>: a language change is a new document
 * (<html lang>, fonts, hyphenation), not a soft navigation.
 */
export function LangSwitch({ current, label }: { current: Locale; label: string }) {
  const pathname = usePathname();
  const rest = pathname.split("/").slice(2).filter(Boolean).join("/");
  return (
    <ul className={s.list} aria-label={label}>
      {locales.map((l) => (
        <li key={l}>
          <a
            href={`${process.env.NEXT_PUBLIC_BASE}/${l}/${rest ? `${rest}/` : ""}`}
            lang={l === "kr" ? "ko" : l}
            hrefLang={l === "kr" ? "ko" : l}
            aria-current={l === current ? "true" : undefined}
            aria-label={names[l]}
            className={s.link}
            data-dot-hover
          >
            {labels[l]}
          </a>
        </li>
      ))}
    </ul>
  );
}
