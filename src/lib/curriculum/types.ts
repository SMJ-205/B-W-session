// Mengikuti skema Supabase di supabase/migrations/0001_init.sql

export type ContentType = "text" | "interactive_sheet" | "quiz";
export type Clef = "treble" | "bass";

/** Tingkatan besar; tiap tier berisi 2 sampai 3 level. */
export const TIERS: Record<number, string> = {
  1: "Beginner",
  2: "Novice",
  3: "Intermediate",
  4: "Advanced",
  5: "Pro",
};

export interface Drill {
  /** Nama latihan harian, mis. "Scale C mayor naik-turun". */
  title: string;
  notation: string;
  clef: Clef;
  /** Tempo di sesi pertama level ini. */
  bpm_start: number;
  /** Tempo yang dituju di akhir level. */
  bpm_goal: number;
}

export interface Module {
  id: string;
  /** 1..12 */
  level: number;
  /** 1..5, lihat TIERS */
  tier: number;
  title: string;
  description: string;
  /** Lama level ini dalam minggu. */
  duration_weeks: number;
  /** Lama latihan yang disarankan per hari. */
  daily_minutes: number;
  /** Satu target untuk tiap minggu; panjangnya = duration_weeks. */
  weekly_targets: string[];
  drill: Drill;
}

export interface QuizQuestion {
  question: string;
  choices: string[];
  answer_index: number;
}

export interface Lesson {
  id: string;
  module_id: string;
  order_index: number;
  /** Minggu ke berapa di dalam level (1..duration_weeks). */
  week: number;
  title: string;
  content_type: ContentType;
  body: string | null;
  /** Notasi untuk VexFlow, mis. "C4/q, D4/q, E4/h". */
  notation_data: string | null;
  clef: Clef;
  /** Birama, mis. "4/4" atau "3/4". */
  time_signature: string;
  quiz: QuizQuestion[] | null;
}

export interface ModuleWithLessons extends Module {
  lessons: Lesson[];
}

/** Satu sesi latihan harian yang sudah dicatat. */
export interface PracticeEntry {
  /** Tanggal lokal, format YYYY-MM-DD. */
  date: string;
  module_id: string;
  bpm: number;
}
