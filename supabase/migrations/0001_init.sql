-- Skema awal aplikasi belajar piano.
-- Jalankan via Supabase SQL Editor atau `supabase db push`, lalu supabase/seed.sql.
-- Akun user memakai auth.users bawaan Supabase, ditambah tabel profiles.

create extension if not exists "pgcrypto";

-- Profil user (1:1 dengan auth.users). started_on = awal timeline 45 minggu.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name varchar(120),
  started_on date not null default current_date,
  created_at timestamptz not null default now()
);

-- Level kurikulum (12 level dalam 5 tier, total 45 minggu)
create table if not exists public.modules (
  id uuid primary key default gen_random_uuid(),
  level int not null unique check (level between 1 and 12),
  tier int not null check (tier between 1 and 5),
  title varchar(200) not null,
  description text not null,
  duration_weeks int not null check (duration_weeks > 0),
  daily_minutes int not null check (daily_minutes > 0),
  weekly_targets jsonb not null,  -- string[]; panjang = duration_weeks
  drill jsonb not null,           -- {title, notation, clef, bpm_start, bpm_goal}
  created_at timestamptz not null default now(),
  constraint weekly_targets_match check (jsonb_array_length(weekly_targets) = duration_weeks)
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules (id) on delete cascade,
  order_index int not null,
  week int not null check (week > 0),  -- minggu ke berapa di dalam level
  title varchar(200) not null,
  content_type varchar(32) not null check (content_type in ('text', 'interactive_sheet', 'quiz')),
  body text,
  notation_data text,                  -- mis. "C4/q, D4/q, (C4 E4 G4)/h"
  clef varchar(8) not null default 'treble' check (clef in ('treble', 'bass')),
  time_signature varchar(8) not null default '4/4',
  quiz jsonb,                          -- [{question, choices[], answer_index}]
  created_at timestamptz not null default now(),
  unique (module_id, order_index)
);

create table if not exists public.user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  is_completed boolean not null default false,
  completed_at timestamptz,
  unique (user_id, lesson_id)
);

-- Latihan harian: satu baris per user per tanggal
create table if not exists public.practice_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  practiced_on date not null,
  module_id uuid not null references public.modules (id) on delete cascade,
  bpm int not null check (bpm between 20 and 300),
  created_at timestamptz not null default now(),
  unique (user_id, practiced_on)
);

create index if not exists lessons_module_idx on public.lessons (module_id, order_index);
create index if not exists user_progress_user_idx on public.user_progress (user_id);
create index if not exists practice_log_user_idx on public.practice_log (user_id, practiced_on);

-- ---------- Row Level Security ----------
alter table public.profiles enable row level security;
alter table public.modules enable row level security;
alter table public.lessons enable row level security;
alter table public.user_progress enable row level security;
alter table public.practice_log enable row level security;

-- Konten kurikulum bisa dibaca siapa saja (termasuk anon)
create policy "modules readable by all" on public.modules for select using (true);
create policy "lessons readable by all" on public.lessons for select using (true);

-- Profil, progress, dan log latihan hanya milik user sendiri
create policy "own profile select" on public.profiles for select using (auth.uid() = id);
create policy "own profile insert" on public.profiles for insert with check (auth.uid() = id);
create policy "own profile update" on public.profiles for update using (auth.uid() = id);

create policy "own progress select" on public.user_progress for select using (auth.uid() = user_id);
create policy "own progress insert" on public.user_progress for insert with check (auth.uid() = user_id);
create policy "own progress update" on public.user_progress for update using (auth.uid() = user_id);

create policy "own practice select" on public.practice_log for select using (auth.uid() = user_id);
create policy "own practice insert" on public.practice_log for insert with check (auth.uid() = user_id);
create policy "own practice update" on public.practice_log for update using (auth.uid() = user_id);

-- Buat profil otomatis saat user baru mendaftar
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', new.email));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
