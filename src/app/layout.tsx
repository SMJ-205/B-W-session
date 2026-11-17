import type { Metadata } from "next";
import { Suspense } from "react";
import { Libre_Franklin, Source_Serif_4 } from "next/font/google";
import { RevealObserver } from "@/components/reveal-observer";
import "./globals.css";

const franklin = Libre_Franklin({
  variable: "--font-franklin",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Piano Belajar",
  description:
    "Belajar piano di browser: 12 level selama 45 minggu, latihan 15 sampai 30 menit sehari, partitur interaktif, dan keyboard virtual.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${franklin.variable} ${sourceSerif.variable} h-full antialiased`}>
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
