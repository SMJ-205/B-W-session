"use client";

import { useState } from "react";
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
    <div className="space-y-7">
      {questions.map((q, qi) => (
        <fieldset key={qi} className="space-y-3">
          <legend className="mb-3 text-[17px] font-semibold text-ink">{q.question}</legend>
          <div className="grid gap-2 sm:grid-cols-3">
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
                    "key-shape min-h-12 px-4 py-2.5 text-left text-[15px] transition-colors",
                    !chosen && "bg-white text-ink hover:bg-[#ebe9e9]",
                    chosen && !submitted && "bg-ink text-white",
                    right && "bg-ink text-white",
                    wrong && "bg-oxblood text-paper",
                  )}
                >
                  {choice}
                  {wrong && <span className="sr-only"> (salah)</span>}
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
          Periksa jawaban
        </Button>
        <p className="text-[15px]" aria-live="polite">
          {submitted ? (
            passed ? (
              <span className="text-ink">Semua benar. Kuis lulus.</span>
            ) : (
              <span className="text-oxblood">
                {correct} dari {questions.length} benar. Ganti jawaban yang merah, lalu periksa lagi.
              </span>
            )
          ) : (
            alreadyPassed && <span className="text-muted-foreground">Kuis ini sudah pernah kamu lulus.</span>
          )}
        </p>
      </div>
    </div>
  );
}
