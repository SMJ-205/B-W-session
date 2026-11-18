"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useState, type ReactNode } from "react";
import { Home, Map, Music2, UserRound, X } from "lucide-react";
import { AuthButton } from "@/components/auth-button";
import { BrandMark } from "@/components/brand-mark";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Beranda", short: "Beranda", icon: Home },
  { href: "/latihan", label: "Latihan harian", short: "Latihan", icon: Music2 },
  { href: "/peta", label: "Peta level", short: "Peta", icon: Map },
] as const;

const isActive = (pathname: string, href: string) =>
  pathname === href || (href === "/peta" && pathname.startsWith("/lessons"));

/** Membaca pathname di dalam Suspense (syarat Cache Components). */
function WithPathname({ children }: { children: (pathname: string) => ReactNode }) {
  return (
    <Suspense fallback={children("")}>
      <PathnameReader>{children}</PathnameReader>
    </Suspense>
  );
}

function PathnameReader({ children }: { children: (pathname: string) => ReactNode }) {
  return <>{children(usePathname())}</>;
}

function SideNav() {
  return (
    <WithPathname>
      {(pathname) => (
        <ul className="space-y-1.5">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = isActive(pathname, href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex h-11 items-center gap-2.5 rounded-[14px] border-2 px-3 text-[15px] font-bold transition-colors",
                    active
                      ? "border-ink bg-oxblood text-surface shadow-[3px_3px_0_var(--ink)]"
                      : "border-transparent text-muted-foreground hover:bg-surface/70 hover:text-ink",
                  )}
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </WithPathname>
  );
}

/** Ponsel: tab bar di bawah, dalam jangkauan ibu jari. */
function TabBar() {
  return (
    <nav
      aria-label="Navigasi utama"
      className="fixed inset-x-0 bottom-0 z-40 border-t-[2.5px] border-ink bg-surface pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <WithPathname>
        {(pathname) => (
          <ul className="grid h-16 grid-cols-3">
            {NAV.map(({ href, short, icon: Icon }) => {
              const active = isActive(pathname, href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex h-full touch-manipulation flex-col items-center justify-center gap-1 text-[12px] font-bold transition-colors",
                      active ? "text-ink" : "text-muted-foreground",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-7 w-14 items-center justify-center rounded-full border-2 transition-colors",
                        active ? "border-ink bg-oxblood text-surface" : "border-transparent",
                      )}
                    >
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    {short}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </WithPathname>
    </nav>
  );
}

function Wordmark() {
  return (
    <Link href="/" className="flex items-center gap-2 text-[16px] font-bold text-ink">
      <BrandMark className="size-9 text-ink" paper="var(--surface)" />
      Notes of Nopia
    </Link>
  );
}

/**
 * Bar aksi utama yang menempel di bawah layar ponsel (di atas tab bar).
 * Di md ke atas tidak dirender; halaman menaruh aksinya di tempat biasa.
 */
export function MobileActionBar({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-30 flex items-center gap-3 border-t-[2.5px] border-ink bg-surface px-4 py-3 md:hidden">
      {children}
    </div>
  );
}

/**
 * Bingkai L berwarna abu-abu (sidebar + bar atas) dengan lembar putih.
 * Di ponsel bingkai hilang: bar atas 48px, tab bar di bawah, dan lembar akun.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const [accountOpen, setAccountOpen] = useState(false);

  return (
    <div className="dotted min-h-svh">
      {/* Ponsel: bar atas */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b-[2.5px] border-ink bg-surface px-4 md:hidden">
        <Wordmark />
        <button
          type="button"
          onClick={() => setAccountOpen((v) => !v)}
          aria-expanded={accountOpen}
          aria-label={accountOpen ? "Tutup akun" : "Akun"}
          className="press flex size-10 touch-manipulation items-center justify-center rounded-[12px] border-2 border-ink bg-surface text-ink shadow-[2px_2px_0_var(--ink)]"
        >
          {accountOpen ? <X className="size-5" /> : <UserRound className="size-5" />}
        </button>
      </header>
      {accountOpen && (
        <div className="fixed inset-x-0 top-14 z-30 border-b-[2.5px] border-ink bg-surface px-5 pt-3 pb-5 text-[16px] md:hidden">
          <AuthButton />
        </div>
      )}

      <div className="flex">
        {/* Desktop: sidebar di atas warna bingkai */}
        <aside className="sticky top-0 hidden h-svh w-[236px] shrink-0 flex-col px-4 pt-5 pb-5 md:flex">
          <div className="px-2.5 pb-6">
            <Wordmark />
          </div>
          <nav aria-label="Navigasi utama">
            <SideNav />
          </nav>
          <div className="mt-auto px-2.5 text-[14px]">
            <AuthButton />
          </div>
        </aside>

        <main className="min-h-svh min-w-0 flex-1 pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0">
          {children}
        </main>
      </div>

      <TabBar />
    </div>
  );
}
