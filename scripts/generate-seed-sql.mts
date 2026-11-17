/**
 * Membuat supabase/seed.sql dari src/lib/curriculum/seed.ts agar konten
 * fallback lokal dan isi database selalu sama.
 *
 *   npm run db:seed-sql
 */
import { writeFileSync } from "node:fs";
import { SEED_CURRICULUM } from "../src/lib/curriculum/seed.ts";

const q = (v: unknown) =>
  v === null || v === undefined ? "null" : `'${String(v).replace(/'/g, "''")}'`;
const j = (v: unknown) => `${q(JSON.stringify(v))}::jsonb`;

const lines: string[] = [
  "-- AUTO-GENERATED oleh scripts/generate-seed-sql.mts; jangan edit manual.",
  "begin;",
];

for (const m of SEED_CURRICULUM) {
  lines.push(
    `insert into public.modules (id, level, tier, title, description, duration_weeks, daily_minutes, weekly_targets, drill) values (${[
      q(m.id), m.level, m.tier, q(m.title), q(m.description), m.duration_weeks, m.daily_minutes, j(m.weekly_targets), j(m.drill),
    ].join(", ")})`,
    `  on conflict (id) do update set level = excluded.level, tier = excluded.tier, title = excluded.title, description = excluded.description, duration_weeks = excluded.duration_weeks, daily_minutes = excluded.daily_minutes, weekly_targets = excluded.weekly_targets, drill = excluded.drill;`,
  );
  for (const l of m.lessons) {
    lines.push(
      `insert into public.lessons (id, module_id, order_index, week, title, content_type, body, notation_data, clef, time_signature, quiz) values (${[
        q(l.id), q(l.module_id), l.order_index, l.week, q(l.title), q(l.content_type), q(l.body), q(l.notation_data),
        q(l.clef), q(l.time_signature), l.quiz ? j(l.quiz) : "null",
      ].join(", ")})`,
      `  on conflict (id) do update set order_index = excluded.order_index, week = excluded.week, title = excluded.title, content_type = excluded.content_type, body = excluded.body, notation_data = excluded.notation_data, clef = excluded.clef, time_signature = excluded.time_signature, quiz = excluded.quiz;`,
    );
  }
}

lines.push("commit;", "");
writeFileSync(new URL("../supabase/seed.sql", import.meta.url), lines.join("\n"));
console.log(`supabase/seed.sql diperbarui: ${SEED_CURRICULUM.length} level, ${SEED_CURRICULUM.reduce((n, m) => n + m.lessons.length, 0)} pelajaran.`);
