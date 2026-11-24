# Admin Panel

This is a **complete, ready-to-use Admin Panel** — not a mockup and not a demo. It is kept as a reusable base: **one copy of this panel is installed with each tool site** (one copy per tool site, NOT multi-site, no site selector), and each copy has its own database. Content-only panel: text, SEO meta and blogs come from the admin; design and tool logic stay in code. The panel UI is **English only**.

- **Stack:** Next.js 14 (App Router, JavaScript) + Tailwind CSS 3 + Supabase (Postgres) + TinyMCE self-hosted (no cloud API key) + Vercel hosting.
- **Admin:** `/admin` — login with email + password via Supabase Auth. Users section (Admin-only): Add New User, Edit, Change Password, Delete. Roles: Admin (everything, incl. users + deleting foundational pages) and Editor (content only — no users, no foundational-page deletes).
- **Layout (v4.1):** left sidebar navigation, same as the in-chat demo — Dashboard, Pages, Blogs, Users, Settings down the left, with View Site and Logout at the bottom of the sidebar. On small screens the sidebar links show as a top row.
- **Permissions (v4.2):** schema.sql now grants access on all 5 tables to anon, authenticated and service_role (RLS policies alone do not grant access — without this, live deploys failed with "permission denied for table pages"). Existing installs: run `supabase/fix-permissions.sql` once in Supabase SQL Editor — no redeploy needed. Dashboard "DB Connected" is now a real query, not just env vars present.
- **Editor (v4.3):** TinyMCE toolbar now shows H1–H6 as visible buttons, exactly like the in-chat demo. The old toolbar hid headings inside the "Paragraph" format dropdown, so they looked missing. Plugins stay link + lists + code + preview.
- **Editor + sidebar parity (v4.4):** correction — `formatselect` does not exist in TinyMCE 7, so the old toolbar never rendered a Paragraph dropdown at all (the "p" at the editor's bottom-left is only the status bar). Toolbar is now H1–H6, Paragraph, Bold, Italic, lists, Link, Clear, Code, Preview, in demo order. Sidebar now matches the demo too: Dashboard, Pages, Blogs, Users, Live Site, Settings, with + New Blog and Logout at the bottom.
- **English variants (v4.5):** the default language is now **English (US)** — `en-US`, OG locale `en_US`, no URL prefix. **English (UK)** (`en-GB`, `en_GB`) is a separate predefined language, disabled by default: enable it in **Settings → Languages** and its pages live under `/en-gb/`. **"Make default"** in Settings → Languages swaps which variant is the default — the chosen one takes the no-prefix URLs and `x-default`, the other moves to its own prefix (`/en-us/` or `/en-gb/`); only the language rows swap, pages keep their true `en-US` / `en-GB` label and are never served as the wrong variant. hreflang uses the full code for English variants (`en-US`, `en-GB`), short codes for other languages (`es`, `fr`, …). **Existing installs:** run `supabase/migrate-en-variants.sql` once in Supabase SQL Editor (idempotent) — it renames the default row to English (US), adds the disabled UK row, and relabels existing `en-GB` pages to `en-US`. Fresh installs get all of this from `seed.sql`.
- **Public site:** `/` (Homepage from DB), `/[slug]` (any published page), `/blog` and `/blog/[slug]`, plus `/sitemap.xml` and `/robots.txt`.
- **Multilingual (v4, English variants in v4.5):** English (US) is the default language with no URL prefix; English (UK) is a separate option under `/en-gb/` when enabled, and the default can be swapped with "Make default" in Settings → Languages. Other enabled languages live under their short code — `/es`, `/es/<translated-slug>`, `/es/blog`, `/es/blog/<translated-slug>`. Manage languages in **Settings → Languages** (predefined list + Custom Language). Each language version is its own page row with its own translated slug, linked by "Translation Of" (`translation_group_id`); canonical is self-referencing per language and the full hreflang set (incl. `x-default` → the default version, `en-US` / `en-GB` for the English variants) is generated automatically. Seed data includes a worked Spanish example.
- **Demo mode:** without Supabase env vars the site runs on built-in demo data and shows an amber banner — "Demo data — connect Supabase to save changes".

## Quick start

```bash
cp .env.example .env.local   # fill in Supabase vars (ADMIN_PASSWORD is optional bootstrap-only)
npm install                  # also copies TinyMCE assets to public/tinymce
npm run dev                  # http://localhost:3000
npm run build
```

Full step-by-step deploy guide (Roman Urdu + English): see **DEPLOY.md**.

## Files

- `supabase/schema.sql` / `supabase/seed.sql` — 5 tables (pages, sections, variables, admin_users, languages) + seed data (incl. Spanish demo pages)
- `lib/` — supabase clients, auth (Supabase Auth + bootstrap), session helpers, data helpers, demo fallback data
- `app/admin/` — dashboard, pages, blogs, users, login, settings/languages
- `app/api/admin/` — login/logout, pages CRUD, users CRUD + password change, status, export (CSV/SQL), upload, status check
- `components/PageEditor.jsx` — the main editor; `components/TinyEditor.jsx` — TinyMCE wrapper
