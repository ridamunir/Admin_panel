import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const { user } = await getSessionUser({ persistRefresh: true });
  return Boolean(user);
}

// POST /api/admin/languages/make-default { id }
// "Make default" — English variants ONLY (en-US / en-GB). Swaps which
// English variant is the default:
//   - The chosen variant takes code "en" (no URL prefix) and
//     is_default = true (and is enabled).
//   - The previous default moves to its own prefix code ("en-us" or
//     "en-gb"), is_default = false, stays enabled under its prefix.
// Pages are NOT touched: their language_code keeps the TRUE variant
// (en-US / en-GB), and the public routes match on the exact full code,
// so no page is ever served as the wrong variant. Spanish and other
// languages can never become the default — this endpoint refuses them.
// Order matters: the old default's code is moved FIRST, because `code`
// is unique and both rows cannot hold "en" at the same time.
export async function POST(req) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured — connect Supabase to save changes (see DEPLOY.md)." }, { status: 503 });
  }
  const body = await req.json().catch(() => ({}));
  const admin = getSupabaseAdmin();

  const { data: target } = await admin.from("languages").select("*").eq("id", body.id).single();
  if (!target) return NextResponse.json({ error: "Language not found" }, { status: 404 });
  const targetFull = String(target.full_code || "").toLowerCase();
  if (targetFull !== "en-us" && targetFull !== "en-gb") {
    return NextResponse.json({ error: "Only English (US) or English (UK) can be the default language." }, { status: 403 });
  }
  if (target.is_default) return NextResponse.json({ ok: true, already: true });

  const { data: current } = await admin.from("languages").select("*").eq("is_default", true).single();
  if (!current) return NextResponse.json({ error: "No default language is set." }, { status: 500 });
  const currentFull = String(current.full_code || "").toLowerCase();
  if (currentFull !== "en-us" && currentFull !== "en-gb") {
    return NextResponse.json({ error: "The current default is not an English variant — cannot swap." }, { status: 500 });
  }

  // 1) Move the old default off code "en" to its own prefix code.
  const oldCode = currentFull === "en-gb" ? "en-gb" : "en-us";
  const { error: err1 } = await admin
    .from("languages")
    .update({ code: oldCode, is_default: false, enabled: true })
    .eq("id", current.id);
  if (err1) return NextResponse.json({ error: err1.message }, { status: 500 });

  // 2) The chosen variant becomes the default (code "en", no prefix).
  const { error: err2 } = await admin
    .from("languages")
    .update({ code: "en", is_default: true, enabled: true })
    .eq("id", target.id);
  if (err2) {
    // Best-effort rollback: put the old default back.
    await admin.from("languages").update({ code: "en", is_default: true, enabled: true }).eq("id", current.id);
    return NextResponse.json({ error: err2.message }, { status: 500 });
  }

  const { data: languages } = await admin.from("languages").select("*").order("sort_order");
  return NextResponse.json({ ok: true, languages: languages || [] });
}
