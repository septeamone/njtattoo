import type { Dictionary } from "@/i18n/dictionaries";
import { SectionLink } from "../ui/SectionLink";
import { NjMark, TattooMark } from "../marks/Marks";
import { Address } from "../ui/Address";
import { FitLines } from "../ui/FitLines";
import { Phone } from "../ui/Phone";
import { Socials } from "../ui/Socials";
import { IntroMotion } from "./IntroMotion";
import s from "./Intro.module.css";

/**
 * Opening: a poster (NJ. top-left, TATTOO bottom-right — the full stop is the pivot between them),
 * followed by one statement. With scripts and motion enabled the poster is pinned and its two marks
 * dock into the header lockup while the statement opens (see IntroMotion). Without, it is two plain screens.
 */
export function Intro({ d }: { d: Dictionary }) {
  return (
    <section className={s.intro} data-intro aria-labelledby="intro-h">
      <div className={s.stage} data-stage>
        <h1 id="intro-h" className="sr-only">
          NJ.TATTOO
        </h1>

        <div className={s.poster} data-poster>
          <div className={s.slotNj} data-slot="nj">
            <NjMark variant="wide" pulse />
          </div>
          <div className={s.slotTattoo} data-slot="tattoo">
            <TattooMark variant="cond" pulse />
          </div>
          <div className={s.info} data-fade>
            <p className={s.role}>{d.home.role}</p>
            <p className={s.where}>
              {d.home.place}. {d.home.appointment}
            </p>
            <Address d={d} className={s.addr} />
            <p className={s.tel}>
              <Phone />
            </p>
            <div className={s.actions}>
              <SectionLink id="contact" className={s.contact} data-dot-hover>
                {d.nav.cta}
              </SectionLink>
              <Socials d={d} />
            </div>
          </div>
          <p className={s.scroll} data-fade>
            <span aria-hidden="true" className={s.scrollLine} />
            {d.home.scroll}
          </p>
        </div>

        <div className={s.statement} data-statement>
          <div className={s.block}>
            <FitLines lines={d.home.statement.lines} className={s.lines} stop />
            <p className={s.text} data-statement-text>
              {d.home.statement.text}
            </p>
          </div>
        </div>
      </div>
      <IntroMotion />
    </section>
  );
}
