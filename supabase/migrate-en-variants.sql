-- ============================================================
-- Admin Panel v4.5 — English variants migration
-- Run ONCE in Supabase Dashboard → SQL Editor on an EXISTING
-- install (fresh installs get this from seed.sql already).
-- Idempotent: safe to run twice — the DO block below only changes
-- things that still need changing.
--
-- What it does:
--   1. The default language row (code 'en') becomes English (US):
--      full_code en-US, og locale en_US.
--   2. Adds English (UK) as a separate predefined language
--      (code 'en-gb', full_code en-GB, DISABLED by default).
--      Enable it in Settings → Languages when UK versions are wanted.
--   3. Existing pages labelled en-GB become en-US: they ARE the
--      default-variant pages (no-prefix URLs). Their content is not
--      changed — only the label. UK versions are created afterwards
--      from the page editor ("+ English (UK) version").
--   4. Shifts the other languages' sort_order by 1 to make room
--      for the UK row at position 1.
-- No redeploy is needed for the data change; the v4.5 code must
-- already be deployed (it reads these rows).
-- ============================================================

do $$
begin
  -- 1) Default row -> English (US).
  update languages
     set name = 'English (US)', full_code = 'en-US', og_locale = 'en_US'
   where code = 'en' and full_code <> 'en-US';

  -- 2) + 4) Add the UK row (disabled) and shift the rest down by 1,
  -- but only the first time this migration runs.
  if not exists (select 1 from languages where code = 'en-gb') then
    update languages
       set sort_order = sort_order + 1
     where code in ('es', 'fr', 'de', 'pt', 'it', 'nl', 'no', 'ur', 'ar', 'hi', 'tr');

    insert into languages (code, full_code, name, og_locale, is_default, enabled, is_custom, sort_order)
    values ('en-gb', 'en-GB', 'English (UK)', 'en_GB', false, false, false, 1);
  end if;

  -- 3) Existing default-variant pages: en-GB -> en-US.
  update pages set language_code = 'en-US' where language_code = 'en-GB';
end $$;

-- Verify with:
--   select code, full_code, name, is_default, enabled, sort_order from languages order by sort_order;
--   select distinct language_code from pages;
-- Expected: default row is ('en', 'en-US', 'English (US)', true, true);
-- 'en-gb' row exists, enabled = false; pages are 'en-US' (and 'es-ES'
-- for the Spanish demo pages).
