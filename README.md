# Notes of Nopia

Aplikasi web belajar piano mandiri. Kurikulumnya 12 level dalam 45 minggu, dengan target mingguan dan latihan harian 15 sampai 30 menit. Partitur dirender VexFlow, suaranya sampel piano asli lewat Tone.js, dan keyboard virtualnya bisa dimainkan dengan mouse, sentuhan, atau keyboard laptop.

**Stack:** Next.js 16 (App Router, Cache Components) · Tailwind CSS v4 · shadcn/ui · Supabase · VexFlow 5 · Tone.js · Vercel

## Menjalankan secara lokal

```bash
npm install
npm run dev
```

Buka http://localhost:3000. Tanpa konfigurasi, app berjalan dalam mode lokal: konten diambil dari `src/lib/curriculum/seed.ts`, sedangkan progress, latihan harian, dan tanggal mulai disimpan di `localStorage`.

## Kurikulum dan timeline

| Tier | Level | Minggu | Menit/hari |
|---|---|---|---|
| Beginner | 1 Mengenal tuts dan posisi C, 2 Lima jari dua tangan | 2 + 2 | 15 |
| Novice | 3 Paranada dan Treble Clef, 4 Bass Clef dan durasi not, 5 Ritme | 3 + 3 + 3 | 20 |
| Intermediate | 6 Scale mayor, 7 Chord dasar dan dua tangan, 8 Scale minor dan key signature | 4 + 4 + 4 | 25 sampai 30 |
| Advanced | 9 Arpeggio, 10 Dinamika dan tempo | 4 + 4 | 30 |
| Pro | 11 Sight-reading harian, 12 Repertoar klasik dan jazz | 6 + 6 | 30 |

Setiap level punya:

- **Target mingguan**: satu kalimat per minggu (`weekly_targets`, panjangnya sama dengan `duration_weeks`).
- **Latihan harian (drill)**: satu notasi dengan tempo awal dan tempo tujuan. Tempo naik di setiap sesi yang tercatat, dengan asumsi 5 sesi per minggu (`drillBpm` di `schedule.ts`).
- **Pelajaran**: 3 sampai 6 per level, masing-masing terikat ke satu minggu. Pelajaran terakhir selalu kuis.

Level berikutnya terbuka setelah semua pelajaran di level sebelumnya selesai. Beranda membandingkan posisi aktual dengan minggu kalender sejak tanggal mulai, lalu menyebut apakah kamu sesuai rencana, tertinggal, atau lebih cepat.

## Menghubungkan Supabase

1. Buat project di [supabase.com](https://supabase.com).
2. Jalankan `supabase/migrations/0001_init.sql`, lalu `supabase/seed.sql`, di SQL Editor.
3. Salin `.env.example` ke `.env.local`, lalu isi `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
4. Di Authentication, URL Configuration, tambahkan `http://localhost:3000/auth/callback` dan `https://<app>.vercel.app/auth/callback` ke Redirect URLs.
5. (Opsional) Aktifkan provider Google di Authentication, Providers.

Setelah mengubah `seed.ts`, buat ulang SQL-nya dengan `npm run db:seed-sql`.

## Struktur

```
src/
  app/
    (site)/page.tsx            Halaman depan
    (site)/login/              Magic link dan Google OAuth
    (app)/dashboard/           Beranda: minggu ke berapa, latihan hari ini, target minggu ini, timeline 45 minggu
    (app)/latihan/             Latihan harian dan pencatatannya
    (app)/peta/                Peta 12 level dengan target mingguan
    (app)/lessons/[id]/        Pelajaran: teks, partitur interaktif, atau kuis
    auth/callback/route.ts     Menukar code menjadi sesi
  proxy.ts                     Me-refresh sesi Supabase (Next 16: pengganti middleware)
  components/
    music/                     SheetMusic, VirtualKeyboard, NotationPlayer
    app/                       Shell, panel, timeline, strip pekan, layar-layar app
    site/                      Bagian-bagian halaman depan
  lib/
    music/notation.ts          Parser notasi, nama nada (huruf, solmisasi, not angka)
    audio/piano.ts             Tone.js lazy-load, Sampler, playSequence()
    curriculum/seed.ts         Kurikulum lengkap
    curriculum/schedule.ts     Hitungan timeline, unlock, tempo drill, streak
    curriculum/repository.ts   Supabase atau localStorage
supabase/
  migrations/0001_init.sql     profiles, modules, lessons, user_progress, practice_log + RLS
  seed.sql                     Hasil generate dari seed.ts
public/media/                  Foto dan video dari koleksi terbuka; lisensinya di credits.json
```

## Format notasi

`C4/q, D4/q, E4/h, R/q, F#4/8, Bb3/w, E4/qd, (C4 E4 G4)/h`

- Durasi: `w` (whole), `h` (half), `q` (quarter), `8`, `16`. Tambahkan `d` untuk not bertitik.
- `R` adalah rest.
- Chord ditulis dalam kurung, nadanya dipisah spasi.
- Setiap pelajaran menyimpan `clef` (`treble` atau `bass`) dan `time_signature` (mis. `3/4`).

## Desain

Arah visual diambil dengan skill tasteskill: halaman depan memakai arah "One motif" (seed 684319902), dan layar app memakai gaya "Editorial greeting" dengan palet dan huruf yang sama. Motifnya bentuk tuts piano: sudut atas tajam, sudut bawah membulat. Bentuk ini dipakai untuk tombol, masker foto, bullet, pita hero, timeline, dan wordmark di footer. Paletnya oxblood di atas abu-abu, mengikuti kain felt merah di atas tuts. Hurufnya Sarabun untuk semua teks.

Semua gambar dan video berasal dari Wikimedia Commons dan diberi kredit di footer. Klip square piano dipotong ke detik 20 sampai 60 dan dibisukan.

## Catatan implementasi

- **Kebijakan autoplay:** audio baru dimulai (`Tone.start()`) saat user mengklik Play, not, atau tuts.
- **Lazy loading:** Tone.js, VexFlow, dan sampel piano dimuat hanya saat dibutuhkan.
- **Hemat serverless:** konten dan progress dibaca langsung dari Supabase di client. Server hanya dipakai untuk `proxy.ts` dan `auth/callback`.

## Deploy ke Vercel

Import repo GitHub di Vercel, isi dua env var Supabase, lalu deploy. Setiap push ke `main` otomatis ter-deploy.

## Rencana berikutnya

- Grand staff (treble dan bass sekaligus) untuk pelajaran dua tangan
- Pickup measure (Für Elise aslinya 3/8 dengan anakan)
- Mode latihan yang mengecek not yang dimainkan user terhadap partitur (Web MIDI)
