import { contacts } from "@/content/contacts";
import type { Dictionary } from "@/i18n/dictionaries";
import { Address } from "../ui/Address";
import { Icon, type IconName } from "../ui/Icon";
import { Phone } from "../ui/Phone";
import { Stop } from "../ui/Stop";
import s from "./Contact.module.css";

/**
 * Contact. WhatsApp, Telegram and Instagram are live links; KakaoTalk is on the same number and is a link once the artist gives
 * one (contacts.kakao), until then plain text rather than a button that pretends to work. The phone is set huge as a tel: link in the colour of the dot. No form. Below: where the studio is, with the map.
 */
const meta: Record<string, string> = {
  whatsapp: contacts.whatsapp.replace("https://", ""),
  telegram: contacts.telegramHandle,
  instagram: contacts.instagramHandle,
};

export function Contact({ d }: { d: Dictionary }) {
  return (
    <section id="contact" className={s.page} aria-labelledby="contact-h">
      <header className={s.head}>
        <h2 id="contact-h" className={s.title}>
          {d.contact.title}
          <Stop />
        </h2>
        <p className={s.lead}>{d.contact.lead}</p>
      </header>

      <div className={s.call}>
        <Phone className={s.number} />
      </div>

      <ul className={s.list}>
        {d.contact.channels.map((c) => {
          const live = { whatsapp: contacts.whatsapp, telegram: contacts.telegram, instagram: contacts.instagram, kakao: contacts.kakao }[c.id as "whatsapp"];
          const inner = (
            <>
              <Icon name={c.id as IconName} className={s.glyph} />
              <span className={s.label}>{c.name}</span>
            </>
          );
          return (
            <li key={c.id} className={s.row}>
              {live ? (
                <a href={live} className={s.name} target="_blank" rel="noopener noreferrer" data-dot-hover="row">
                  {inner}
                </a>
              ) : (
                <span className={`${s.name} ${s.plain}`}>{inner}</span>
              )}
              <span className={s.meta}>
                {c.id === "kakao" ? (
                  <span className={s.same}>{contacts.kakao ? contacts.phone : d.contact.sameNumber}</span>
                ) : (
                  <span dir="ltr">{meta[c.id]}</span>
                )}
              </span>
            </li>
          );
        })}
      </ul>

      <section className={s.where} aria-labelledby="where-h">
        <h2 id="where-h" className={s.whereTitle}>
          {d.contact.where}
        </h2>
        <div className={s.whereBody}>
          <p className={s.city}>{d.contact.base}</p>
          <Address d={d} className={s.address} />
          <p className={s.langs}>{d.contact.languages}</p>
        </div>
      </section>
    </section>
  );
}
