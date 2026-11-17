import { Suspense } from "react";
import { LessonView } from "@/components/lesson/lesson-view";

/**
 * Konten pelajaran diambil di client (Supabase client) agar hemat eksekusi
 * serverless Vercel. Promise params diteruskan ke client tanpa di-await di
 * sini supaya shell halaman tetap bisa diprerender (Cache Components).
 */
export default function LessonPage({ params }: PageProps<"/lessons/[id]">) {
  return (
    <Suspense
      fallback={<div className="mx-auto max-w-[1100px] px-6 py-16 text-muted-foreground">Memuat pelajaran…</div>}
    >
      <LessonView params={params} />
    </Suspense>
  );
}
