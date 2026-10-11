import { contacts } from "@/content/contacts";
import { studio } from "@/content/studio";
import type { Dictionary } from "@/i18n/dictionaries";
import { Icon, type IconName } from "./Icon";
import s from "./Socials.module.css";

/** A short row of the live channels as glyphs: Instagram, WhatsApp, Telegram, Naver Map. Each is a 44px target with a spoken name. */
export function Socials({ d, className = "" }: { d: Dictionary; className?: string }) {
  const name = (id: string) => d.contact.channels.find((c) => c.id === id)?.name ?? id;
  const items: { icon: IconName; href: string; label: string }[] = [
    { icon: "instagram", href: contacts.instagram, label: name("instagram") },
    { icon: "whatsapp", href: contacts.whatsapp, label: name("whatsapp") },
    { icon: "telegram", href: contacts.telegram, label: name("telegram") },
    { icon: "naver", href: studio.mapUrl, label: d.contact.map },
  ];
  return (
    <ul className={`${s.socials} ${className}`}>
      {items.map((x) => (
        <li key={x.icon}>
          <a href={x.href} className={s.link} target="_blank" rel="noopener noreferrer" data-dot-hover>
            <Icon name={x.icon} className={s.glyph} />
            <span className="sr-only">{x.label}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
