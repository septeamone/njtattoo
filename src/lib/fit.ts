/**
 * Width-justified display lines.
 * Every line is made exactly as wide as the container. Where the font has a width axis
 * (Latin: Archivo, Cyrillic: Roboto Flex) the line's width is adjusted through `font-stretch`
 * at a shared size, so the block keeps one rhythm; where it has none (Hangul) one shared size is
 * used and shorter lines stay ragged.
 *
 * The range is deliberately narrow (74–112%): at the extremes of the axis the same letters start to
 * look like different typefaces. A line that cannot reach the width inside the range finishes by size.
 */

const BASE = 100; // measuring size in px
export const MIN_STRETCH = 74;
export const MAX_STRETCH = 112;

type Opts = { minScale?: number; maxScale?: number };

const widthOf = (el: HTMLElement) => el.getBoundingClientRect().width;

function measure(el: HTMLElement, size: number, stretch: number) {
  el.style.fontSize = `${size}px`;
  el.style.setProperty("font-stretch", `${stretch}%`);
  return widthOf(el);
}

export function fitLines(root: HTMLElement, { minScale = 0.78, maxScale = 1.3 }: Opts = {}) {
  const W = root.clientWidth;
  if (!W) return;
  const inners = [...root.querySelectorAll<HTMLElement>("[data-fit-inner]")];
  if (!inners.length) return;

  const wLo = inners.map((el) => measure(el, BASE, MIN_STRETCH));
  const wHi = inners.map((el) => measure(el, BASE, MAX_STRETCH));
  const w100 = inners.map((el) => measure(el, BASE, 100));
  const hasAxis = wHi[0] - wLo[0] > 3;

  if (!hasAxis) {
    // No width axis (Hangul): one shared size, set by the longest line.
    const size = Math.min(...w100.map((w) => (BASE * W) / w));
    inners.forEach((el) => {
      el.style.fontSize = `${size}px`;
      el.style.setProperty("font-stretch", "100%");
      el.dataset.stretch = "100";
    });
    root.dataset.fit = "ready";
    return;
  }

  // Shared size S: the one at which every line can reach the container width inside the stretch range.
  const lo = Math.max(...wHi.map((w) => (BASE * W) / w)); // smallest S for which the widest-at-max line still fills W
  const hi = Math.min(...wLo.map((w) => (BASE * W) / w)); // largest S for which the narrowest-at-min line still fits
  const mid100 = [...w100].sort((a, b) => a - b)[Math.floor(w100.length / 2)];
  const S = lo <= hi ? Math.sqrt(lo * hi) : (BASE * W) / mid100;

  inners.forEach((el, i) => {
    const span = wHi[i] - wLo[i];
    let st = MIN_STRETCH + ((MAX_STRETCH - MIN_STRETCH) * ((W * BASE) / S - wLo[i])) / span;
    st = Math.min(Math.max(st, MIN_STRETCH), MAX_STRETCH);
    let size = S;
    for (let k = 0; k < 4; k++) {
      const w = measure(el, size, st);
      const err = W - w;
      if (Math.abs(err) < 0.5) break;
      if (st > MIN_STRETCH && st < MAX_STRETCH) {
        const slope = (span / (MAX_STRETCH - MIN_STRETCH)) * (size / BASE);
        st = Math.min(Math.max(st + err / slope, MIN_STRETCH), MAX_STRETCH);
      } else {
        size = size * (W / w); // stretch saturated: finish with size
      }
    }
    size = Math.min(Math.max(size, S * minScale), S * maxScale);
    measure(el, size, st);
    el.dataset.stretch = st.toFixed(1);
  });
  root.dataset.fit = "ready";
}
