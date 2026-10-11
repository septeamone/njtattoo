import { Artist } from "@/components/artist/Artist";
import { Contact } from "@/components/contact/Contact";
import { Intro } from "@/components/home/Intro";
import { ProcessStrip } from "@/components/home/ProcessStrip";
import { StyleRibbon } from "@/components/home/StyleRibbon";
import { loadPage, pageMetadata } from "@/lib/page";

export const generateMetadata = ({ params }: PageProps<"/[lang]">) => pageMetadata(params, "home");

export default async function Page({ params }: PageProps<"/[lang]">) {
  const { lang, d } = await loadPage(params);
  return (
    <main id="main">
      <Intro d={d} />
      <StyleRibbon lang={lang} d={d} />
      <Artist d={d} />
      <ProcessStrip d={d} />
      <Contact d={d} />
    </main>
  );
}
