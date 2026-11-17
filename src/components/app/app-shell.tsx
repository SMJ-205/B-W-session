"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useState, type ReactNode } from "react";
import { Home, Map, Menu, Music2, X } from "lucide-react";
import { AuthButton } from "@/components/auth-button";
import { BrandMark } from "@/components/brand-mark";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Beranda", icon: Home },
  { href: "/latihan", label: "Latihan harian", icon: Music2 },
  { href: "/peta", label: "Peta level", icon: Map },
] as const;

function NavLinks(props: { onNavigate?: () => void }) {
  return (
    <Suspense fallback={<NavList pathname="" {...props} />}>
      <ActiveNavLinks {...props} />
    </Suspense>
  );
}

function ActiveNavLinks(props: { onNavigate?: () => void }) {
  return <NavList pathname={usePathname()} {...props} />;
}

function NavList({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <ul className="space-y-0.5">
      {NAV.map(({ href, label, icon: Icon }) => {
        const active =
          pathname === href || (href === "/peta" && pathname.startsWith("/lessons"));
        return (
          <li key={href}>
            <Link
              href={href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex h-9 items-center gap-2.5 rounded-md px-2.5 text-[15px] transition-colors",
                active ? "bg-[#d9d6d6] font-medium text-ink" : "text-muted-foreground hover:bg-[#dedbdb] hover:text-ink",
              )}
            >
              <Icon className="size-4" aria-hidden="true" />
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function Wordmark() {
  return (
    <Link href="/" className="flex items-center gap-2 text-[15px] font-semibold text-ink">
      <BrandMark className="text-oxblood" />
      Piano Belajar
    </Link>
  );
}

/**
 * Bingkai L berwarna abu-abu (sidebar + bar atas) dengan lembar putih.
 * Di ponsel bingkai hilang: bar atas 48px dan menu lembaran.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-svh bg-chrome">
      {/* Ponsel: bar atas */}
      <header className="sticky top-0 z-30 flex h-12 items-center justify-between bg-chrome px-4 md:hidden">
        <Wordmark />
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Tutup menu" : "Buka menu"}
          className="flex size-10 items-center justify-center rounded-md text-ink hover:bg-[#dedbdb]"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </header>
      {open && (
        <div className="fixed inset-x-0 top-12 bottom-0 z-20 bg-chrome px-4 py-4 md:hidden">
          <NavLinks onNavigate={() => setOpen(false)} />
          <div className="mt-6 px-2.5 text-[15px]">
            <AuthButton />
          </div>
        </div>
      )}

      <div className="flex">
        {/* Desktop: sidebar di atas warna bingkai */}
        <aside className="sticky top-0 hidden h-svh w-[228px] shrink-0 flex-col px-3 pt-4 pb-5 md:flex">
          <div className="px-2.5 pb-6">
            <Wordmark />
          </div>
          <nav aria-label="Navigasi utama">
            <NavLinks />
          </nav>
          <div className="mt-auto px-2.5 text-[14px]">
            <AuthButton />
          </div>
        </aside>

        <main className="min-h-svh min-w-0 flex-1 bg-white md:my-2 md:mr-2 md:min-h-[calc(100svh-16px)] md:rounded-xl md:border md:border-[#e4e1e1]">
          {children}
        </main>
      </div>
    </div>
  );
}
