import type { Dictionary } from "@/i18n/dictionaries";
import { FooterMark } from "../marks/Marks";
import { SectionLink } from "../ui/SectionLink";
import { Socials } from "../ui/Socials";
import s from "./Footer.module.css";

export function Footer({ d }: { d: Dictionary }) {
  return (
    <footer className={s.footer}>
      <div className={s.inner}>
        <div className={s.mark} role="img" aria-label="NJ.TATTOO">
          <FooterMark />
        </div>
        <div className={s.row}>
          <p>{d.footer.base}</p>
          <p>{d.footer.rights}</p>
          <Socials d={d} className={s.socials} />
          <SectionLink id="main" className={s.top} data-dot-hover>
            {d.footer.top}
          </SectionLink>
        </div>
      </div>
    </footer>
  );
}
