/**
 * Hitungan timeline belajar: minggu rencana, posisi aktual, tempo latihan
 * harian, dan streak. Semua fungsi murni agar mudah dites.
 */

import type { ModuleWithLessons, PracticeEntry } from "./types";

/** Asumsi sesi latihan per minggu untuk menaikkan tempo drill. */
export const SESSIONS_PER_WEEK = 5;

export function totalWeeks(curriculum: ModuleWithLessons[]): number {
  return curriculum.reduce((sum, m) => sum + m.duration_weeks, 0);
}

/** Minggu pertama (1-based, global) tiap level. */
export function levelStartWeeks(curriculum: ModuleWithLessons[]): Map<string, number> {
  const out = new Map<string, number>();
  let week = 1;
  for (const m of [...curriculum].sort((a, b) => a.level - b.level)) {
    out.set(m.id, week);
    week += m.duration_weeks;
  }
  return out;
}

/** Tanggal lokal YYYY-MM-DD. */
export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function daysBetween(fromISO: string, toISO: string): number {
  const [a, b] = [fromISO, toISO].map((s) => {
    const [y, m, d] = s.split("-").map(Number);
    return Date.UTC(y, m - 1, d);
  });
  return Math.round((b - a) / 86_400_000);
}

/** Minggu kalender sejak mulai belajar (1-based, dibatasi ke total minggu). */
export function calendarWeek(startedOn: string, today: string, total: number): number {
  return Math.min(total, Math.max(1, Math.floor(daysBetween(startedOn, today) / 7) + 1));
}

/** Level yang dijadwalkan untuk minggu global tertentu. */
export function plannedModule(curriculum: ModuleWithLessons[], week: number): ModuleWithLessons {
  const sorted = [...curriculum].sort((a, b) => a.level - b.level);
  let end = 0;
  for (const m of sorted) {
    end += m.duration_weeks;
    if (week <= end) return m;
  }
  return sorted[sorted.length - 1];
}

/**
 * Unlock: level 1 selalu terbuka; level berikutnya terbuka jika semua
 * pelajaran (termasuk kuis) di level sebelumnya selesai.
 */
export function computeUnlocked(curriculum: ModuleWithLessons[], completed: Set<string>): Set<string> {
  const unlocked = new Set<string>();
  const sorted = [...curriculum].sort((a, b) => a.level - b.level);
  sorted.forEach((m, i) => {
    const prev = sorted[i - 1];
    if (!prev || (unlocked.has(prev.id) && prev.lessons.every((l) => completed.has(l.id)))) {
      unlocked.add(m.id);
    }
  });
  return unlocked;
}

/** Level aktual: level terbuka pertama yang belum selesai (atau level terakhir). */
export function currentModule(curriculum: ModuleWithLessons[], completed: Set<string>): ModuleWithLessons {
  const sorted = [...curriculum].sort((a, b) => a.level - b.level);
  const unlocked = computeUnlocked(sorted, completed);
  return (
    sorted.find((m) => unlocked.has(m.id) && m.lessons.some((l) => !completed.has(l.id))) ??
    sorted[sorted.length - 1]
  );
}

/**
 * Minggu aktif di dalam level: minggu dari pelajaran pertama yang belum
 * selesai. Jika semua selesai, minggu terakhir.
 */
export function weekInModule(module: ModuleWithLessons, completed: Set<string>): number {
  const next = module.lessons.find((l) => !completed.has(l.id));
  return next ? next.week : module.duration_weeks;
}

/** Tempo latihan harian: naik bertahap dari bpm_start ke bpm_goal per sesi. */
export function drillBpm(module: ModuleWithLessons, sessionsDone: number): number {
  const { bpm_start, bpm_goal } = module.drill;
  const sessions = Math.max(2, module.duration_weeks * SESSIONS_PER_WEEK);
  const t = Math.min(1, sessionsDone / (sessions - 1));
  return Math.round((bpm_start + (bpm_goal - bpm_start) * t) / 2) * 2;
}

/** Hari berturut-turut berlatih sampai hari ini (atau kemarin, jika hari ini belum). */
export function streak(practice: PracticeEntry[], today: string): number {
  const dates = new Set(practice.map((p) => p.date));
  const cursor = new Date(`${today}T12:00:00`);
  if (!dates.has(today)) cursor.setDate(cursor.getDate() - 1);
  let n = 0;
  while (dates.has(toISODate(cursor))) {
    n++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return n;
}

/** Tanggal (YYYY-MM-DD) Senin sampai Minggu dari pekan yang memuat `today`. */
export function weekDates(today: string): string[] {
  const d = new Date(`${today}T12:00:00`);
  const offset = (d.getDay() + 6) % 7; // Senin = 0
  d.setDate(d.getDate() - offset);
  return Array.from({ length: 7 }, (_, i) => {
    const x = new Date(d);
    x.setDate(d.getDate() + i);
    return toISODate(x);
  });
}
