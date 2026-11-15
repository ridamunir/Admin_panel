import { notFound } from "next/navigation";
import { getPageBySlug, getSubPages, getTranslations, getRequestLang, isConfigured } from "@/lib/data";
import { pageMetadata, isLanguageEnabled } from "@/lib/languages";
import PublicPage, { DemoBanner } from "@/components/PublicPage";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return [];
}

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

// One route serves every language: middleware rewrites /es/<slug> to
// /<slug> with x-lang=es, so params.slug is always the page's OWN slug
// in the request language (translated slugs included).
async function load(params) {
  const lang = getRequestLang();
  if (lang !== "en" && !(await isLanguageEnabled(lang))) return null;
  const page = await getPageBySlug(params.slug, lang);
  if (!page || page.status !== "published" || page.type === "blog") return null;
  return { page, lang };
}

export async function generateMetadata({ params }) {
  const found = await load(params);
  if (!found) return { title: "Not found" };
  const translations = await getTranslations(found.page.translation_group_id || found.page.id);
  return pageMetadata(found.page, translations, BASE);
}

export default async function SlugPage({ params }) {
  const found = await load(params);
  if (!found) notFound();
  const { page, lang } = found;
  const subPages = page.type === "hub" || page.type === "pillar" ? await getSubPages(page.id, lang) : [];
  return (
    <PublicPage
      page={page}
      subPages={subPages}
      demoBanner={<DemoBanner configured={isConfigured()} />}
      homeHref={lang === "en" ? "/" : `/${lang}`}
    />
  );
}
