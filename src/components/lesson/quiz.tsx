"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { QuizQuestion } from "@/lib/curriculum/types";
import { cn } from "@/lib/utils";

export function Quiz({
  questions,
  passed: alreadyPassed = false,
  onPassed,
}: {
  questions: QuizQuestion[];
  passed?: boolean;
  onPassed: () => void;
}) {
  const [answers, setAnswers] = useState<(number | null)[]>(() => questions.map(() => null));
  const [submitted, setSubmitted] = useState(false);

  const correct = answers.filter((a, i) => a === questions[i].answer_index).length;
  const passed = submitted && correct === questions.length;

  return (
    <div className="space-y-8">
      {questions.map((q, qi) => (
        <fieldset key={qi} className="space-y-3">
          <legend className="mb-3 text-[18px] leading-snug font-bold text-ink">
            {qi + 1}. {q.question}
          </legend>
          <div className="grid gap-3 sm:grid-cols-3">
            {q.choices.map((choice, ci) => {
              const chosen = answers[qi] === ci;
              const right = submitted && chosen && ci === q.answer_index;
              const wrong = submitted && chosen && ci !== q.answer_index;
              return (
                <button
                  key={ci}
                  type="button"
                  aria-pressed={chosen}
                  onClick={() => {
                    setSubmitted(false);
                    setAnswers((a) => a.map((v, i) => (i === qi ? ci : v)));
                  }}
                  className={cn(
                    "press flex min-h-14 touch-manipulation items-center justify-between gap-2 rounded-[14px] border-[2.5px] border-ink px-4 py-3 text-left text-[16px] font-bold shadow-[3px_3px_0_var(--ink)]",
                    !chosen && "bg-white text-ink hover:bg-hi",
                    chosen && !wrong && "bg-ink text-white",
                    wrong && "border-dashed bg-hi text-ink",
                  )}
                >
                  <span>{choice}</span>
                  {right && <Check className="size-5" aria-label="Benar" />}
                  {wrong && <X className="size-5" aria-label="Belum tepat" />}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}

      <div className="flex flex-wrap items-center gap-4">
        <Button
          size="lg"
          disabled={answers.some((a) => a === null)}
          onClick={() => {
            setSubmitted(true);
            if (correct === questions.length) onPassed();
          }}
        >
          Cek jawabanku
        </Button>
        <p className="text-[16px] font-bold text-ink" aria-live="polite">
          {submitted
            ? passed
              ? "Hore, semua benar! Kuis lulus."
              : `${correct} dari ${questions.length} benar. Ganti jawaban yang bertanda silang, lalu cek lagi.`
            : alreadyPassed && <span className="font-normal text-muted-foreground">Kuis ini sudah kamu lulus.</span>}
        </p>
      </div>
    </div>
  );
}
