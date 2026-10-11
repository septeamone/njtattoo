import type { Dictionary } from "@/i18n/dictionaries";
import { Stop } from "../ui/Stop";
import s from "./ProcessStrip.module.css";

/** The process on a bone ground. The four steps are a real sequence, so they are numbered. */
export function ProcessStrip({ d }: { d: Dictionary }) {
  return (
    <section id="process" className={s.section} data-tone="light" aria-labelledby="proc-h">
      <div className={s.inner}>
        <h2 id="proc-h" className={s.title}>
          {d.process.title}
          <Stop />
        </h2>
        <ol className={s.steps}>
          {d.process.steps.map((step, i) => (
            <li key={step.name} className={s.step} style={{ "--i": i } as React.CSSProperties}>
              <span className={s.num} aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className={s.name}>{step.name}</h3>
              <p className={s.text}>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
