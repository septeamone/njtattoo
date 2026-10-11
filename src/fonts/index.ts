import localFont from "next/font/local";
import { Noto_Sans_KR } from "next/font/google";

// One system: Archivo carries Latin (weight 100–900 × width 62–125). Roboto Flex has the same two
// axes and covers Cyrillic; Noto Sans KR covers Hangul. The CSS stack falls through per glyph.
export const archivo = localFont({
  src: "./Archivo-latin.woff2",
  weight: "100 900",
  variable: "--f-archivo",
  display: "swap",
  declarations: [{ prop: "font-stretch", value: "62% 125%" }],
});

export const robotoFlex = localFont({
  src: "./RobotoFlex-cyrillic.woff2",
  weight: "100 900",
  variable: "--f-flex",
  display: "swap",
  adjustFontFallback: false,
  declarations: [
    { prop: "font-stretch", value: "25% 151%" },
    { prop: "unicode-range", value: "U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116" },
  ],
});

// Self-hosted by next/font at build time — visitors never contact Google.
export const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  variable: "--f-kr",
  display: "swap",
});

export const fontVariables = `${archivo.variable} ${robotoFlex.variable} ${notoSansKr.variable}`;
