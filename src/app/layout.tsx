import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Sarabun } from "next/font/google";
import { RevealObserver } from "@/components/reveal-observer";
import "./globals.css";

const sarabun = Sarabun({
  variable: "--font-sarabun",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Notes of Nopia",
  description:
    "Belajar piano di browser: 12 level selama 45 minggu, latihan 15 sampai 30 menit sehari, partitur interaktif, dan keyboard virtual.",
};

export const viewport: Viewport = {
  themeColor: "#e2e2e2",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${sarabun.variable} h-full antialiased`}>
      <head>
        {/* Tandai bahwa JS aktif agar animasi masuk hanya menyembunyikan konten saat bisa dimunculkan lagi */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="min-h-full">
        {children}
        <Suspense fallback={null}>
          <RevealObserver />
        </Suspense>
      </body>
    </html>
  );
}
