import { NextResponse } from "next/server";
import { hasSessionCookie } from "./lib/auth";

// Language routing (multilingual, Hybrid method).
//
// v4.5 English variants: the DEFAULT English variant (US unless the
// admin made UK default in Settings > Languages) has NO prefix:
// /, /[slug], /blog/[slug]. The other English variant lives under its
// full-code prefix: /en-gb/... (UK) or /en-us/... (US when UK is
// default). Other languages get a 2-letter prefix: /es, /es/[slug],
// /es/blog/[slug]. The middleware REWRITES /{lang}/... to the same
// route without the prefix and sets x-lang (and x-html-lang) headers,
// so the existing English routes keep working unchanged and one route
// serves every language. /en/... redirects (301) to the same URL
// without the prefix. Unknown or disabled language prefixes are NOT
// turned into English content — the page components check the language
// against the enabled-languages list and return 404.
//
// The default-variant redirect for /en-us/ or /en-gb/ (when that
// variant IS the default) cannot live here: middleware runs on Edge
// and cannot read the database to know which variant is default. It
// lives in lib/data.js redirectDefaultVariantPrefix(), called by the
// public pages — middleware marks those rewrites with the
// x-original-path header so the pages know the prefixed URL to strip.
//
// NOTE (Edge limitation): middleware runs on the Edge runtime, where it
// cannot reliably call supabase.auth.getUser() to validate the token.
// So middleware only checks that a session cookie is PRESENT
// (sb-access-token for a Supabase login, or admin_session for a
// bootstrap login). The REAL validity check happens in every server
// route / server component via getCurrentUser() / verifySessionToken()
// in lib/auth.js — an expired or forged token gets a 401 there even
// though middleware let the request through.

// 2-letter prefix (es, fr...) or an English-variant prefix (en-gb, en-us).
const LANG_PREFIX = /^\/([a-z]{2}(?:-[a-z]{2})?)(\/|$)/;

// Full language code for <html lang>, from the URL prefix.
const FULL_CODE = {
  en: "en-US",
  "en-gb": "en-GB",
  "en-us": "en-US",
  es: "es-ES",
  fr: "fr-FR",
  de: "de-DE",
  pt: "pt-PT",
  it: "it-IT",
  nl: "nl-NL",
  no: "nb-NO",
};

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Protect everything under /admin except the login page itself.
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!hasSessionCookie(req.cookies)) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // API routes, static assets and files are never language-routed.
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/tinymce") ||
    pathname === "/favicon.ico" ||
    /\.[a-zA-Z0-9]+$/.test(pathname.split("/").pop())
  ) {
    return NextResponse.next();
  }

  const match = pathname.match(LANG_PREFIX);
  if (!match) return NextResponse.next();

  const code = match[1];
  const rest = pathname.slice(code.length + 1); // "/es" -> "", "/en-gb/blog/x" -> "/blog/x"
  const url = req.nextUrl.clone();

  // English has no prefix: /en/... redirects to the same URL without it.
  if (code === "en") {
    url.pathname = rest || "/";
    return NextResponse.redirect(url, 301);
  }

  // Any other prefix is a language: rewrite to the same route without
  // the prefix and mark the request with x-lang, so the single
  // /[slug] and /blog/[slug] routes serve every language (the page
  // components read the language from the header and load that
  // language's own slug — translated slugs included). Unknown or
  // disabled prefixes are NOT turned into English content — the page
  // components check the language against the enabled-languages list
  // and return 404. x-original-path lets the page 301 a prefixed URL
  // when it turns out to be the current default variant (see
  // redirectDefaultVariantPrefix in lib/data.js).
  const url2 = req.nextUrl.clone();
  url2.pathname = rest || "/";
  const headers = new Headers(req.headers);
  headers.set("x-html-lang", FULL_CODE[code] || `${code}-${code.toUpperCase()}`);
  headers.set("x-lang", code);
  headers.set("x-original-path", pathname);
  return NextResponse.rewrite(url2, { request: { headers } });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|tinymce).*)"],
};
