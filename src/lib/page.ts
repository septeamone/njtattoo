import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, type Locale } from "@/i18n/config";
import { getDictionary, type Dictionary } from "@/i18n/dictionaries";

type Meta = keyof Dictionary["meta"];

/** Resolves the route's language and dictionary; 404s on anything unknown. */
export async function loadPage(params: Promise<{ lang: string }>): Promise<{ lang: Locale; d: Dictionary }> {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  return { lang, d: await getDictionary(lang) };
}

export async function pageMetadata(params: Promise<{ lang: string }>, key: Meta): Promise<Metadata> {
  const { d } = await loadPage(params);
  // concept preview: kept out of search engines until the site is launched
  return { title: d.meta[key].title, description: d.meta[key].description, robots: { index: false, follow: false } };
}
