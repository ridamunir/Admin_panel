import { getPublishedPages, getTranslations, getLanguages } from "@/lib/data";
import { pageUrl, hreflangEntries } from "@/lib/languages";

export const dynamic = "force-dynamic";

export default async function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
  const pages = await getPublishedPages();
  const languages = await getLanguages();
  const entries = [];
  for (const p of pages) {
    const translations = await getTranslations(p.translation_group_id || p.id);
    const langs = {};
    for (const e of hreflangEntries(p, translations, base, languages)) langs[e.hreflang] = e.href;
    entries.push({
      url: pageUrl(p, base, languages),
      lastModified: p.updated_at || p.publish_date || new Date(),
      alternates: { languages: langs },
    });
  }
  return entries;
}
