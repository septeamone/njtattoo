/**
 * The twenty directions, in the order given. An art-directed list, not a claim of narrow specialisation.
 * One family speaks in twenty voices by one rule: weight alternates heavy / light down the list (so no two
 * neighbours look alike) and no two names share the same weight + width pair. The ribbon on Home and the
 * atlas on Works use the same map.
 */
export const styleVoices = [
  { id: "realism", wght: 800, wdth: 100 },
  { id: "bg", wght: 200, wdth: 75 },
  { id: "colorRealism", wght: 700, wdth: 112 },
  { id: "japanese", wght: 150, wdth: 62 },
  { id: "neoTraditional", wght: 900, wdth: 87 },
  { id: "traditional", wght: 250, wdth: 125 },
  { id: "blackwork", wght: 900, wdth: 112 },
  { id: "fineLine", wght: 100, wdth: 62 },
  { id: "minimalism", wght: 750, wdth: 125 },
  { id: "geometric", wght: 200, wdth: 125 },
  { id: "dotwork", wght: 800, wdth: 75 },
  { id: "ornamental", wght: 250, wdth: 112 },
  { id: "lettering", wght: 900, wdth: 100 },
  { id: "chicano", wght: 200, wdth: 62 },
  { id: "tribal", wght: 900, wdth: 62 },
  { id: "biomechanical", wght: 250, wdth: 100 },
  { id: "surrealism", wght: 700, wdth: 125 },
  { id: "watercolor", wght: 150, wdth: 87 },
  { id: "sketch", wght: 800, wdth: 87 },
  { id: "abstract", wght: 200, wdth: 100 },
] as const;

/** Hangul has no width axis and Noto Sans KR turns to a hairline below ~250 on a dark ground. */
export const voiceWeight = (wght: number, lang: string) => (lang === "kr" ? Math.max(wght, 300) : wght);
