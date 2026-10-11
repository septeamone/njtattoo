import { styleVoices, voiceWeight } from "@/content/styles";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { Stop } from "../ui/Stop";
import { RibbonMotion } from "./RibbonMotion";
import s from "./StyleRibbon.module.css";

/**
 * Twenty styles as two lanes of type that travel in opposite directions, driven only by the scroll
 * (nothing runs on its own). Whatever name sits on the centre line is at full weight; the rest thin out
 * as they leave it. Big lane = ten names, small lane = the other ten, so scale carries the contrast.
 *
 * The list below the lanes is the real content: all twenty names, always visible, in reading order.
 * The lanes are decoration for it. Without script, with reduced motion or on a short window the lanes
 * are not shown and the list itself is set as a large block of type.
 */
export function StyleRibbon({ lang, d }: { lang: Locale; d: Dictionary }) {
  const lane = (from: number, to: number, key: string) => (
    <div className={s.lane} data-lane={key}>
      {d.styles.slice(from, to).map((x, k) => (
        <span key={x.id} className={s.w} data-i={from + k} data-wdth={styleVoices[from + k].wdth} style={{ fontStretch: `${styleVoices[from + k].wdth}%` }}>
          {x.name}
        </span>
      ))}
    </div>
  );
  return (
    <section id="styles" className={s.section} aria-labelledby="styles-h" data-ribbon="off">
      <div className={s.stage}>
        <header className={s.head}>
          <h2 id="styles-h" className={s.title}>
            {d.home.stylesTitle}
            <Stop />
          </h2>
          <p className={s.note}>{d.home.stylesNote}</p>
        </header>
        <div className={s.lanes} aria-hidden="true">
          {lane(0, 10, "a")}
          {lane(10, 20, "b")}
        </div>
        <ul className={s.index} aria-label={d.home.stylesList}>
          {d.styles.map((x, i) => (
            <li key={x.id} data-i={i} data-name={x.name} style={{ fontWeight: voiceWeight(styleVoices[i].wght, lang), fontStretch: `${styleVoices[i].wdth}%` }}>
              {x.name}
            </li>
          ))}
        </ul>
      </div>
      <RibbonMotion />
    </section>
  );
}
