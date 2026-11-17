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
        <ul className="space-y-0.5">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = isActive(pathname, href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex h-9 items-center gap-2.5 rounded-md px-2.5 text-[15px] transition-colors",
                    active
                      ? "bg-[#d9d6d6] font-medium text-ink"
                      : "text-muted-foreground hover:bg-[#dedbdb] hover:text-ink",
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
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[#dcd8d8] bg-chrome pb-[env(safe-area-inset-bottom)] md:hidden"
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
                      "flex h-full touch-manipulation flex-col items-center justify-center gap-1 text-[12px] transition-colors active:bg-[#dedbdb]",
                      active ? "font-semibold text-ink" : "text-muted-foreground",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-7 w-14 items-center justify-center rounded-full transition-colors",
                        active && "bg-[#d9d6d6]",
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
    <Link href="/" className="flex items-center gap-2 text-[15px] font-semibold text-ink">
      <BrandMark className="size-8 text-oxblood" />
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
    <div className="fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-30 flex items-center gap-3 border-t border-[#e6e3e3] bg-white px-4 py-3 md:hidden">
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
    <div className="min-h-svh bg-chrome">
      {/* Ponsel: bar atas */}
      <header className="sticky top-0 z-30 flex h-12 items-center justify-between bg-chrome px-4 md:hidden">
        <Wordmark />
        <button
          type="button"
          onClick={() => setAccountOpen((v) => !v)}
          aria-expanded={accountOpen}
          aria-label={accountOpen ? "Tutup akun" : "Akun"}
          className="-mr-2 flex size-11 touch-manipulation items-center justify-center rounded-md text-ink active:bg-[#dedbdb]"
        >
          {accountOpen ? <X className="size-5" /> : <UserRound className="size-5" />}
        </button>
      </header>
      {accountOpen && (
        <div className="fixed inset-x-0 top-12 z-30 border-b border-[#dcd8d8] bg-chrome px-5 pt-2 pb-5 text-[16px] md:hidden">
          <AuthButton />
        </div>
      )}

      <div className="flex">
        {/* Desktop: sidebar di atas warna bingkai */}
        <aside className="sticky top-0 hidden h-svh w-[228px] shrink-0 flex-col px-3 pt-4 pb-5 md:flex">
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

        <main className="min-h-svh min-w-0 flex-1 bg-white pb-[calc(4rem+env(safe-area-inset-bottom))] md:my-2 md:mr-2 md:min-h-[calc(100svh-16px)] md:rounded-xl md:border md:border-[#e4e1e1] md:pb-0">
          {children}
        </main>
      </div>

      <TabBar />
    </div>
  );
}
