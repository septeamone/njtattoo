# NJ.TATTOO

Concept site for an independent tattoo artist in Seoul. Next.js 16 + TypeScript, static export (`out/`), EN / KR / RU.
No photographs or video: identity is typography, a bespoke logotype, composition and motion.
Design source (read-only, do not edit): `../njtattoo`.

## Run
```
npm run dev      # http://localhost:3000/en/
npm run build    # static site in out/
npm run lint
```

## The system in one paragraph
One red dot lives on the page. It rests on the full stop of the logotype "NJ.", flies to the full stop that ends each
heading as that heading comes into view, steps beside whatever the pointer or keyboard focus is on, and comes to rest
on the final stop in the footer. Red is used nowhere else. Headings are sentences ending in a drawn circular stop
(`components/ui/Stop.tsx`); the dot logic is `lib/dot.ts`.

## Structure
- `src/app/[lang]/…` — Home, Works, Artist, Process, Contact (+ `layout.tsx`: html, fonts, shell). `(root-redirect)` serves `/`. `global-not-found.tsx` is the 404 page.
- `src/components/shell/` — header, mobile menu, language switch, footer, page-transition veil, the live dot.
- `src/components/home/` — opening poster + pinned sequence (`Intro*`), the style ribbon (`StyleRibbon*`, scroll-driven two lanes of the 20 styles), process strip.
- `src/components/marks/` — logotype as SVG. **Generated** by `scripts/build-marks.py` from Archivo (OFL): `python scripts/build-marks.py` (needs fonttools, brotli, uharfbuzz).
- `src/lib/fit.ts`, `components/ui/FitLines.tsx` — width-fitted display lines (font-stretch at a shared size; Hangul has no width axis, so it shares one size).
- `src/i18n/` — routes `en` / `kr` / `ru` (`kr` → `<html lang="ko">`); dictionaries in `dictionaries/*.json`. All copy is draft.
- `src/content/contacts.ts` — phone and WhatsApp link (KakaoTalk is the same number, shown as text). `src/content/studio.ts` — address in English and Korean + Naver Map link, shown everywhere via `components/ui/Address.tsx`. `src/content/styles.ts` — the 20 styles and each one's weight/width voice. There is no form.
- `src/fonts/` — Archivo (Latin), Roboto Flex (Cyrillic), Noto Sans KR (Hangul, self-hosted at build). Licences: SIL OFL.
- `screenshots/` — real browser captures of the production build (desktop 1440, mobile 390; EN/KR/RU). Not part of the build.
- `source-media/` — the original photographs. Not used anywhere and not part of the build.

## Notes
- Motion: GSAP + ScrollTrigger only. `prefers-reduced-motion` and no-JS get plain, fully readable pages.
- Static hosting: every route is `folder/index.html` (`trailingSlash`). The redirect on `/` assumes the site is served from the domain root.


## Update: one-page landing
The site is now a single page per language (`/en/`, `/kr/`, `/ru/`): hero, Styles (kinetic ribbon), Artist, Process, Contact, footer.
The header links scroll to sections. Contacts live in `src/content/contacts.ts` (WhatsApp, Telegram, Instagram, phone; KakaoTalk becomes a link when `kakao` is filled in).
The red live dot rolls along the letters of each heading to its full stop; the hero and header logo breathe softly toward the brand red.
