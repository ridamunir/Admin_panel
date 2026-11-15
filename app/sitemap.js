import { getPublishedPages, getTranslations } from "@/lib/data";
import { pageUrl, hreflangEntries } from "@/lib/languages";

export const dynamic = "force-dynamic";

export default async function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
  const pages = await getPublishedPages();
  const entries = [];
  for (const p of pages) {
    const translations = await getTranslations(p.translation_group_id || p.id);
    const langs = {};
    for (const e of hreflangEntries(p, translations, base)) langs[e.hreflang] = e.href;
    entries.push({
      url: pageUrl(p, base),
      lastModified: p.updated_at || p.publish_date || new Date(),
      alternates: { languages: langs },
    });
  }
  return entries;
}
