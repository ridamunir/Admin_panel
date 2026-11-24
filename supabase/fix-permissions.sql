-- Admin Panel — fix "permission denied for table pages" (v4.2)
-- Run this ONCE in Supabase Dashboard > SQL Editor > New query, then Run.
-- No redeploy needed. After it runs, refresh the Blogs page in the panel.
--
-- WHY: schema.sql created RLS "allow all" policies but never granted
-- access, so Postgres denied the query before RLS was even checked.
-- This grants access on all 5 tables to anon, authenticated and
-- service_role. It is safe to run more than once.
grant all on table pages, sections, variables, languages, admin_users to anon, authenticated, service_role;
grant all on all sequences in schema public to anon, authenticated, service_role;
grant usage on schema public to anon, authenticated, service_role;
