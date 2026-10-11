import type { Viewport } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/shell/Footer";
import { Shell } from "@/components/shell/Shell";
import { fontVariables } from "@/fonts";
import { hasLocale, htmlLang, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import "../globals.css";

export const viewport: Viewport = { themeColor: "#0D1014", colorScheme: "dark" };

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

// Runs before first paint: tells CSS whether this is the home page and whether it is scrolled to the top,
// so the logo and header never flash in the wrong state. (dock="ready" is set by the shell once the
// opening sequence has positioned the logo; the timer only protects against a script that never arrives.)
const boot = `(function(){var d=document.documentElement,h=/^\\/(en|kr|ru)\\/?$/.test(location.pathname.slice(${(process.env.NEXT_PUBLIC_BASE ?? "").length}));d.dataset.home=h?"1":"0";d.dataset.top=h&&scrollY<8?"1":"0";if(h)setTimeout(function(){if(d.dataset.dock!=="ready")d.dataset.dock="ready"},3500)})()`;

export default async function LangLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const d = await getDictionary(lang);

  return (
    // data-* attributes on <html> are set by the boot script before hydration.
    <html lang={htmlLang[lang]} className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
      </head>
      <body>
        <Shell lang={lang} nav={d.nav}>
          {children}
          <Footer d={d} />
        </Shell>
      </body>
    </html>
  );
}
