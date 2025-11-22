import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mini Tools Library",
  description:
    "Browse and manage embeddable mini tools with a dedicated admin panel.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white text-zinc-900">
          <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/80 backdrop-blur">
            <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
              <Link href="/" className="text-lg font-semibold text-zinc-900">
                MiniTools
              </Link>
              <nav className="flex items-center gap-6 text-sm font-medium text-zinc-600">
                <Link
                  href="/"
                  className="transition hover:text-zinc-900"
                  prefetch={false}
                >
                  Catalog
                </Link>
                <Link
                  href="/admin"
                  className="transition hover:text-zinc-900"
                  prefetch={false}
                >
                  Admin
                </Link>
              </nav>
            </div>
          </header>
          <div className="pt-16">{children}</div>
        </div>
      </body>
    </html>
  );
}
