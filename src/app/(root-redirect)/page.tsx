import type { Metadata } from "next";
import { defaultLocale, locales } from "@/i18n/config";

export const metadata: Metadata = {
  title: "NJ.TATTOO",
  robots: { index: false },
};

// Static export has no Accept-Language negotiation, so pick the locale in the
// browser from navigator.language; no-JS visitors get plain links.
const BASE = process.env.NEXT_PUBLIC_BASE;
const pick = `(function(){var l=(navigator.language||"").toLowerCase().slice(0,2);var m={ko:"kr",ru:"ru"};location.replace("${BASE}/"+(m[l]||"${defaultLocale}")+"/")})()`;

export default function Page() {
  return (
    <main style={{ padding: "var(--gutter)" }}>
      <script dangerouslySetInnerHTML={{ __html: pick }} />
      <nav style={{ display: "flex", gap: 24 }}>
        {locales.map((l) => (
          <a key={l} href={`${BASE}/${l}/`}>
            {l.toUpperCase()}
          </a>
        ))}
      </nav>
    </main>
  );
}
