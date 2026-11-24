"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  if (pathname === "/admin/login") return null;

  // Demo parity: same order as the in-chat demo — Dashboard, Pages, Blogs,
  // Users, Live Site — plus Settings (v4 multilingual, approved separately).
  const links = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/pages", label: "Pages" },
    { href: "/admin/blogs", label: "Blogs" },
    { href: "/admin/users", label: "Users" },
    { href: "/", label: "Live Site" },
    { href: "/admin/settings/languages", label: "Settings" },
  ];

  function isActive(l) {
    if (l.href === "/") return pathname === "/";
    return pathname === l.href || (l.href !== "/admin" && pathname.startsWith(l.href));
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="w-full shrink-0 border-b bg-white md:sticky md:top-0 md:flex md:min-h-screen md:w-60 md:flex-col md:border-b-0 md:border-r">
      <div className="px-5 pb-3 pt-5 md:pb-5">
        <Link href="/admin" className="text-lg font-bold text-slate-900">
          Admin Panel
        </Link>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-1 md:flex-col md:overflow-visible md:px-3 md:pb-5">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium ${
              isActive(l) ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {l.label}
          </Link>
        ))}
      </nav>
      <div className="hidden flex-col gap-1 border-t px-3 py-4 md:flex">
        <Link href="/admin/blogs/new" className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white">
          + New Blog
        </Link>
        <button
          onClick={logout}
          className="rounded-md border px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-100"
        >
          Logout
        </button>
      </div>
      <div className="flex gap-2 px-4 pb-3 md:hidden">
        <Link href="/admin/blogs/new" className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white">
          + New Blog
        </Link>
        <button onClick={logout} className="rounded-md border px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100">
          Logout
        </button>
      </div>
    </aside>
  );
}
