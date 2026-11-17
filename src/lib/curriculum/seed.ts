import type { Clef, ContentType, Drill, Lesson, ModuleWithLessons, QuizQuestion } from "./types";

/**
 * Kurikulum lengkap: 12 level dalam 5 tier, total 45 minggu.
 * Dipakai sebagai fallback lokal saat Supabase belum dikonfigurasi; isi yang
 * sama ditulis ke supabase/seed.sql lewat `npm run db:seed-sql`.
 * ID dibuat deterministik agar progress lokal dan database konsisten.
 */

type RawLesson = {
  week: number;
  title: string;
  type: ContentType;
  body?: string;
  notation?: string;
  clef?: Clef;
  time?: string;
  quiz?: QuizQuestion[];
};

type RawModule = {
  level: number;
  tier: number;
  title: string;
  description: string;
  daily_minutes: number;
  weekly_targets: string[];
  drill: Drill;
  lessons: RawLesson[];
};

const q = (question: string, choices: string[], answer_index: number): QuizQuestion => ({
  question,
  choices,
  answer_index,
});

const RAW: RawModule[] = [
  // ---------------------------------------------------------------- Beginner
  {
    level: 1,
    tier: 1,
    title: "Mengenal tuts dan posisi C",
    description: "Pola tuts hitam, letak Do tengah (C4), dan lima jari tangan kanan.",
    daily_minutes: 15,
    weekly_targets: [
      "Temukan semua C di keyboard tanpa melihat label, lalu mainkan C sampai G dengan jari 1 sampai 5.",
      "Mainkan Do-Re-Mi-Fa-Sol naik dan turun tanpa berhenti di 80 BPM.",
    ],
    drill: {
      title: "Lima jari kanan, C sampai G",
      notation: "C4/q, D4/q, E4/q, F4/q, G4/q, F4/q, E4/q, D4/q, C4/w",
      clef: "treble",
      bpm_start: 60,
      bpm_goal: 80,
    },
    lessons: [
      {
        week: 1,
        title: "Tuts putih dan tuts hitam",
        type: "text",
        body: "Tuts hitam selalu berkelompok dua dan tiga. Nada C (Do) ada tepat di kiri kelompok dua tuts hitam. Coba tekan semua C di keyboard di bawah, lalu cari C4, yaitu C yang paling dekat dengan tengah piano.",
      },
      {
        week: 1,
        title: "Do-Re-Mi-Fa-Sol",
        type: "interactive_sheet",
        body: "Taruh ibu jari kanan (jari 1) di C4. Setiap jari mendapat satu tuts sampai kelingking di G4.",
        notation: "C4/q, D4/q, E4/q, F4/q, G4/w",
      },
      {
        week: 2,
        title: "Mary Had a Little Lamb",
        type: "interactive_sheet",
        body: "Lagu pertama yang hanya memakai tiga jari. Dengarkan dulu dengan Play, lalu ikuti di keyboard.",
        notation: "E4/q, D4/q, C4/q, D4/q, E4/q, E4/q, E4/h, D4/q, D4/q, D4/h, E4/q, G4/q, G4/h",
      },
      {
        week: 2,
        title: "Kuis: posisi tuts",
        type: "quiz",
        quiz: [
          q("Nada C berada tepat di kiri…", ["Kelompok dua tuts hitam", "Kelompok tiga tuts hitam", "Tuts hitam mana saja"], 0),
          q("Jari nomor 1 di tangan kanan adalah…", ["Kelingking", "Ibu jari", "Jari tengah"], 1),
          q("Dalam not angka, Do ditulis sebagai…", ["0", "1", "8"], 1),
        ],
      },
    ],
  },
  {
    level: 2,
    tier: 1,
    title: "Lima jari dua tangan",
    description: "Penomoran jari, postur duduk, dan tangan kiri di C3.",
    daily_minutes: 15,
    weekly_targets: [
      "Mainkan C3 sampai G3 dengan tangan kiri, kelingking (jari 5) di C3.",
      "Mainkan Twinkle Twinkle dengan tangan kanan, lalu bagian yang sama satu oktaf lebih rendah dengan tangan kiri.",
    ],
    drill: {
      title: "Lima jari kiri, C sampai G",
      notation: "C3/q, D3/q, E3/q, F3/q, G3/q, F3/q, E3/q, D3/q, C3/w",
      clef: "bass",
      bpm_start: 60,
      bpm_goal: 80,
    },
    lessons: [
      {
        week: 1,
        title: "Penomoran jari dan postur",
        type: "text",
        body: "Kedua tangan memakai nomor yang sama: ibu jari 1, kelingking 5. Duduk dengan siku sejajar tuts, jari melengkung seperti memegang bola kecil. Coba tekan C3 dengan jari 5 kiri dan C4 dengan jari 1 kanan.",
      },
      {
        week: 1,
        title: "Tangan kiri: C sampai G",
        type: "interactive_sheet",
        body: "Notasi ini memakai Bass Clef. Kelingking kiri mulai di C3.",
        notation: "C3/q, D3/q, E3/q, F3/q, G3/w",
        clef: "bass",
      },
      {
        week: 2,
        title: "Twinkle Twinkle Little Star",
        type: "interactive_sheet",
        body: "Klik not untuk mendengar satu per satu, atau tekan Play untuk mendengar lagunya utuh.",
        notation: "C4/q, C4/q, G4/q, G4/q, A4/q, A4/q, G4/h, F4/q, F4/q, E4/q, E4/q, D4/q, D4/q, C4/h",
      },
      {
        week: 2,
        title: "Kuis: dua tangan",
        type: "quiz",
        quiz: [
          q("Di posisi C tangan kiri, jari apa yang menekan C3?", ["Jari 1", "Jari 3", "Jari 5"], 2),
          q("Posisi jari yang benar saat bermain…", ["Lurus dan kaku", "Melengkung", "Ditekuk ke belakang"], 1),
        ],
      },
    ],
  },
  // ------------------------------------------------------------------ Novice
  {
    level: 3,
    tier: 2,
    title: "Paranada dan Treble Clef",
    description: "Lima garis paranada, not di garis dan di spasi pada Treble Clef.",
    daily_minutes: 20,
    weekly_targets: [
      "Hafalkan not di garis Treble Clef dari bawah: E G B D F.",
      "Hafalkan not di spasi Treble Clef: F A C E.",
      "Baca dan mainkan delapan birama baru tanpa menulis nama not di atasnya.",
    ],
    drill: {
      title: "Lompatan terts, C sampai C",
      notation: "C4/q, E4/q, G4/q, E4/q, D4/q, F4/q, A4/q, F4/q, E4/q, G4/q, B4/q, G4/q, C5/w",
      clef: "treble",
      bpm_start: 60,
      bpm_goal: 90,
    },
    lessons: [
      {
        week: 1,
        title: "Lima garis paranada",
        type: "text",
        body: "Not balok ditulis di lima garis yang disebut paranada (staff). Makin tinggi letaknya, makin tinggi nadanya. Treble Clef (kunci G) melingkari garis kedua dari bawah: itulah G4.",
      },
      {
        week: 1,
        title: "Not di garis: E G B D F",
        type: "interactive_sheet",
        body: "Kelima not ini semuanya duduk di garis. Mainkan sambil menyebut namanya keras-keras.",
        notation: "E4/q, G4/q, B4/q, D5/q, F5/w",
      },
      {
        week: 2,
        title: "Not di spasi: F A C E",
        type: "interactive_sheet",
        body: "Empat spasi di antara garis membentuk kata FACE. Mudah diingat, kan?",
        notation: "F4/q, A4/q, C5/q, E5/q, C5/q, A4/q, F4/h",
      },
      {
        week: 3,
        title: "Ode to Joy (sederhana)",
        type: "interactive_sheet",
        body: "Melodi Beethoven ini hanya memakai lima nada, C sampai G. Baca not-nya langsung dari paranada.",
        notation: "E4/q, E4/q, F4/q, G4/q, G4/q, F4/q, E4/q, D4/q, C4/q, C4/q, D4/q, E4/q, E4/q, D4/q, D4/h",
      },
      {
        week: 3,
        title: "Kuis: Treble Clef",
        type: "quiz",
        quiz: [
          q("Not di garis Treble Clef, dari bawah ke atas…", ["E G B D F", "F A C E", "G B D F A"], 0),
          q("Treble Clef juga disebut…", ["Kunci F", "Kunci G", "Kunci C"], 1),
          q("Spasi paling bawah Treble Clef adalah…", ["E", "F", "A"], 1),
        ],
      },
    ],
  },
  {
    level: 4,
    tier: 2,
    title: "Bass Clef dan durasi not",
    description: "Membaca Bass Clef, lalu whole note, half note, dan quarter note.",
    daily_minutes: 20,
    weekly_targets: [
      "Hafalkan not di garis Bass Clef dari bawah: G B D F A.",
      "Hitung keras-keras whole note (4), half note (2), dan quarter note (1) sambil bermain.",
      "Mainkan satu lagu tangan kiri di Bass Clef tanpa salah ketukan.",
    ],
    drill: {
      title: "Garis Bass Clef naik-turun",
      notation: "G2/q, B2/q, D3/q, F3/q, A3/q, F3/q, D3/q, B2/q, G2/w",
      clef: "bass",
      bpm_start: 60,
      bpm_goal: 90,
    },
    lessons: [
      {
        week: 1,
        title: "Bass Clef",
        type: "text",
        body: "Bass Clef (kunci F) dipakai untuk nada rendah, biasanya tangan kiri. Dua titiknya mengapit garis keempat dari bawah: itulah F3.",
      },
      {
        week: 1,
        title: "Not di garis Bass Clef",
        type: "interactive_sheet",
        body: "Dari bawah: G B D F A. Mainkan dengan tangan kiri.",
        notation: "G2/q, B2/q, D3/q, F3/q, A3/w",
        clef: "bass",
      },
      {
        week: 2,
        title: "Whole, half, dan quarter note",
        type: "interactive_sheet",
        body: "Whole note ditahan 4 ketukan, half note 2 ketukan, quarter note 1 ketukan. Dengarkan perbedaannya.",
        notation: "C4/w, E4/h, G4/h, C5/q, G4/q, E4/q, C4/q",
      },
      {
        week: 3,
        title: "When the Saints (tangan kiri)",
        type: "interactive_sheet",
        body: "Melodi terkenal ini dimainkan di Bass Clef. Setiap frase mulai setelah satu ketukan rest, lalu berhenti di whole note yang ditahan panjang.",
        notation: "R/q, C3/q, E3/q, F3/q, G3/w, R/q, C3/q, E3/q, F3/q, G3/w, R/q, C3/q, E3/q, F3/q, G3/h, E3/h, C3/h, E3/h, D3/w",
        clef: "bass",
      },
      {
        week: 3,
        title: "Kuis: durasi not",
        type: "quiz",
        quiz: [
          q("Berapa ketukan half note?", ["1", "2", "4"], 1),
          q("Not di garis Bass Clef, dari bawah ke atas…", ["E G B D F", "G B D F A", "A C E G"], 1),
          q("Dua whole note dalam birama 4/4 mengisi…", ["Satu birama", "Dua birama", "Setengah birama"], 1),
        ],
      },
    ],
  },
  {
    level: 5,
    tier: 2,
    title: "Ritme: rest, dotted, eighth note",
    description: "Menghitung diam, not bertitik, dan eighth note dengan hitungan 1-dan-2.",
    daily_minutes: 20,
    weekly_targets: [
      "Hitung setiap rest dengan suara; jangan dilewati.",
      "Mainkan pola dotted quarter + eighth dengan hitungan 1-dan-2.",
      "Mainkan Ode to Joy dengan ritme dotted di 90 BPM.",
    ],
    drill: {
      title: "Eighth note dan rest",
      notation: "C4/8, D4/8, E4/8, F4/8, G4/q, R/q, G4/8, F4/8, E4/8, D4/8, C4/h",
      clef: "treble",
      bpm_start: 60,
      bpm_goal: 96,
    },
    lessons: [
      {
        week: 1,
        title: "Rest: diam juga dihitung",
        type: "interactive_sheet",
        body: "Rest adalah tanda istirahat. Tangan diangkat, tapi hitungan tetap jalan.",
        notation: "C4/q, R/q, E4/q, R/q, G4/h, R/h",
      },
      {
        week: 2,
        title: "Eighth note",
        type: "interactive_sheet",
        body: "Dua eighth note sama panjang dengan satu quarter note. Hitung: 1-dan-2-dan.",
        notation: "C4/8, C4/8, D4/8, D4/8, E4/8, E4/8, F4/8, F4/8, G4/q, G4/q, G4/h",
      },
      {
        week: 2,
        title: "Ode to Joy dengan dotted",
        type: "interactive_sheet",
        body: "Di birama ketiga ada dotted quarter (1,5 ketukan) yang disusul eighth note.",
        notation: "E4/q, E4/q, F4/q, G4/q, G4/q, F4/q, E4/q, D4/q, C4/q, C4/q, D4/q, E4/q, E4/qd, D4/8, D4/h",
      },
      {
        week: 3,
        title: "Kuis: ritme",
        type: "quiz",
        quiz: [
          q("Berapa eighth note yang sama panjang dengan satu half note?", ["2", "4", "8"], 1),
          q("Titik di belakang not menambah panjangnya sebanyak…", ["Seperempat", "Setengah", "Dua kali lipat"], 1),
          q("Saat bertemu rest, kamu…", ["Melewatinya", "Diam sambil tetap menghitung", "Menahan not sebelumnya"], 1),
        ],
      },
    ],
  },
  // ------------------------------------------------------------ Intermediate
  {
    level: 6,
    tier: 3,
    title: "Scale mayor: C, G, F",
    description: "Pola whole-whole-half, penjarian ibu jari menyeberang, tiga scale pertama.",
    daily_minutes: 25,
    weekly_targets: [
      "Mainkan scale C mayor satu oktaf dengan penjarian 1-2-3-1-2-3-4-5.",
      "Tambahkan scale G mayor; ingat F# di nada ketujuh.",
      "Tambahkan scale F mayor dengan penjarian 1-2-3-4-1-2-3-4; ingat Bb.",
      "Mainkan ketiga scale berturut-turut di 96 BPM tanpa berhenti.",
    ],
    drill: {
      title: "Scale C mayor, eighth note",
      notation: "C4/8, D4/8, E4/8, F4/8, G4/8, A4/8, B4/8, C5/8, B4/8, A4/8, G4/8, F4/8, E4/8, D4/8, C4/q",
      clef: "treble",
      bpm_start: 60,
      bpm_goal: 96,
    },
    lessons: [
      {
        week: 1,
        title: "Pola whole-whole-half",
        type: "text",
        body: "Semua scale mayor memakai pola jarak yang sama: whole, whole, half, whole, whole, whole, half. Half step adalah dua tuts yang bersebelahan langsung, misalnya E ke F.",
      },
      {
        week: 1,
        title: "Scale C mayor",
        type: "interactive_sheet",
        body: "Setelah jari 3 di E, ibu jari menyeberang di bawah ke F.",
        notation: "C4/q, D4/q, E4/q, F4/q, G4/q, A4/q, B4/q, C5/q, B4/q, A4/q, G4/q, F4/q, E4/q, D4/q, C4/h",
      },
      {
        week: 2,
        title: "Scale G mayor",
        type: "interactive_sheet",
        body: "Sama dengan C mayor, tapi nada ketujuh naik menjadi F#.",
        notation: "G4/q, A4/q, B4/q, C5/q, D5/q, E5/q, F#5/q, G5/q, F#5/q, E5/q, D5/q, C5/q, B4/q, A4/q, G4/h",
      },
      {
        week: 3,
        title: "Scale F mayor",
        type: "interactive_sheet",
        body: "Nada keempat turun menjadi Bb. Ibu jari menyeberang setelah jari 4.",
        notation: "F4/q, G4/q, A4/q, Bb4/q, C5/q, D5/q, E5/q, F5/q, E5/q, D5/q, C5/q, Bb4/q, A4/q, G4/q, F4/h",
      },
      {
        week: 4,
        title: "Kuis: scale mayor",
        type: "quiz",
        quiz: [
          q("Pola jarak scale mayor adalah…", ["W-W-H-W-W-W-H", "W-H-W-W-H-W-W", "H-W-W-W-H-W-W"], 0),
          q("Nada kres di scale G mayor adalah…", ["C#", "F#", "G#"], 1),
          q("Nada mol di scale F mayor adalah…", ["Bb", "Eb", "Ab"], 0),
        ],
      },
    ],
  },
  {
    level: 7,
    tier: 3,
    title: "Chord dasar dan dua tangan",
    description: "Triad mayor, progresi I-IV-V-I, dan melodi dengan iringan chord.",
    daily_minutes: 25,
    weekly_targets: [
      "Bentuk triad C, F, dan G dengan jari 1-3-5 tanpa melihat tangan.",
      "Pindah C-F-G-C tanpa jeda di antara chord.",
      "Mainkan whole note chord di tangan kiri sambil tangan kanan memainkan melodi lima nada.",
      "Iringi Twinkle Twinkle dengan chord I-IV-V.",
    ],
    drill: {
      title: "Progresi I-IV-V-I",
      notation: "(C4 E4 G4)/h, (F4 A4 C5)/h, (G4 B4 D5)/h, (C4 E4 G4)/h",
      clef: "treble",
      bpm_start: 60,
      bpm_goal: 90,
    },
    lessons: [
      {
        week: 1,
        title: "Apa itu triad",
        type: "text",
        body: "Triad adalah tiga nada yang dibunyikan bersama: nada dasar, terts, dan kwint. Triad C mayor berisi C, E, dan G. Coba tekan ketiganya di keyboard di bawah.",
      },
      {
        week: 1,
        title: "Triad C, F, G",
        type: "interactive_sheet",
        body: "Tiga chord ini cukup untuk mengiringi ratusan lagu.",
        notation: "(C4 E4 G4)/w, (F4 A4 C5)/w, (G4 B4 D5)/w",
      },
      {
        week: 2,
        title: "Progresi I-IV-V-I",
        type: "interactive_sheet",
        body: "Dalam C mayor, I adalah C, IV adalah F, V adalah G. Pindah chord tepat di ketukan pertama.",
        notation: "(C4 E4 G4)/q, (C4 E4 G4)/q, (F4 A4 C5)/q, (F4 A4 C5)/q, (G4 B4 D5)/q, (G4 B4 D5)/q, (C4 E4 G4)/h",
      },
      {
        week: 3,
        title: "Chord tangan kiri",
        type: "interactive_sheet",
        body: "Turunkan chord yang sama satu oktaf untuk tangan kiri. Posisi F dan G dibalik agar tangan tidak melompat jauh.",
        notation: "(C3 E3 G3)/w, (C3 F3 A3)/w, (B2 D3 G3)/w, (C3 E3 G3)/w",
        clef: "bass",
      },
      {
        week: 4,
        title: "Kuis: chord",
        type: "quiz",
        quiz: [
          q("Triad C mayor berisi…", ["C E G", "C F A", "C D E"], 0),
          q("Dalam C mayor, chord V adalah…", ["F", "G", "A"], 1),
          q("Penjarian triad tangan kanan posisi dasar…", ["1-2-3", "1-3-5", "2-3-4"], 1),
        ],
      },
    ],
  },
  {
    level: 8,
    tier: 3,
    title: "Scale minor dan key signature",
    description: "A minor natural dan harmonic, lalu membaca key signature.",
    daily_minutes: 30,
    weekly_targets: [
      "Mainkan A minor natural lalu C mayor, dan dengarkan beda nuansanya.",
      "Mainkan A minor harmonic dengan G# di nada ketujuh.",
      "Kenali key signature satu kres (G mayor / E minor) dan satu mol (F mayor / D minor).",
      "Mainkan E minor dan D minor harmonic dari ingatan.",
    ],
    drill: {
      title: "A minor natural, eighth note",
      notation: "A3/8, B3/8, C4/8, D4/8, E4/8, F4/8, G4/8, A4/8, G4/8, F4/8, E4/8, D4/8, C4/8, B3/8, A3/q",
      clef: "treble",
      bpm_start: 60,
      bpm_goal: 100,
    },
    lessons: [
      {
        week: 1,
        title: "A minor natural",
        type: "interactive_sheet",
        body: "Tuts putih semua, tapi mulai dari A. Inilah relatif minor dari C mayor.",
        notation: "A3/q, B3/q, C4/q, D4/q, E4/q, F4/q, G4/q, A4/q, G4/q, F4/q, E4/q, D4/q, C4/q, B3/q, A3/h",
      },
      {
        week: 2,
        title: "A minor harmonic",
        type: "interactive_sheet",
        body: "Naikkan nada ketujuh menjadi G#. Lompatan F ke G# membuat scale ini terdengar khas.",
        notation: "A3/q, B3/q, C4/q, D4/q, E4/q, F4/q, G#4/q, A4/q, G#4/q, F4/q, E4/q, D4/q, C4/q, B3/q, A3/h",
      },
      {
        week: 3,
        title: "Membaca key signature",
        type: "text",
        body: "Key signature adalah kres atau mol di awal paranada. Satu kres (F#) berarti G mayor atau E minor. Satu mol (Bb) berarti F mayor atau D minor. Untuk membedakannya, lihat nada terakhir: lagu dalam G mayor biasanya berakhir di G, lagu dalam E minor di E.",
      },
      {
        week: 4,
        title: "E minor harmonic",
        type: "interactive_sheet",
        body: "Satu kres dari key signature (F#), ditambah D# sebagai nada ketujuh.",
        notation: "E4/q, F#4/q, G4/q, A4/q, B4/q, C5/q, D#5/q, E5/q, D#5/q, C5/q, B4/q, A4/q, G4/q, F#4/q, E4/h",
      },
      {
        week: 4,
        title: "Kuis: minor",
        type: "quiz",
        quiz: [
          q("Relatif minor dari C mayor adalah…", ["E minor", "A minor", "D minor"], 1),
          q("Scale minor harmonic menaikkan nada ke…", ["Tiga", "Lima", "Tujuh"], 2),
          q("Key signature satu mol (Bb) berarti…", ["G mayor / E minor", "F mayor / D minor", "D mayor / B minor"], 1),
        ],
      },
    ],
  },
  // ---------------------------------------------------------------- Advanced
  {
    level: 9,
    tier: 4,
    title: "Arpeggio",
    description: "Arpeggio mayor dan minor dua oktaf dengan ibu jari menyeberang.",
    daily_minutes: 30,
    weekly_targets: [
      "Arpeggio C mayor dua oktaf; ibu jari menyeberang tanpa hentakan.",
      "Tambahkan arpeggio F dan G mayor.",
      "Tambahkan arpeggio A minor dan E minor.",
      "Mainkan kelima arpeggio di 108 BPM dalam eighth note.",
    ],
    drill: {
      title: "Arpeggio C dan F",
      notation: "C4/8, E4/8, G4/8, C5/8, G4/8, E4/8, C4/q, F4/8, A4/8, C5/8, F5/8, C5/8, A4/8, F4/q",
      clef: "treble",
      bpm_start: 60,
      bpm_goal: 108,
    },
    lessons: [
      {
        week: 1,
        title: "Arpeggio C mayor",
        type: "interactive_sheet",
        body: "Nada-nada triad dimainkan satu per satu naik dua oktaf. Ibu jari menyeberang setelah jari 3.",
        notation: "C4/8, E4/8, G4/8, C5/8, E5/8, G5/8, C6/q, G5/8, E5/8, C5/8, G4/8, E4/8, C4/8, R/q",
      },
      {
        week: 2,
        title: "Arpeggio F dan G",
        type: "interactive_sheet",
        body: "Bentuk tangan sama dengan C, hanya titik awalnya yang bergeser.",
        notation: "F4/8, A4/8, C5/8, F5/8, C5/8, A4/8, F4/q, G4/8, B4/8, D5/8, G5/8, D5/8, B4/8, G4/q",
      },
      {
        week: 3,
        title: "Arpeggio minor",
        type: "interactive_sheet",
        body: "A minor dan E minor: terts-nya turun setengah dibanding mayor.",
        notation: "A3/8, C4/8, E4/8, A4/8, E4/8, C4/8, A3/q, E4/8, G4/8, B4/8, E5/8, B4/8, G4/8, E4/q",
      },
      {
        week: 4,
        title: "Kuis: arpeggio",
        type: "quiz",
        quiz: [
          q("Arpeggio adalah…", ["Chord yang dimainkan satu per satu", "Scale yang dimainkan cepat", "Dua tangan bergantian"], 0),
          q("Arpeggio A minor berisi nada…", ["A C# E", "A C E", "A D F"], 1),
        ],
      },
    ],
  },
  {
    level: 10,
    tier: 4,
    title: "Dinamika dan tempo",
    description: "Piano sampai forte, crescendo, ritardando, dan lagu klasik pertama.",
    daily_minutes: 30,
    weekly_targets: [
      "Mainkan satu frase piano (p), lalu forte (f), tanpa mengubah tempo.",
      "Latih crescendo naik dan diminuendo turun pada scale C mayor.",
      "Mainkan ritardando di empat ketukan terakhir lagu.",
      "Rekam Minuet in G dengan dinamika, lalu dengarkan ulang hasilnya.",
    ],
    drill: {
      title: "Für Elise, frase pembuka",
      notation: "E5/8, D#5/8, E5/8, D#5/8, E5/8, B4/8, D5/8, C5/8, A4/q",
      clef: "treble",
      bpm_start: 60,
      bpm_goal: 100,
    },
    lessons: [
      {
        week: 1,
        title: "Simbol dinamika: pp sampai ff",
        type: "text",
        body: "pp (pianissimo) sangat lembut, p (piano) lembut, mp dan mf di tengah, f (forte) keras, ff (fortissimo) sangat keras. Keras-lembutnya datang dari kecepatan jari menekan tuts, bukan dari menekan lebih dalam.",
      },
      {
        week: 2,
        title: "Crescendo pada scale C",
        type: "interactive_sheet",
        body: "Mulai p di C4, makin keras sampai f di C5, lalu turun kembali lembut.",
        notation: "C4/q, D4/q, E4/q, F4/q, G4/q, A4/q, B4/q, C5/q, B4/q, A4/q, G4/q, F4/q, E4/q, D4/q, C4/h",
      },
      {
        week: 3,
        title: "Für Elise (pembuka)",
        type: "interactive_sheet",
        body: "Beethoven menulis frase ini pianissimo dalam birama 3/8; di sini dirapikan ke 4/4 agar mudah dibaca. Biarkan E dan D# bergantian dengan ringan.",
        notation: "E5/8, D#5/8, E5/8, D#5/8, E5/8, B4/8, D5/8, C5/8, A4/q, R/8, C4/8, E4/8, A4/8, B4/q, R/8, E4/8, G#4/8, B4/8, C5/q, R/q",
      },
      {
        week: 4,
        title: "Minuet in G (pembuka)",
        type: "interactive_sheet",
        body: "Minuet dari buku catatan Anna Magdalena Bach, dalam birama 3/4: hitung 1-2-3. Mainkan mezzo forte.",
        notation: "D5/q, G4/8, A4/8, B4/8, C5/8, D5/q, G4/q, G4/q, E5/q, C5/8, D5/8, E5/8, F#5/8, G5/q, G4/q, G4/q",
        time: "3/4",
      },
      {
        week: 4,
        title: "Kuis: dinamika",
        type: "quiz",
        quiz: [
          q("Simbol p berarti…", ["Lembut", "Keras", "Pelan (tempo)"], 0),
          q("Crescendo berarti…", ["Makin lambat", "Makin keras", "Makin lembut"], 1),
          q("Ritardando berarti…", ["Makin cepat", "Makin lambat", "Berhenti mendadak"], 1),
        ],
      },
    ],
  },
  // --------------------------------------------------------------------- Pro
  {
    level: 11,
    tier: 5,
    title: "Sight-reading harian",
    description: "Membaca musik baru tanpa berhenti, satu birama di depan jari.",
    daily_minutes: 30,
    weekly_targets: [
      "Baca empat birama baru setiap hari dan jangan berhenti saat salah.",
      "Latih mata melihat satu birama di depan jari.",
      "Sight-reading di Bass Clef, empat birama sehari.",
      "Sight-reading dengan eighth note dan rest.",
      "Sight-reading dengan key signature satu kres.",
      "Baca enam belas birama baru di 80 BPM dengan kurang dari tiga not salah.",
    ],
    drill: {
      title: "Bacaan pendek dengan lompatan",
      notation: "G4/q, E4/8, F4/8, G4/q, C5/q, B4/q, A4/8, G4/8, F4/h, E4/q, D4/q, C4/w",
      clef: "treble",
      bpm_start: 60,
      bpm_goal: 100,
    },
    lessons: [
      {
        week: 1,
        title: "Aturan sight-reading",
        type: "text",
        body: "Sebelum bermain, lihat key signature, birama, dan nada terendah serta tertinggi. Lalu mainkan pelan dan jangan pernah berhenti. Not yang salah lebih baik daripada ketukan yang hilang.",
      },
      {
        week: 2,
        title: "Bacaan 1: melangkah",
        type: "interactive_sheet",
        body: "Baca sekali dari awal sampai akhir tanpa berhenti. Baru setelah itu tekan Play untuk mengecek.",
        notation: "E4/q, F4/q, G4/q, E4/q, D4/q, E4/q, F4/h, G4/q, A4/q, B4/q, G4/q, C5/w",
      },
      {
        week: 3,
        title: "Bacaan 2: Bass Clef",
        type: "interactive_sheet",
        body: "Sama, kali ini tangan kiri.",
        notation: "C3/q, D3/q, E3/q, C3/q, G3/h, F3/h, E3/q, D3/q, C3/q, B2/q, C3/w",
        clef: "bass",
      },
      {
        week: 4,
        title: "Bacaan 3: ritme",
        type: "interactive_sheet",
        body: "Perhatikan rest dan eighth note. Hitung pelan sebelum mulai.",
        notation: "C5/8, B4/8, A4/q, R/q, G4/q, F4/8, G4/8, A4/q, R/8, A4/8, G4/q, E4/qd, D4/8, C4/h",
      },
      {
        week: 5,
        title: "Bacaan 4: G mayor",
        type: "interactive_sheet",
        body: "Satu kres: setiap F dimainkan F#.",
        notation: "G4/q, B4/q, D5/q, B4/q, A4/q, F#4/q, G4/h, D4/q, E4/q, F#4/q, A4/q, G4/w",
      },
      {
        week: 6,
        title: "Kuis: sight-reading",
        type: "quiz",
        quiz: [
          q("Saat sight-reading dan kamu salah not, sebaiknya…", ["Berhenti dan ulangi", "Terus jalan", "Mulai dari awal"], 1),
          q("Hal yang dilihat sebelum mulai membaca…", ["Judul saja", "Key signature dan birama", "Nomor halaman"], 1),
        ],
      },
    ],
  },
  {
    level: 12,
    tier: 5,
    title: "Repertoar klasik dan jazz",
    description: "Chord seventh, ii-V-I, Prelude in C dari Bach, dan blues scale dengan rasa swing.",
    daily_minutes: 30,
    weekly_targets: [
      "Pelajari tiga chord seventh: Dm7, G7, dan Cmaj7.",
      "Mainkan progresi ii-V-I di C mayor tanpa melihat tangan.",
      "Mainkan delapan birama pertama Prelude in C (Bach) sebagai broken chord.",
      "Mainkan blues scale C dengan swing eighth.",
      "Dalam satu sesi, mainkan satu lagu klasik dan satu progresi jazz.",
      "Mainkan resital kecil: dua lagu tanpa berhenti, lalu rekam hasilnya.",
    ],
    drill: {
      title: "Progresi ii-V-I",
      notation: "(D4 F4 A4 C5)/w, (D4 F4 G4 B4)/w, (C4 E4 G4 B4)/w",
      clef: "treble",
      bpm_start: 60,
      bpm_goal: 100,
    },
    lessons: [
      {
        week: 1,
        title: "Chord seventh",
        type: "interactive_sheet",
        body: "Tambahkan satu terts di atas triad. Dm7, G7, dan Cmaj7 adalah bahan utama lagu jazz.",
        notation: "(D4 F4 A4 C5)/w, (G4 B4 D5 F5)/w, (C4 E4 G4 B4)/w",
      },
      {
        week: 2,
        title: "ii-V-I di C",
        type: "interactive_sheet",
        body: "G7 dimainkan dengan inversi agar jari hampir tidak berpindah dari Dm7.",
        notation: "(D4 F4 A4 C5)/h, (D4 F4 G4 B4)/h, (C4 E4 G4 B4)/w",
      },
      {
        week: 3,
        title: "Prelude in C, BWV 846 (pembuka)",
        type: "interactive_sheet",
        body: "Bach menulis seluruh prelude ini sebagai chord yang dipecah. Jaga semua sixteenth note tetap rata.",
        notation:
          "C4/16, E4/16, G4/16, C5/16, E5/16, G4/16, C5/16, E5/16, C4/16, E4/16, G4/16, C5/16, E5/16, G4/16, C5/16, E5/16, C4/16, D4/16, A4/16, D5/16, F5/16, A4/16, D5/16, F5/16, C4/16, D4/16, A4/16, D5/16, F5/16, A4/16, D5/16, F5/16",
      },
      {
        week: 4,
        title: "Blues scale C",
        type: "interactive_sheet",
        body: "C, Eb, F, F#, G, Bb. Mainkan eighth note dengan rasa swing: yang pertama sedikit lebih panjang.",
        notation: "C4/8, Eb4/8, F4/8, F#4/8, G4/8, Bb4/8, C5/q, Bb4/8, G4/8, F#4/8, F4/8, Eb4/8, C4/8, C4/q",
      },
      {
        week: 6,
        title: "Kuis: repertoar",
        type: "quiz",
        quiz: [
          q("Dalam C mayor, ii-V-I adalah…", ["Dm7 - G7 - Cmaj7", "C - F - G", "Am - Dm - G"], 0),
          q("Nada yang membedakan blues scale dari scale minor pentatonik…", ["F#", "B", "D"], 0),
          q("Prelude in C dari Bach dibangun dari…", ["Melodi panjang", "Chord yang dipecah", "Scale cepat"], 1),
        ],
      },
    ],
  },
];

const pad = (n: number) => String(n).padStart(12, "0");
export const moduleId = (level: number) => `00000000-0000-4000-8000-${pad(level)}`;
const lessonId = (level: number, n: number) => `00000000-0000-4000-9000-${pad(level * 100 + n)}`;

export const SEED_CURRICULUM: ModuleWithLessons[] = RAW.map(({ lessons, ...m }) => ({
  ...m,
  id: moduleId(m.level),
  duration_weeks: m.weekly_targets.length,
  lessons: lessons.map(
    (l, i): Lesson => ({
      id: lessonId(m.level, i + 1),
      module_id: moduleId(m.level),
      order_index: i + 1,
      week: l.week,
      title: l.title,
      content_type: l.type,
      body: l.body ?? null,
      notation_data: l.notation ?? null,
      clef: l.clef ?? "treble",
      time_signature: l.time ?? "4/4",
      quiz: l.quiz ?? null,
    }),
  ),
}));
