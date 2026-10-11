import type { Dictionary } from "@/i18n/dictionaries";
import { FitLines } from "../ui/FitLines";
import s from "./Artist.module.css";

/** The artist: one statement set to full width, then the two plain facts. The way to reach them is the next section. */
export function Artist({ d }: { d: Dictionary }) {
  return (
    <section id="artist" className={s.section} aria-label={d.nav.artist}>
      <div className={s.block}>
        <FitLines lines={d.artist.lines} className={s.lines} stop />
        <p className={s.text}>{d.artist.text}</p>
        <dl className={s.dl}>
          {d.artist.ledger.map((row) => (
            <div key={row.k} className={s.item}>
              <dt className={s.k}>{row.k}</dt>
              <dd className={s.v}>{row.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
