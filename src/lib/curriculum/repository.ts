"use client";

/**
 * Data access di sisi client (sesuai rencana: Supabase client langsung dari
 * Client Components untuk menghemat kuota serverless Vercel).
 *
 * Jika Supabase belum dikonfigurasi atau user belum login, data diambil dari
 * SEED_CURRICULUM dan progress disimpan di localStorage, sehingga app tetap
 * bisa dicoba tanpa setup apa pun.
 */

import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { toISODate } from "./schedule";
import { SEED_CURRICULUM } from "./seed";
import type { ModuleWithLessons, PracticeEntry } from "./types";

const KEY = {
  progress: "piano.progress.v2",
  practice: "piano.practice.v2",
  startedOn: "piano.startedOn.v2",
};

function readLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeLocal(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode, kuota penuh, dsb. */
  }
}

async function currentUser() {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return { supabase: null, user: null };
  const { data } = await supabase.auth.getUser();
  return { supabase, user: data.user };
}

export async function fetchCurriculum(): Promise<ModuleWithLessons[]> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return SEED_CURRICULUM;

  const { data, error } = await supabase
    .from("modules")
    .select("*, lessons(*)")
    .order("level")
    .order("order_index", { referencedTable: "lessons" });

  if (error || !data?.length) return SEED_CURRICULUM;
  return data as ModuleWithLessons[];
}

export interface LearnerState {
  curriculum: ModuleWithLessons[];
  completed: Set<string>;
  practice: PracticeEntry[];
  /** Tanggal mulai belajar, YYYY-MM-DD. */
  startedOn: string;
  today: string;
  signedIn: boolean;
}

/** Semua yang dibutuhkan dashboard dalam satu panggilan. */
export async function fetchLearnerState(): Promise<LearnerState> {
  const today = toISODate(new Date());
  const [curriculum, { supabase, user }] = await Promise.all([fetchCurriculum(), currentUser()]);

  if (!supabase || !user) {
    let startedOn = readLocal<string | null>(KEY.startedOn, null);
    if (!startedOn) {
      startedOn = today;
      writeLocal(KEY.startedOn, startedOn);
    }
    return {
      curriculum,
      completed: new Set(Object.keys(readLocal<Record<string, string>>(KEY.progress, {}))),
      practice: readLocal<PracticeEntry[]>(KEY.practice, []),
      startedOn,
      today,
      signedIn: false,
    };
  }

  const [progress, practice, profile] = await Promise.all([
    supabase.from("user_progress").select("lesson_id").eq("user_id", user.id).eq("is_completed", true),
    supabase.from("practice_log").select("practiced_on, module_id, bpm").eq("user_id", user.id),
    supabase.from("profiles").select("started_on").eq("id", user.id).maybeSingle(),
  ]);

  return {
    curriculum,
    completed: new Set((progress.data ?? []).map((r) => r.lesson_id as string)),
    practice: (practice.data ?? []).map((r) => ({
      date: r.practiced_on as string,
      module_id: r.module_id as string,
      bpm: r.bpm as number,
    })),
    startedOn: (profile.data?.started_on as string | undefined) ?? today,
    today,
    signedIn: true,
  };
}

export async function markLessonComplete(lessonId: string): Promise<void> {
  const { supabase, user } = await currentUser();
  const now = new Date().toISOString();

  if (!supabase || !user) {
    writeLocal(KEY.progress, { ...readLocal<Record<string, string>>(KEY.progress, {}), [lessonId]: now });
    return;
  }

  const { error } = await supabase
    .from("user_progress")
    .upsert(
      { user_id: user.id, lesson_id: lessonId, is_completed: true, completed_at: now },
      { onConflict: "user_id,lesson_id" },
    );
  if (error) throw error;
}

/** Catat latihan harian hari ini (satu entri per tanggal; yang baru menimpa). */
export async function logPractice(entry: PracticeEntry): Promise<void> {
  const { supabase, user } = await currentUser();

  if (!supabase || !user) {
    const rest = readLocal<PracticeEntry[]>(KEY.practice, []).filter((p) => p.date !== entry.date);
    writeLocal(KEY.practice, [...rest, entry]);
    return;
  }

  const { error } = await supabase.from("practice_log").upsert(
    { user_id: user.id, practiced_on: entry.date, module_id: entry.module_id, bpm: entry.bpm },
    { onConflict: "user_id,practiced_on" },
  );
  if (error) throw error;
}
