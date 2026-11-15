# Admin Panel

This is a **complete, ready-to-use Admin Panel** — not a mockup and not a demo. It is kept as a reusable base: **one copy of this panel is installed with each tool site** (one copy per tool site, NOT multi-site, no site selector), and each copy has its own database. Content-only panel: text, SEO meta and blogs come from the admin; design and tool logic stay in code. The panel UI is **English only**.

- **Stack:** Next.js 14 (App Router, JavaScript) + Tailwind CSS 3 + Supabase (Postgres) + TinyMCE self-hosted (no cloud API key) + Vercel hosting.
- **Admin:** `/admin` — login with email + password via Supabase Auth. Users section (Admin-only): Add New User, Edit, Change Password, Delete. Roles: Admin (everything, incl. users + deleting foundational pages) and Editor (content only — no users, no foundational-page deletes).
- **Public site:** `/` (Homepage from DB), `/[slug]` (any published page), `/blog` and `/blog/[slug]`, plus `/sitemap.xml` and `/robots.txt`.
- **Multilingual (v4):** English is the default language with no URL prefix. Other enabled languages live under their short code — `/es`, `/es/<translated-slug>`, `/es/blog`, `/es/blog/<translated-slug>`. Manage languages in **Settings → Languages** (predefined list + Custom Language). Each language version is its own page row with its own translated slug, linked by "Translation Of" (`translation_group_id`); canonical is self-referencing per language and the full hreflang set (incl. `x-default` → the default version) is generated automatically. Seed data includes a worked Spanish example.
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
