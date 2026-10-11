import type { Metadata } from "next";
import { fontVariables } from "@/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "404 — NJ.TATTOO",
  robots: { index: false },
};

// Served for any address that matches no page (static hosts show it as 404.html).
// Three languages at once: a visitor who got here by mistake should not have to guess which one to pick.
const BASE = process.env.NEXT_PUBLIC_BASE;
const lines = [
  { lang: "en", href: `${BASE}/en/`, text: "This page does not exist.", go: "Go to the home page" },
  { lang: "ko", href: `${BASE}/kr/`, text: "페이지를 찾을 수 없습니다.", go: "홈으로 가기" },
  { lang: "ru", href: `${BASE}/ru/`, text: "Такой страницы нет.", go: "На главную" },
];

export default function GlobalNotFound() {
  return (
    <html lang="en" className={fontVariables}>
      <body style={{ minHeight: "100svh", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "var(--gutter)" }}>
        <main id="main" style={{ paddingTop: "clamp(48px, 12svh, 140px)" }}>
          <h1
            style={{
              fontSize: "clamp(96px, 28vw, 520px)",
              fontWeight: 900,
              fontStretch: "125%",
              letterSpacing: "-0.06em",
              lineHeight: 0.8,
            }}
          >
            404
            <span
              aria-hidden="true"
              style={{ display: "inline-block", width: "0.17em", height: "0.17em", marginLeft: "0.05em", borderRadius: "50%", background: "var(--needle)" }}
            />
          </h1>
          <ul style={{ marginTop: "clamp(32px, 6svh, 72px)", display: "grid", gap: 12, maxWidth: 520 }}>
            {lines.map((l) => (
              <li key={l.lang} lang={l.lang} style={{ display: "flex", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
                <span style={{ color: "var(--steel)" }}>{l.text}</span>
                <a href={l.href} style={{ fontWeight: 600, textDecoration: "underline", textUnderlineOffset: 5, textDecorationThickness: 1 }}>
                  {l.go}
                </a>
              </li>
            ))}
          </ul>
        </main>
        <p style={{ color: "var(--steel)", fontSize: 14 }}>NJ.TATTOO</p>
      </body>
    </html>
  );
}
