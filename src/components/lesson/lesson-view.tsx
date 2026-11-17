"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotationPlayer } from "@/components/music/notation-player";
import { VirtualKeyboard } from "@/components/music/virtual-keyboard";
import { useLearner } from "@/components/app/use-learner";
import { Quiz } from "./quiz";
import { markLessonComplete } from "@/lib/curriculum/repository";
import { TIERS } from "@/lib/curriculum/types";

export function LessonView({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { state, derived: d, reload } = useLearner();
  const [saving, setSaving] = useState(false);

  const shell = (children: React.ReactNode) => (
    <div className="mx-auto max-w-[1100px] px-4 pt-10 pb-20 sm:px-6 md:pt-[72px]">{children}</div>
  );

  if (!state || !d) return shell(<p className="text-muted-foreground">Memuat pelajaran…</p>);

  const mod = state.curriculum.find((m) => m.lessons.some((l) => l.id === id));
  if (!mod) return shell(<p className="text-ink">Pelajaran ini tidak ditemukan.</p>);

  if (!d.unlocked.has(mod.id)) {
    return shell(
      <div className="max-w-[640px] rounded-xl bg-panel p-6">
        <h1 className="text-[22px] font-semibold text-ink">Level {mod.level} masih terkunci</h1>
        <p className="mt-2 text-[17px] leading-relaxed text-ink">
          Selesaikan semua pelajaran dan kuis di Level {mod.level - 1} untuk membukanya.
        </p>
        <Link href="/peta" className="mt-4 inline-block text-[15px] text-oxblood underline underline-offset-4">
          Buka peta level
        </Link>
      </div>,
    );
  }

  const idx = mod.lessons.findIndex((l) => l.id === id);
  const lesson = mod.lessons[idx];
  const next = mod.lessons[idx + 1] ?? null;
  const done = state.completed.has(lesson.id);
  const start = d.starts.get(mod.id) ?? 1;

  const complete = async () => {
    setSaving(true);
    try {
      await markLessonComplete(lesson.id);
      reload();
    } finally {
      setSaving(false);
    }
  };

  return shell(
    <article>
      <header data-reveal className="max-w-[820px]">
        <p className="text-[15px] text-muted-foreground">
          <Link href="/peta" className="hover:text-ink hover:underline">
            Peta level
          </Link>{" "}
          / <Link href={`/peta#level-${mod.level}`} className="hover:text-ink hover:underline">
            Level {mod.level} ({TIERS[mod.tier]})
          </Link>{" "}
          / Minggu {start + lesson.week - 1}
        </p>
        <h1 className="mt-2 text-[24px] leading-tight font-semibold text-ink md:text-[30px]">{lesson.title}</h1>
        {lesson.body && (
          <p className="mt-3 max-w-[68ch] font-serif text-[18px] leading-[1.6] text-ink">{lesson.body}</p>
        )}
      </header>

      <div data-reveal className="mt-8">
        {lesson.content_type === "interactive_sheet" && lesson.notation_data && (
          <section className="rounded-xl border border-border bg-white p-5">
            <h2 className="sr-only">Partitur</h2>
            <NotationPlayer
              notation={lesson.notation_data}
              clef={lesson.clef}
              timeSignature={lesson.time_signature}
            />
          </section>
        )}

        {lesson.content_type === "text" && (
          <section className="rounded-xl border border-border bg-white p-5">
            <h2 className="mb-4 text-[14px] font-semibold text-ink">Coba di keyboard</h2>
            <VirtualKeyboard />
          </section>
        )}

        {lesson.content_type === "quiz" && lesson.quiz && (
          <section className="max-w-[820px] rounded-xl bg-panel p-5 md:p-6">
            <h2 className="mb-5 text-[14px] font-semibold text-ink">
              {lesson.quiz.length} pertanyaan; semua harus benar untuk lulus
            </h2>
            <Quiz questions={lesson.quiz} passed={done} onPassed={complete} />
          </section>
        )}
      </div>

      <footer className="mt-8 flex flex-wrap items-center gap-3">
        {lesson.content_type !== "quiz" && (
          <Button onClick={complete} disabled={done || saving} size="lg">
            {done ? (
              <>
                <Check /> Selesai
              </>
            ) : saving ? (
              "Menyimpan…"
            ) : (
              "Tandai selesai"
            )}
          </Button>
        )}
        {next ? (
          <Button
            variant="secondary"
            size="lg"
            disabled={!done}
            onClick={() => router.push(`/lessons/${next.id}`)}
          >
            Lanjut: {next.title}
          </Button>
        ) : (
          done && (
            <Button variant="secondary" size="lg" onClick={() => router.push("/dashboard")}>
              Kembali ke beranda
            </Button>
          )
        )}
      </footer>
    </article>,
  );
}
