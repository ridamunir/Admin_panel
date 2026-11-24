-- Admin Panel — seed data (run AFTER schema.sql)
-- 8 foundational pages + 2 blogs + 1 hub (2 sub-pages) + 1 pillar (1 sub-page)
-- + 1 tool page. Fixed UUIDs so parent_id references work.
--
-- NOTE: admin_users is NOT seeded here — no real passwords are ever stored
-- in this file. The first admin is created via the DEPLOY.md flow
-- (Supabase Dashboard Add User + admin_users row, or the bootstrap login).

-- ---------- 8 foundational pages ----------
insert into pages (id, slug, type, title, language_code, meta_title, meta_description, canonical_url, status, publish_date) values
('00000000-0000-0000-0000-000000000001', '', 'foundational', 'Homepage', 'en-US', 'Who Called Me? Check Unknown Numbers — MyRingCheck', 'Check any unknown number for free. See spam reports, safety score and who called you — no sign-up needed.', '', 'published', '2026-11-12'),
('00000000-0000-0000-0000-000000000002', 'about-us', 'foundational', 'About Us', 'en-US', 'About Us — MyRingCheck', 'About MyRingCheck — why we built a free unknown-number checker.', '', 'published', '2026-11-12'),
('00000000-0000-0000-0000-000000000003', 'contact-us', 'foundational', 'Contact Us', 'en-US', 'Contact Us — MyRingCheck', 'Contact MyRingCheck.', '', 'published', '2026-11-12'),
('00000000-0000-0000-0000-000000000004', 'privacy-policy', 'foundational', 'Privacy Policy', 'en-US', 'Privacy Policy — MyRingCheck', 'How MyRingCheck uses your data.', '', 'published', '2026-11-12'),
('00000000-0000-0000-0000-000000000005', 'terms-and-conditions', 'foundational', 'Terms & Conditions', 'en-US', 'Terms & Conditions — MyRingCheck', 'Rules for using MyRingCheck.', '', 'published', '2026-11-12'),
('00000000-0000-0000-0000-000000000006', 'disclaimer', 'foundational', 'Disclaimer', 'en-US', 'Disclaimer — MyRingCheck', 'Disclaimer for MyRingCheck.', '', 'published', '2026-11-12'),
('00000000-0000-0000-0000-000000000007', 'cookie-policy', 'foundational', 'Cookie Policy', 'en-US', 'Cookie Policy — MyRingCheck', 'How MyRingCheck uses cookies.', '', 'published', '2026-11-12'),
('00000000-0000-0000-0000-000000000008', 'faqs', 'foundational', 'FAQs', 'en-US', 'FAQs — MyRingCheck', 'Frequently asked questions about MyRingCheck.', '', 'published', '2026-11-12')
on conflict (id) do nothing;

-- ---------- tool page ----------
insert into pages (id, slug, type, title, language_code, meta_title, meta_description, canonical_url, status, publish_date) values
('00000000-0000-0000-0000-000000000009', 'who-called-me', 'tool', 'Who Called Me', 'en-US', 'Who Called Me? Check Unknown Numbers — MyRingCheck', 'Check any unknown number for free. See spam reports, safety score and who called you.', '', 'published', '2026-11-12')
on conflict (id) do nothing;

-- ---------- hub + sub-pages ----------
insert into pages (id, slug, type, title, language_code, meta_title, meta_description, canonical_url, status, publish_date) values
('00000000-0000-0000-0000-000000000010', 'guides', 'hub', 'Guides', 'en-US', 'Guides — MyRingCheck', 'Guides to checking unknown numbers and staying safe from scam calls.', '', 'published', '2026-11-12'),
('00000000-0000-0000-0000-000000000011', 'how-to-report-a-scam-call', 'subpage', 'How to Report a Scam Call', 'en-US', 'How to Report a Scam Call — MyRingCheck', 'How to report a scam call step by step.', '', 'published', '2026-11-12'),
('00000000-0000-0000-0000-000000000012', 'what-is-caller-id-spoofing', 'subpage', 'What Is Caller ID Spoofing?', 'en-US', 'What Is Caller ID Spoofing? — MyRingCheck', 'What caller ID spoofing is and how to spot it.', '', 'published', '2026-11-12')
on conflict (id) do nothing;
update pages set parent_id = '00000000-0000-0000-0000-000000000010' where id in ('00000000-0000-0000-0000-000000000011','00000000-0000-0000-0000-000000000012');

-- ---------- pillar + sub-page ----------
insert into pages (id, slug, type, title, language_code, meta_title, meta_description, canonical_url, status, publish_date) values
('00000000-0000-0000-0000-000000000013', 'who-called-me-guide', 'pillar', 'Who Called Me Guide', 'en-US', 'Who Called Me Guide — MyRingCheck', 'The complete guide to unknown numbers, spam calls and scam callers.', '', 'published', '2026-11-12'),
('00000000-0000-0000-0000-000000000014', 'uk-area-codes-explained', 'subpage', 'UK Area Codes Explained', 'en-US', 'UK Area Codes Explained — MyRingCheck', 'What UK area codes mean and which ones scammers spoof most.', '', 'published', '2026-11-12')
on conflict (id) do nothing;
update pages set parent_id = '00000000-0000-0000-0000-000000000013' where id = '00000000-0000-0000-0000-000000000014';

-- ---------- blogs ----------
insert into pages (id, slug, type, title, language_code, meta_title, meta_description, canonical_url, status, publish_date) values
('00000000-0000-0000-0000-000000000015', 'how-to-check-an-unknown-number', 'blog', 'How to Check an Unknown Number', 'en-US', 'How to Check an Unknown Number — MyRingCheck', 'How to check an unknown number for free, step by step.', '', 'published', '2026-11-12'),
('00000000-0000-0000-0000-000000000016', '5-signs-a-call-is-a-scam', 'blog', '5 Signs a Call Is a Scam', 'en-US', '5 Signs a Call Is a Scam — MyRingCheck', 'Five warning signs that a call is a scam.', '', 'draft', null)
on conflict (id) do nothing;

-- ---------- sections ----------
insert into sections (id, page_id, title, sort_order) values
('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Hero Section', 0),
('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'How It Works', 1),
('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', 'Hero Section', 0),
('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000003', 'Hero Section', 0),
('10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000004', 'Hero Section', 0),
('10000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000005', 'Hero Section', 0),
('10000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000006', 'Hero Section', 0),
('10000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000007', 'Hero Section', 0),
('10000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000009', 'Hero Section', 0),
('10000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000009', 'How It Works', 1),
('10000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000008', 'FAQ Section', 0),
('10000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000010', 'Hero Section', 0),
('10000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000011', 'Hero Section', 0),
('10000000-0000-0000-0000-000000000014', '00000000-0000-0000-0000-000000000012', 'Hero Section', 0),
('10000000-0000-0000-0000-000000000015', '00000000-0000-0000-0000-000000000013', 'Hero Section', 0),
('10000000-0000-0000-0000-000000000016', '00000000-0000-0000-0000-000000000014', 'Hero Section', 0),
('10000000-0000-0000-0000-000000000017', '00000000-0000-0000-0000-000000000015', 'Blog Content', 0),
('10000000-0000-0000-0000-000000000018', '00000000-0000-0000-0000-000000000016', 'Blog Content', 0)
on conflict (id) do nothing;

-- ---------- variables ----------
insert into variables (id, section_id, name, value_html, sort_order) values
('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'hero_heading', '<h1>Who Called Me?</h1>', 0),
('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'hero_subtext', '<p>Enter any UK number and instantly see spam reports, safety score and who called you.</p>', 1),
('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000002', 'how_step1_title', '<h2>1. Enter the number</h2>', 0),
('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000002', 'how_step1_text', '<p>Type the unknown number in the search box above.</p>', 1),
('20000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000003', 'hero_heading', '<h1>About Us</h1>', 0),
('20000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000004', 'hero_heading', '<h1>Contact Us</h1>', 0),
('20000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000005', 'hero_heading', '<h1>Privacy Policy</h1>', 0),
('20000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000006', 'hero_heading', '<h1>Terms &amp; Conditions</h1>', 0),
('20000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000009', 'hero_heading', '<h1>Who Called Me?</h1>', 0),
('20000000-0000-0000-0000-000000000010', '10000000-0000-0000-0000-000000000009', 'hero_subtext', '<p>Check any unknown number in seconds. 100% free. No sign-up needed.</p>', 1),
('20000000-0000-0000-0000-000000000011', '10000000-0000-0000-0000-000000000010', 'how_step1_title', '<h2>Step 1 — Search the number</h2>', 0),
('20000000-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000010', 'how_step1_text', '<p>Enter the full number, including the area code.</p>', 1),
('20000000-0000-0000-0000-000000000013', '10000000-0000-0000-0000-000000000010', 'how_step2_title', '<h2>Step 2 — Read the reports</h2>', 2),
('20000000-0000-0000-0000-000000000014', '10000000-0000-0000-0000-000000000010', 'how_step2_text', '<p>See what other people reported about this caller.</p>', 3),
('20000000-0000-0000-0000-000000000015', '10000000-0000-0000-0000-000000000010', 'how_step3_title', '<h2>Step 3 — Report it yourself</h2>', 4),
('20000000-0000-0000-0000-000000000016', '10000000-0000-0000-0000-000000000010', 'how_step3_text', '<p>Leave your own report so the next person is warned too.</p>', 5),
('20000000-0000-0000-0000-000000000017', '10000000-0000-0000-0000-000000000007', 'hero_heading', '<h1>Disclaimer</h1>', 0),
('20000000-0000-0000-0000-000000000018', '10000000-0000-0000-0000-000000000008', 'hero_heading', '<h1>Cookie Policy</h1>', 0),
('20000000-0000-0000-0000-000000000019', '10000000-0000-0000-0000-000000000011', 'faq_q1', '<h2>Is this service free?</h2>', 0),
('20000000-0000-0000-0000-000000000020', '10000000-0000-0000-0000-000000000011', 'faq_a1', '<p>Yes, checking a number is 100% free.</p>', 1),
('20000000-0000-0000-0000-000000000021', '10000000-0000-0000-0000-000000000012', 'hero_heading', '<h1>Guides</h1>', 0),
('20000000-0000-0000-0000-000000000022', '10000000-0000-0000-0000-000000000013', 'hero_heading', '<h1>How to Report a Scam Call</h1>', 0),
('20000000-0000-0000-0000-000000000023', '10000000-0000-0000-0000-000000000014', 'hero_heading', '<h1>What Is Caller ID Spoofing?</h1>', 0),
('20000000-0000-0000-0000-000000000024', '10000000-0000-0000-0000-000000000015', 'hero_heading', '<h1>Who Called Me Guide</h1>', 0),
('20000000-0000-0000-0000-000000000025', '10000000-0000-0000-0000-000000000016', 'hero_heading', '<h1>UK Area Codes Explained</h1>', 0),
('20000000-0000-0000-0000-000000000026', '10000000-0000-0000-0000-000000000017', 'blog_content', '<h2>Check the number before you call back</h2><p>Search the number on this site first. If other people reported it as spam, do not call it back.</p>', 0),
('20000000-0000-0000-0000-000000000027', '10000000-0000-0000-0000-000000000018', 'blog_content', '<h2>1. They ask for a code</h2><p>A real bank never asks for your one-time code on a call.</p>', 0)
on conflict (id) do nothing;

-- ---------- languages (predefined list; v4.5: default is English (US), English (UK) is a separate disabled-by-default option) ----------
insert into languages (code, full_code, name, og_locale, is_default, enabled, is_custom, sort_order) values
('en', 'en-US', 'English (US)', 'en_US', true, true, false, 0),
('en-gb', 'en-GB', 'English (UK)', 'en_GB', false, false, false, 1),
('es', 'es-ES', 'Spanish', 'es_ES', false, true, false, 2),
('fr', 'fr-FR', 'French', 'fr_FR', false, false, false, 3),
('de', 'de-DE', 'German', 'de_DE', false, false, false, 4),
('pt', 'pt-PT', 'Portuguese', 'pt_PT', false, false, false, 5),
('it', 'it-IT', 'Italian', 'it_IT', false, false, false, 6),
('nl', 'nl-NL', 'Dutch', 'nl_NL', false, false, false, 7),
('no', 'no-NO', 'Norwegian', 'no_NO', false, false, false, 8),
('ur', 'ur-PK', 'Urdu', 'ur_PK', false, false, false, 9),
('ar', 'ar-SA', 'Arabic', 'ar_SA', false, false, false, 10),
('hi', 'hi-IN', 'Hindi', 'hi_IN', false, false, false, 11),
('tr', 'tr-TR', 'Turkish', 'tr_TR', false, false, false, 12)
on conflict (code) do nothing;

-- ---------- translation groups: every existing page starts as its own group ----------
update pages set translation_group_id = id where translation_group_id is null;

-- ---------- Spanish demo pages (translated slugs, linked by translation_group_id) ----------
insert into pages (id, slug, type, title, language_code, translation_group_id, meta_title, meta_description, canonical_url, status, publish_date) values
('00000000-0000-0000-0000-000000000017', '', 'foundational', 'Página principal (Español)', 'es-ES', '00000000-0000-0000-0000-000000000001', '¿Quién me llamó? Comprueba números desconocidos — MyRingCheck', 'Comprueba cualquier número desconocido gratis. Consulta informes de spam y quién te llamó.', '', 'published', '2026-11-12'),
('00000000-0000-0000-0000-000000000018', 'quien-me-llamo', 'tool', 'Quién me llamó', 'es-ES', '00000000-0000-0000-0000-000000000009', '¿Quién me llamó? Comprueba números desconocidos — MyRingCheck', 'Comprueba cualquier número desconocido gratis y consulta los informes de spam.', '', 'published', '2026-11-12'),
('00000000-0000-0000-0000-000000000019', 'como-comprobar-un-numero-desconocido', 'blog', 'Cómo comprobar un número desconocido', 'es-ES', '00000000-0000-0000-0000-000000000015', 'Cómo comprobar un número desconocido — MyRingCheck', 'Cómo comprobar un número desconocido gratis, paso a paso.', '', 'published', '2026-11-12')
on conflict (id) do nothing;

insert into sections (id, page_id, title, sort_order) values
('10000000-0000-0000-0000-000000000019', '00000000-0000-0000-0000-000000000017', 'Hero Section', 0),
('10000000-0000-0000-0000-000000000020', '00000000-0000-0000-0000-000000000018', 'Hero Section', 0),
('10000000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000019', 'Blog Content', 0)
on conflict (id) do nothing;

insert into variables (id, section_id, name, value_html, sort_order) values
('20000000-0000-0000-0000-000000000028', '10000000-0000-0000-0000-000000000019', 'hero_heading', '<h1>¿Quién me llamó?</h1>', 0),
('20000000-0000-0000-0000-000000000029', '10000000-0000-0000-0000-000000000019', 'hero_subtext', '<p>Introduce cualquier número y consulta al instante los informes de spam y quién te llamó.</p>', 1),
('20000000-0000-0000-0000-000000000030', '10000000-0000-0000-0000-000000000020', 'hero_heading', '<h1>¿Quién me llamó?</h1>', 0),
('20000000-0000-0000-0000-000000000031', '10000000-0000-0000-0000-000000000021', 'blog_content', '<h2>Comprueba el número antes de devolver la llamada</h2><p>Busca primero el número en este sitio. Si otras personas lo han denunciado como spam, no devuelvas la llamada.</p>', 0)
on conflict (id) do nothing;
