import Link from "next/link";
import { getAllPages, isConfigured } from "@/lib/data";
import { getSessionUser, listAdminUsers } from "@/lib/session";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const pages = await getAllPages();
  const blogs = pages.filter((p) => p.type === "blog");
  const drafts = pages.filter((p) => p.status === "draft");
  const published = pages.filter((p) => p.status === "published");
  const configured = isConfigured();
  const { user } = await getSessionUser();
  const isBootstrap = Boolean(user?.bootstrap);

  // Real database check (v4.2 fix): "Connected" used to mean only that
  // env vars were present, while getAllPages() silently fell back to demo
  // data on error — so the Dashboard could show green while the Blogs
  // page failed with "permission denied for table pages". Now we run a
  // real query and show its error instead of hiding it.
  let dbError = null;
  if (isSupabaseConfigured()) {
    try {
      const admin = getSupabaseAdmin();
      const { error } = await admin.from("pages").select("id", { count: "exact", head: true });
      if (error) dbError = error.message;
    } catch (err) {
      dbError = err.message;
    }
  }
  const dbConnected = configured && !dbError;

  // Users count (cheap best-effort; "—" if it fails — never crash dashboard).
  let usersCount = "—";
  if (isSupabaseConfigured() && user?.role === "admin") {
    try {
      const users = await listAdminUsers();
      if (users) usersCount = users.length;
    } catch {
      usersCount = "—";
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      {isBootstrap && (
        <div className="rounded-md bg-red-100 px-4 py-3 text-sm font-medium text-red-900">
          Bootstrap mode — you are logged in with the temporary ADMIN_PASSWORD. Create the first
          admin under <Link href="/admin/users" className="underline">Users</Link>,
          then remove ADMIN_PASSWORD from Vercel and redeploy (see DEPLOY.md).
        </div>
      )}
      {!configured && (
        <div className="rounded-md bg-amber-100 px-4 py-3 text-sm font-medium text-amber-900">
          Demo data — connect Supabase to save changes
        </div>
      )}
      {dbError && (
        <div className="rounded-md bg-red-100 px-4 py-3 text-sm font-medium text-red-900">
          Database error: {dbError} — run supabase/fix-permissions.sql in Supabase SQL Editor, then refresh. The counts below are demo data until this is fixed.
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          ["Pages", pages.length, "/admin/pages"],
          ["Blogs", blogs.length, "/admin/blogs"],
          ["Drafts", drafts.length, "/admin/pages"],
          ["Published", published.length, "/admin/pages"],
          ["Users", usersCount, "/admin/users"],
        ].map(([label, count, href]) => (
          <Link key={label} href={href} className="rounded-lg border bg-white p-5 hover:shadow-sm">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-1 text-3xl font-bold">{count}</p>
          </Link>
        ))}
      </div>
      <div className="rounded-lg border bg-white p-5">
        <h2 className="mb-3 font-semibold">Database Status</h2>
        <p className="text-sm">
          DB Connected:{" "}
          <span className={`font-bold ${dbConnected ? "text-green-600" : "text-red-600"}`}>{dbConnected ? "● Connected" : "● Not connected"}</span>
        </p>
        <p className="mt-1 text-sm text-slate-500">
          {dbConnected
            ? "Supabase is configured — changes will be saved."
            : dbError
              ? "Supabase answered with an error — see the red box above."
              : "Supabase environment variables were not found — demo data is being shown. See DEPLOY.md."}
        </p>
        <div className="mt-4 flex gap-2">
          <a href="/api/admin/export?format=csv" className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white">Export CSV</a>
          <a href="/api/admin/export?format=sql" className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-slate-100">Export SQL</a>
          <Link href="/admin/pages/new" className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-slate-100">+ New Page</Link>
          <Link href="/admin/blogs/new" className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-slate-100">+ New Blog</Link>
        </div>
      </div>
      <div className="rounded-lg border bg-white p-5">
        <h2 className="mb-3 font-semibold">Recent Pages</h2>
        <ul className="divide-y text-sm">
          {pages.slice(0, 10).map((p) => (
            <li key={p.id} className="flex justify-between py-2">
              <span>{p.title || p.slug || "(no title)"} <span className="text-slate-400">/{p.slug} · {p.type}</span></span>
              <Link href={`/admin/pages/${p.id}`} className="text-blue-600 hover:underline">Edit →</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
