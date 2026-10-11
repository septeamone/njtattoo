import { studio } from "@/content/studio";
import type { Dictionary } from "@/i18n/dictionaries";
import { Icon } from "./Icon";
import s from "./Address.module.css";

/**
 * The studio address, always in English and Korean (a taxi driver reads one, a visitor the other), in the colour of the dot.
 * It is one link to Naver Map, marked with the Naver glyph. `hint` also prints the "Open in Naver Map" line;
 * otherwise it is for screen readers only.
 */
export function Address({ d, hint = false, className = "" }: { d: Dictionary; hint?: boolean; className?: string }) {
  return (
    <a
      className={`${s.address} ${className}`}
      href={studio.mapUrl}
      target="_blank"
      rel="noopener noreferrer"
      data-dot-hover
    >
      <Icon name="naver" className={s.icon} />
      <span className={s.text}>
        <span lang="en" className={s.en}>
          {studio.addressEn}
        </span>
        <span lang="ko" className={s.ko}>
          {studio.addressKo}
        </span>
        <span className={hint ? s.hint : "sr-only"}>
          {d.contact.map}
          <span className="sr-only"> {d.contact.mapNew}</span>
        </span>
      </span>
    </a>
  );
}
