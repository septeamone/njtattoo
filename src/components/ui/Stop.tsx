import s from "./Stop.module.css";

/**
 * The full stop that ends a heading, drawn as a circle on the baseline.
 * One red dot lives on the page at a time (see lib/dot.ts); it lands on whichever
 * stop it is visiting. Without JavaScript the stops simply stay text-coloured.
 */
export function Stop() {
  return (
    <>
      {/* word joiner: the stop never wraps onto a line of its own */}
      {"⁠"}
      <span className={s.stop} data-dot-anchor="stop" aria-hidden="true" />
    </>
  );
}
