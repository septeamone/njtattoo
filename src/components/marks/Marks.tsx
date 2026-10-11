import { marks } from "./paths";
import s from "./Marks.module.css";

type NjProps = {
  variant?: "wide" | "cond";
  /** Marks this period as the logo's resting place for the live dot. */
  anchor?: "logo" | "end";
  /** Breathes softly toward the brand red (the hero and the header logo). */
  pulse?: boolean;
  className?: string;
};

/** A red copy of the letters laid over them; only its opacity moves, so it works on dark and on light ground. */
function Breath({ x, paths }: { x: number; paths: readonly string[] }) {
  return (
    <g transform={`translate(${x} 0)`} className={s.breath} fill="var(--needle)">
      {paths.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </g>
  );
}

/** "NJ" cut from Archivo with a true circular full stop (see scripts/build-marks.py). */
export function NjMark({ variant = "wide", anchor, pulse, className }: NjProps) {
  const m = variant === "wide" ? marks.njWide : marks.njCond;
  return (
    <svg className={`${s.svg} ${className ?? ""}`} viewBox={`0 0 ${m.total} 700`} aria-hidden="true" focusable="false">
      <g transform={`translate(${m.x} 0)`} fill="currentColor">
        {m.paths.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
      {pulse && <Breath x={m.x} paths={m.paths} />}
      <circle
        className={anchor === "logo" ? s.slotLogo : s.slot}
        data-dot-anchor={anchor}
        cx={m.dot.cx}
        cy={m.dot.cy}
        r={m.dot.r}
      />
    </svg>
  );
}

/** "TATTOO" in condensed light (hero, header) or wide black (inverted footer). */
export function TattooMark({ variant = "cond", pulse, className }: { variant?: "wide" | "cond"; pulse?: boolean; className?: string }) {
  const m = variant === "cond" ? marks.tattooCond : marks.tattooWide;
  return (
    <svg className={`${s.svg} ${className ?? ""}`} viewBox={`0 0 ${m.width} 700`} aria-hidden="true" focusable="false">
      <g transform={`translate(${m.x} 0)`} fill="currentColor">
        {m.paths.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
      {pulse && <Breath x={m.x} paths={m.paths} />}
    </svg>
  );
}

/** The footer signature: the header lockup inverted — light condensed NJ, wide black TATTOO. */
export function FooterMark({ className }: { className?: string }) {
  const nj = marks.njCond;
  const tt = marks.tattooWide;
  const gap = 150;
  const x2 = nj.total + gap;
  return (
    <svg
      className={`${s.svg} ${className ?? ""}`}
      viewBox={`0 0 ${x2 + tt.width} 700`}
      aria-hidden="true"
      focusable="false"
    >
      <g transform={`translate(${nj.x} 0)`} fill="currentColor">
        {nj.paths.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
      <circle className={s.slot} data-dot-anchor="end" cx={nj.dot.cx} cy={nj.dot.cy} r={nj.dot.r} />
      <g transform={`translate(${x2 + tt.x} 0)`} fill="currentColor">
        {tt.paths.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
    </svg>
  );
}
