// Languages — multilingual support (Hybrid method, approved 15 Nov 2026).
// Settings > Languages in /admin: a predefined list to enable, plus a
// "Custom Language" option to add any language manually (name + code).
//
// v4.5 English variants (23 Nov 2026): English has TWO variants.
//   - Default: English (US), full code en-US, og locale en_US. It has
//     NO URL prefix: homepage.com/, homepage.com/[slug].
//   - Separate option: English (UK), full code en-GB, og locale en_GB.
//     Disabled by default; enable it in Settings > Languages and it
//     lives under /en-gb/, e.g. homepage.com/en-gb/[slug].
//   - "Make default" (Settings > Languages) swaps which variant is the
//     default: the chosen variant takes code "en" (no prefix) and the
//     other moves to its own prefix (/en-us/ or /en-gb/). Pages keep
//     their TRUE full language_code (en-US / en-GB) — only the rows'
//     code/is_default values swap, never the page content labels.
// The default row ALWAYS has code "en"; its full_code says which
// English variant is the default. Every other language uses its short
// code as URL prefix (es, fr, de...) and its full code (es-ES) for
// <html lang>, hreflang and og:locale. English variants use their FULL
// code for hreflang (en-US / en-GB), never the bare "en".
//
// This file is SERVER-ONLY (it imports the Supabase admin client).

import { getSupabaseAdmin } from "./supabase";

export const PREDEFINED_LANGUAGES = [
  { id: "lang-en", code: "en", og_locale: "en_US", name: "English (US)", native_name: "English (US)", full_code: "en-US", is_default: true, is_custom: false, enabled: true, sort_order: 0 },
  { id: "lang-en-gb", code: "en-gb", og_locale: "en_GB", name: "English (UK)", native_name: "English (UK)", full_code: "en-GB", is_default: false, is_custom: false, enabled: false, sort_order: 1 },
  { id: "lang-es", code: "es", og_locale: "es_ES", name: "Spanish", native_name: "Español", full_code: "es-ES", is_default: false, is_custom: false, enabled: true, sort_order: 2 },
  { id: "lang-fr", code: "fr", og_locale: "fr_FR", name: "French", native_name: "Français", full_code: "fr-FR", is_default: false, is_custom: false, enabled: false, sort_order: 3 },
  { id: "lang-de", code: "de", og_locale: "de_DE", name: "German", native_name: "Deutsch", full_code: "de-DE", is_default: false, is_custom: false, enabled: false, sort_order: 4 },
  { id: "lang-pt", code: "pt", og_locale: "pt_PT", name: "Portuguese", native_name: "Português", full_code: "pt-PT", is_default: false, is_custom: false, enabled: false, sort_order: 5 },
  { id: "lang-it", code: "it", og_locale: "it_IT", name: "Italian", native_name: "Italiano", full_code: "it-IT", is_default: false, is_custom: false, enabled: false, sort_order: 6 },
  { id: "lang-nl", code: "nl", og_locale: "nl_NL", name: "Dutch", native_name: "Nederlands", full_code: "nl-NL", is_default: false, is_custom: false, enabled: false, sort_order: 7 },
  { id: "lang-no", code: "no", og_locale: "nb_NO", name: "Norwegian", native_name: "Norsk", full_code: "nb-NO", is_default: false, is_custom: false, enabled: false, sort_order: 8 },
];

// Fallback list used when Supabase is not configured (demo mode).
// Mirrors the seed: English (US) default + Spanish enabled, English
// (UK) present but disabled until an Admin enables it.
export const FALLBACK_LANGUAGES = PREDEFINED_LANGUAGES.map((l) => ({ ...l }));

export const DEFAULT_SHORT_CODE = "en";

// URL key for a language: "en" (default, no prefix), "en-gb" / "en-us"
// for the English variants, or the 2-letter short code for the rest.
// Unlike shortCode(), this NEVER collapses en-US and en-GB together.
export function langKey(code) {
  const s = String(code || "").toLowerCase();
  if (s === "en-gb" || s === "en-us") return s;
  return s.split("-")[0] || "en";
}

export function isEnglishVariantKey(key) {
  const k = langKey(key);
  return k === "en" || k === "en-gb" || k === "en-us";
}

export function shortCode(languageCode) {
  if (!languageCode) return "en";
  return String(languageCode).split("-")[0].toLowerCase();
}

// Full code of the default language, from a languages list when given,
// otherwise the shipped default (US English).
export function defaultFullCode(languages) {
  const row = (languages || []).find((l) => l.is_default);
  return row?.full_code || "en-US";
}

// Full code for a URL key: "en" resolves to the CURRENT default
// variant (US unless the admin made UK default); "en-gb" -> en-GB,
// "en-us" -> en-US; any other short code -> its full code.
export function fullCodeForLangKey(key, languages) {
  const k = langKey(key);
  if (k === "en") return defaultFullCode(languages);
  if (k === "en-gb") return "en-GB";
  if (k === "en-us") return "en-US";
  return fullCodeForShort(k);
}

export function fullCodeForShort(code) {
  const k = String(code || "").toLowerCase();
  if (k === "en") return "en-US";
  if (k === "en-gb") return "en-GB";
  if (k === "en-us") return "en-US";
  const found = PREDEFINED_LANGUAGES.find((l) => l.code === k || l.full_code.toLowerCase() === k);
  if (found) return found.full_code;
  if (/^[a-z]{2}$/.test(k)) return `${k}-${k.toUpperCase()}`;
  return code;
}

// og:locale uses an underscore: es-ES -> es_ES, en-US -> en_US.
export function ogLocale(fullCode) {
  return String(fullCode || "en-US").replace("-", "_");
}

// hreflang value for a page's full language code: English variants
// use their FULL code (en-US / en-GB); other languages use the short
// code (es, fr, ...).
export function hreflangCode(fullCode) {
  const s = String(fullCode || "");
  if (/^en-[a-z]{2}$/i.test(s)) return s;
  return shortCode(s);
}

export function isValidShortCode(code) {
  return /^[a-z]{2}$/.test(String(code || ""));
}

export function isValidFullCode(code) {
  return /^[a-z]{2}-[A-Z]{2}$/.test(String(code || ""));
}

export async function getLanguages() {
  const admin = getSupabaseAdmin();
  if (!admin) return FALLBACK_LANGUAGES.map((l) => ({ ...l }));
  try {
    const { data, error } = await admin.from("languages").select("*").order("sort_order");
    if (error || !data || data.length === 0) return FALLBACK_LANGUAGES.map((l) => ({ ...l }));
    return data;
  } catch {
    return FALLBACK_LANGUAGES.map((l) => ({ ...l }));
  }
}

export async function getEnabledLanguages() {
  return (await getLanguages()).filter((l) => l.enabled);
}

export async function getLanguageByShort(code) {
  const langs = await getLanguages();
  const k = langKey(code);
  const full = String(code || "").toLowerCase();
  return langs.find((l) => l.code === k || l.full_code.toLowerCase() === full) || null;
}

export async function isLanguageEnabled(code) {
  if (langKey(code) === "en") return true;
  const lang = await getLanguageByShort(code);
  return Boolean(lang && lang.enabled);
}

// URL prefix for a page in its own language. The DEFAULT variant
// (whichever English variant is default) has NO prefix; the other
// English variant gets /en-gb or /en-us; every other language gets
// /{short-code}. `languages` is optional — without it the shipped
// default (en-US) is assumed; pass the real list whenever you have it
// (sitemap, metadata) so a swapped default is honoured.
export function urlPrefixForPage(page, languages) {
  const full = String(page.language_code || "en-US").toLowerCase();
  if (full === defaultFullCode(languages).toLowerCase()) return "";
  const key = langKey(page.language_code);
  if (key === "en-gb") return "/en-gb";
  if (key === "en-us") return "/en-us";
  return `/${shortCode(page.language_code)}`;
}

// Public URL of a page in its own language. `base` is the site origin
// ("" for a relative link). The slug is per-language, so a translated
// slug (e.g. Spanish "como-comprobar-un-numero-desconocido") is used as-is.
export function pageUrl(page, base = "", languages) {
  const prefix = urlPrefixForPage(page, languages);
  if (page.type === "blog") return `${base}${prefix}/blog/${page.slug}`;
  if (!page.slug) return prefix ? `${base}${prefix}` : `${base}/`;
  return `${base}${prefix}/${page.slug}`;
}

// Self-canonical: every language version canonicalises to ITSELF.
// A manual canonical_url in the admin overrides this (kept for rare
// special cases), otherwise the page's own language URL is used.
export function canonicalUrlFor(page, base = "", languages) {
  if (page.canonical_url && String(page.canonical_url).trim()) {
    return String(page.canonical_url).trim();
  }
  return pageUrl(page, base, languages);
}

// Full hreflang set for one page version, from all PUBLISHED translations
// in its translation group. Every version lists every version:
//   x-default -> default-variant URL (US unless UK was made default)
//   en-US     -> US English URL, en-GB -> UK English URL
//   es        -> Spanish URL, fr -> French URL, ...
// If a group has no published default-variant version, x-default points
// to the current page's URL instead.
export function hreflangEntries(page, translations, base = "", languages) {
  const published = (translations || []).filter((t) => t.status === "published");
  const list = published.length ? published : [page];
  const defFull = defaultFullCode(languages).toLowerCase();
  const defPage = list.find((t) => String(t.language_code || "").toLowerCase() === defFull) || page;
  const entries = [];
  entries.push({ hreflang: "x-default", href: pageUrl(defPage, base, languages) });
  // Default variant first, then the rest in language sort order.
  const ordered = [...list].sort((a, b) => {
    const aDef = String(a.language_code || "").toLowerCase() === defFull;
    const bDef = String(b.language_code || "").toLowerCase() === defFull;
    if (aDef && !bDef) return -1;
    if (bDef && !aDef) return 1;
    return langKey(a.language_code).localeCompare(langKey(b.language_code));
  });
  const seen = new Set(["x-default"]);
  for (const t of ordered) {
    const tag = hreflangCode(t.language_code);
    if (seen.has(tag)) continue;
    seen.add(tag);
    entries.push({ hreflang: tag, href: pageUrl(t, base, languages) });
  }
  return entries;
}

// Metadata object for a public page version (Next.js generateMetadata).
// Title/description come from THAT language version only.
export function pageMetadata(page, translations, base = "", languages) {
  const langs = {};
  for (const e of hreflangEntries(page, translations, base, languages)) {
    langs[e.hreflang] = e.href;
  }
  const full = page.language_code || fullCodeForShort(shortCode(page.language_code));
  return {
    title: page.meta_title || page.title || "",
    description: page.meta_description || "",
    alternates: { canonical: canonicalUrlFor(page, base, languages), languages: langs },
    openGraph: {
      title: page.meta_title || page.title || "",
      description: page.meta_description || "",
      locale: ogLocale(full),
      url: canonicalUrlFor(page, base, languages),
    },
  };
}

// --- API used by the public pages / sitemap / editor (sibling surface) ---

// Public path of a page in its own language (relative). Default variant
// has no prefix; other languages get /{code} in front. `languages` is
// accepted for call-site compatibility and honoured when given.
export function pagePath(page, languages) {
  return pageUrl(page, "", languages);
}

// { canonical, languages } object for Next.js generateMetadata.
// languages map: x-default -> default-variant URL, en-US / en-GB ->
// that variant's URL, es/fr/... -> that language's URL. Every version
// lists every version.
export function buildAlternates(page, translations, languages) {
  const base = siteBase();
  const langs = {};
  for (const e of hreflangEntries(page, translations, base, languages)) {
    langs[e.hreflang] = e.href;
  }
  return { canonical: canonicalUrlFor(page, base, languages), languages: langs };
}

// og:locale for a page version (e.g. "es_ES"), from the languages list
// when available, otherwise from the page's own language code.
export function ogLocaleFor(page, languages) {
  const full = String(page.language_code || "").toLowerCase();
  const row = (languages || []).find(
    (l) => l.full_code?.toLowerCase() === full || l.code === langKey(page.language_code)
  );
  if (row?.og_locale) return row.og_locale;
  if (row?.full_code) return ogLocale(row.full_code);
  return ogLocale(page.language_code || fullCodeForShort(shortCode(page.language_code)));
}

// Short code of the default language (e.g. "en").
export function defaultShortCode(languages) {
  return (languages || []).find((l) => l.is_default)?.code || "en";
}

// Site origin without a trailing slash (NEXT_PUBLIC_SITE_URL or fallback).
export function siteBase() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://example.com").replace(/\/$/, "");
}
