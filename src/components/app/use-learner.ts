"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchLearnerState, type LearnerState } from "@/lib/curriculum/repository";
import {
  calendarWeek,
  computeUnlocked,
  currentModule,
  drillBpm,
  levelStartWeeks,
  plannedModule,
  streak,
  totalWeeks,
  weekInModule,
} from "@/lib/curriculum/schedule";

/** Memuat state belajar dan menurunkan semua angka yang dipakai layar. */
export function useLearner() {
  const [state, setState] = useState<LearnerState | null>(null);

  const reload = useCallback(() => {
    fetchLearnerState().then(setState);
  }, []);

  useEffect(reload, [reload]);

  const derived = useMemo(() => {
    if (!state) return null;
    const { curriculum, completed, practice, startedOn, today } = state;
    const total = totalWeeks(curriculum);
    const starts = levelStartWeeks(curriculum);
    const current = currentModule(curriculum, completed);
    const week = weekInModule(current, completed);
    /** Minggu global posisi aktual. */
    const actualWeek = (starts.get(current.id) ?? 1) + week - 1;
    const planWeek = calendarWeek(startedOn, today, total);
    const planned = plannedModule(curriculum, planWeek);
    const sessionsInLevel = practice.filter((p) => p.module_id === current.id).length;
    const todayEntry = practice.find((p) => p.date === today) ?? null;
    // Jika hari ini sudah latihan, tempo hari ini tetap tempo yang tercatat.
    const bpmToday = todayEntry?.bpm ?? drillBpm(current, sessionsInLevel);
    const lessonsTotal = curriculum.reduce((n, m) => n + m.lessons.length, 0);

    return {
      total,
      starts,
      current,
      week,
      actualWeek,
      planWeek,
      planned,
      /** Positif = tertinggal sekian minggu dari kalender. */
      weeksBehind: planWeek - actualWeek,
      unlocked: computeUnlocked(curriculum, completed),
      sessionsInLevel,
      sessionsGoal: current.duration_weeks * 5,
      todayEntry,
      bpmToday,
      streak: streak(practice, today),
      lessonsDone: completed.size,
      lessonsTotal,
      lessonsThisWeek: current.lessons.filter((l) => l.week === week),
    };
  }, [state]);

  return { state, derived, reload };
}

export type Learner = NonNullable<ReturnType<typeof useLearner>["derived"]>;

const DATE_FMT = new Intl.DateTimeFormat("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
const SHORT_FMT = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" });

export const formatDate = (iso: string, short = false) =>
  (short ? SHORT_FMT : DATE_FMT).format(new Date(`${iso}T12:00:00`));
