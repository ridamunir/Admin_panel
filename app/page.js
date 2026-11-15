import Link from "next/link";
import { getPageBySlug, getPublishedPages, getTranslations, getRequestLang, isConfigured } from "@/lib/data";
import { pageMetadata, pageUrl, isLanguageEnabled } from "@/lib/languages";
import { notFound } from "next/navigation";
import { DemoBanner } from "@/components/PublicPage";

export const dynamic = "force-dynamic";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

export async function generateMetadata() {
  const lang = getRequestLang();
  const page = await getPageBySlug("", lang);
  if (!page) return { title: "Who Called Me? — MyRingCheck" };
  const translations = await getTranslations(page.translation_group_id || page.id);
  return pageMetadata(page, translations, BASE);
}

function renderSections(page) {
  if (!page?.sections?.length) return null;
  return page.sections.map((section) => (
    <section key={section.id} className="mb-8">
      {section.variables.map((v) => (
        <div key={v.id} className="content-html" dangerouslySetInnerHTML={{ __html: v.value_html || "" }} />
      ))}
    </section>
  ));
}

export default async function HomePage() {
  const lang = getRequestLang();
  if (lang !== "en" && !(await isLanguageEnabled(lang))) notFound();
  const page = await getPageBySlug("", lang);
  const published = await getPublishedPages(lang);
  const blogs = published.filter((p) => p.type === "blog");
  const pages = published.filter((p) => p.type !== "blog" && p.slug !== "");
  const prefix = lang === "en" ? "" : `/${lang}`;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <DemoBanner configured={isConfigured()} />
      {page && page.status === "published" ? (
        renderSections(page)
      ) : (
        <div className="content-html">
          <h1>Who Called Me?</h1>
          <p>Enter any UK number and instantly see spam reports, safety score and who called you.</p>
        </div>
      )}

      <h2 className="mb-3 mt-10 text-xl font-bold">Pages</h2>
      <ul className="space-y-1">
        {pages.map((p) => (
          <li key={p.id}>
            <Link href={pageUrl(p)} className="text-blue-600 hover:underline">{p.title || p.slug}</Link>
          </li>
        ))}
      </ul>

      <h2 className="mb-3 mt-8 text-xl font-bold">Latest Blogs</h2>
      <ul className="space-y-1">
        {blogs.map((b) => (
          <li key={b.id}>
            <Link href={pageUrl(b)} className="text-blue-600 hover:underline">{b.title || b.slug}</Link>
          </li>
        ))}
        {blogs.length === 0 && <li className="text-slate-500">No blogs published yet.</li>}
      </ul>

      {lang === "en" && (
        <footer className="mt-12 border-t pt-4 text-sm text-slate-500">
          <Link href="/about-us" className="mr-4 hover:underline">About Us</Link>
          <Link href="/contact-us" className="mr-4 hover:underline">Contact Us</Link>
          <Link href="/privacy-policy" className="mr-4 hover:underline">Privacy Policy</Link>
          <Link href="/terms-and-conditions" className="mr-4 hover:underline">Terms &amp; Conditions</Link>
          <Link href="/disclaimer" className="mr-4 hover:underline">Disclaimer</Link>
          <Link href="/cookie-policy" className="mr-4 hover:underline">Cookie Policy</Link>
          <Link href="/faqs" className="hover:underline">FAQs</Link>
        </footer>
      )}
      {lang !== "en" && (
        <p className="mt-12 border-t pt-4 text-sm text-slate-500">
          <Link href={prefix || "/"} className="hover:underline">← Home</Link>
        </p>
      )}
    </main>
  );
}
