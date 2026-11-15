import "./globals.css";
import { headers } from "next/headers";
import { fullCodeForShort } from "@/lib/languages";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "MyRingCheck — Who Called Me?",
  description: "Check any unknown number for free.",
};

// <html lang> follows the page language: middleware marks prefixed
// requests with x-lang (short code, e.g. "es"); no prefix = English.
export default function RootLayout({ children }) {
  const short = headers().get("x-lang") || "en";
  const lang = fullCodeForShort(short);
  return (
    <html lang={lang}>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">{children}</body>
    </html>
  );
}
