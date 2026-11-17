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
    title: "Halo, tuts piano!",
    description: "Kenalan dengan tuts hitam dan putih, cari Do di tengah piano, lalu main pakai lima jari kanan.",
    daily_minutes: 15,
    weekly_targets: [
      "Cari semua C di piano tanpa melihat tulisan, lalu mainkan C sampai G pakai jari 1 sampai 5.",
      "Mainkan Do-Re-Mi-Fa-Sol naik lalu turun lagi tanpa berhenti, di tempo 80 BPM.",
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
        body: "Lihat tuts hitamnya: ada yang berdua, ada yang bertiga. Nada C (Do) selalu ada tepat di kiri dua tuts hitam. Coba tekan semua C di piano di bawah. C yang paling dekat dengan tengah piano namanya C4.",
      },
      {
        week: 1,
        title: "Do-Re-Mi-Fa-Sol",
        type: "interactive_sheet",
        body: "Taruh ibu jari kanan (jari 1) di C4. Setiap jari dapat satu tuts, sampai kelingking di G4. Sekarang mainkan satu per satu!",
        notation: "C4/q, D4/q, E4/q, F4/q, G4/w",
      },
      {
        week: 2,
        title: "Mary Had a Little Lamb",
        type: "interactive_sheet",
        body: "Lagu pertamamu! Cukup tiga jari. Tekan Play untuk mendengarkan dulu, lalu ikuti di piano.",
        notation: "E4/q, D4/q, C4/q, D4/q, E4/q, E4/q, E4/h, D4/q, D4/q, D4/h, E4/q, G4/q, G4/h",
      },
      {
        week: 2,
        title: "Kuis: posisi tuts",
        type: "quiz",
        quiz: [
          q("Nada C ada tepat di kiri…", ["Kelompok dua tuts hitam", "Kelompok tiga tuts hitam", "Tuts hitam mana saja"], 0),
          q("Jari nomor 1 itu jari yang mana?", ["Kelingking", "Ibu jari", "Jari tengah"], 1),
          q("Di not angka, Do ditulis dengan angka…", ["0", "1", "8"], 1),
        ],
      },
    ],
  },
  {
    level: 2,
    tier: 1,
    title: "Dua tangan, sepuluh jari",
    description: "Nomor jari, cara duduk yang enak, dan tangan kiri mulai ikut bermain di C3.",
    daily_minutes: 15,
    weekly_targets: [
      "Mainkan C3 sampai G3 dengan tangan kiri. Kelingking (jari 5) mulai di C3.",
      "Mainkan Twinkle Twinkle dengan tangan kanan, lalu coba bagian yang sama dengan tangan kiri, lebih rendah.",
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
        body: "Kedua tangan punya nomor yang sama: ibu jari 1, kelingking 5. Duduk tegak, siku sejajar tuts, dan bentuk jari melengkung seperti sedang memegang bola kecil. Coba tekan C3 dengan jari 5 kiri dan C4 dengan jari 1 kanan.",
      },
      {
        week: 1,
        title: "Tangan kiri: C sampai G",
        type: "interactive_sheet",
        body: "Partitur ini memakai Bass Clef, tanda untuk nada-nada rendah. Kelingking kiri mulai di C3.",
        notation: "C3/q, D3/q, E3/q, F3/q, G3/w",
        clef: "bass",
      },
      {
        week: 2,
        title: "Twinkle Twinkle Little Star",
        type: "interactive_sheet",
        body: "Lagu bintang kecil! Klik setiap not untuk mendengarnya satu per satu, atau tekan Play untuk mendengar lagunya utuh.",
        notation: "C4/q, C4/q, G4/q, G4/q, A4/q, A4/q, G4/h, F4/q, F4/q, E4/q, E4/q, D4/q, D4/q, C4/h",
      },
      {
        week: 2,
        title: "Kuis: dua tangan",
        type: "quiz",
        quiz: [
          q("Di posisi C tangan kiri, jari apa yang menekan C3?", ["Jari 1", "Jari 3", "Jari 5"], 2),
          q("Bentuk jari yang benar saat bermain piano…", ["Lurus dan kaku", "Melengkung", "Ditekuk ke belakang"], 1),
        ],
      },
    ],
  },
  // ------------------------------------------------------------------ Novice
  {
    level: 3,
    tier: 2,
    title: "Rumah not: paranada dan Treble Clef",
    description: "Not punya rumah berupa lima garis. Kita belajar not yang duduk di garis dan di sela-selanya.",
    daily_minutes: 20,
    weekly_targets: [
      "Hafalkan not di garis Treble Clef dari bawah: E G B D F.",
      "Hafalkan not di spasi Treble Clef: F A C E, seperti kata FACE.",
      "Baca dan mainkan delapan birama baru tanpa menuliskan nama notnya dulu.",
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
        body: "Not balok tinggal di lima garis yang namanya paranada (staff). Makin tinggi letak not, makin tinggi bunyinya. Tanda keriting di depan namanya Treble Clef (kunci G). Ekornya melingkari garis kedua dari bawah, dan garis itu adalah G4.",
      },
      {
        week: 1,
        title: "Not di garis: E G B D F",
        type: "interactive_sheet",
        body: "Kelima not ini semuanya duduk di atas garis. Mainkan sambil menyebut namanya keras-keras!",
        notation: "E4/q, G4/q, B4/q, D5/q, F5/w",
      },
      {
        week: 2,
        title: "Not di spasi: F A C E",
        type: "interactive_sheet",
        body: "Not di empat sela garis membentuk kata FACE, artinya wajah. Mudah diingat, kan?",
        notation: "F4/q, A4/q, C5/q, E5/q, C5/q, A4/q, F4/h",
      },
      {
        week: 3,
        title: "Ode to Joy (sederhana)",
        type: "interactive_sheet",
        body: "Lagu ciptaan Beethoven ini cuma pakai lima nada, C sampai G. Coba baca notnya langsung dari paranada.",
        notation: "E4/q, E4/q, F4/q, G4/q, G4/q, F4/q, E4/q, D4/q, C4/q, C4/q, D4/q, E4/q, E4/q, D4/q, D4/h",
      },
      {
        week: 3,
        title: "Kuis: Treble Clef",
        type: "quiz",
        quiz: [
          q("Not di garis Treble Clef, dari bawah ke atas, adalah…", ["E G B D F", "F A C E", "G B D F A"], 0),
          q("Nama lain Treble Clef adalah…", ["Kunci F", "Kunci G", "Kunci C"], 1),
          q("Not di sela paling bawah Treble Clef adalah…", ["E", "F", "A"], 1),
        ],
      },
    ],
  },
  {
    level: 4,
    tier: 2,
    title: "Bass Clef dan panjang not",
    description: "Membaca not rendah di Bass Clef, lalu belajar berapa lama whole note, half note, dan quarter note ditahan.",
    daily_minutes: 20,
    weekly_targets: [
      "Hafalkan not di garis Bass Clef dari bawah: G B D F A.",
      "Sambil bermain, hitung keras-keras: whole note 4 ketukan, half note 2, quarter note 1.",
      "Mainkan satu lagu dengan tangan kiri di Bass Clef tanpa salah hitungan.",
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
        body: "Bass Clef (kunci F) dipakai untuk nada rendah, biasanya dimainkan tangan kiri. Lihat dua titiknya: keduanya mengapit garis keempat dari bawah, dan garis itu adalah F3.",
      },
      {
        week: 1,
        title: "Not di garis Bass Clef",
        type: "interactive_sheet",
        body: "Dari bawah: G B D F A. Mainkan dengan tangan kiri sambil menyebut namanya.",
        notation: "G2/q, B2/q, D3/q, F3/q, A3/w",
        clef: "bass",
      },
      {
        week: 2,
        title: "Whole, half, dan quarter note",
        type: "interactive_sheet",
        body: "Whole note ditahan 4 ketukan, half note 2 ketukan, quarter note 1 ketukan. Tekan Play dan dengarkan mana yang panjang, mana yang pendek.",
        notation: "C4/w, E4/h, G4/h, C5/q, G4/q, E4/q, C4/q",
      },
      {
        week: 3,
        title: "When the Saints (tangan kiri)",
        type: "interactive_sheet",
        body: "Lagu terkenal ini dimainkan tangan kiri di Bass Clef. Setiap bagian mulai setelah satu ketukan diam (rest), lalu berhenti di whole note yang ditahan lama.",
        notation: "R/q, C3/q, E3/q, F3/q, G3/w, R/q, C3/q, E3/q, F3/q, G3/w, R/q, C3/q, E3/q, F3/q, G3/h, E3/h, C3/h, E3/h, D3/w",
        clef: "bass",
      },
      {
        week: 3,
        title: "Kuis: durasi not",
        type: "quiz",
        quiz: [
          q("Half note ditahan berapa ketukan?", ["1", "2", "4"], 1),
          q("Not di garis Bass Clef, dari bawah ke atas…", ["E G B D F", "G B D F A", "A C E G"], 1),
          q("Dua whole note di birama 4/4 mengisi…", ["Satu birama", "Dua birama", "Setengah birama"], 1),
        ],
      },
    ],
  },
  {
    level: 5,
    tier: 2,
    title: "Main ritme: rest, dotted, eighth note",
    description: "Belajar diam yang tetap dihitung, not bertitik, dan eighth note yang cepat, dengan hitungan 1-dan-2-dan.",
    daily_minutes: 20,
    weekly_targets: [
      "Hitung setiap rest keras-keras. Jangan dilewati, ya.",
      "Mainkan dotted quarter lalu eighth note sambil menghitung 1-dan-2.",
      "Mainkan Ode to Joy dengan ritme dotted di tempo 90 BPM.",
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
        body: "Rest adalah tanda istirahat. Tanganmu diangkat, tapi hitungan di kepala tetap jalan.",
        notation: "C4/q, R/q, E4/q, R/q, G4/h, R/h",
      },
      {
        week: 2,
        title: "Eighth note",
        type: "interactive_sheet",
        body: "Dua eighth note sama panjang dengan satu quarter note. Jadi bunyinya lebih cepat. Hitung: 1-dan-2-dan.",
        notation: "C4/8, C4/8, D4/8, D4/8, E4/8, E4/8, F4/8, F4/8, G4/q, G4/q, G4/h",
      },
      {
        week: 2,
        title: "Ode to Joy dengan dotted",
        type: "interactive_sheet",
        body: "Lihat birama ketiga: ada not bertitik (dotted quarter) yang ditahan satu setengah ketukan, lalu disusul eighth note yang pendek.",
        notation: "E4/q, E4/q, F4/q, G4/q, G4/q, F4/q, E4/q, D4/q, C4/q, C4/q, D4/q, E4/q, E4/qd, D4/8, D4/h",
      },
      {
        week: 3,
        title: "Kuis: ritme",
        type: "quiz",
        quiz: [
          q("Berapa eighth note yang sama panjang dengan satu half note?", ["2", "4", "8"], 1),
          q("Titik di belakang not membuat not itu lebih panjang sebanyak…", ["Seperempat", "Setengah", "Dua kali lipat"], 1),
          q("Kalau bertemu rest, kamu harus…", ["Melewatinya", "Diam sambil tetap menghitung", "Menahan not sebelumnya"], 1),
        ],
      },
    ],
  },
  // ------------------------------------------------------------ Intermediate
  {
    level: 6,
    tier: 3,
    title: "Tangga nada: scale C, G, F",
    description: "Naik turun tangga nada (scale) dengan ibu jari yang menyeberang di bawah jari lain.",
    daily_minutes: 25,
    weekly_targets: [
      "Mainkan scale C mayor dengan jari 1-2-3, ibu jari menyeberang, lalu 1-2-3-4-5.",
      "Tambahkan scale G mayor. Ingat, nada ketujuhnya F# (tuts hitam).",
      "Tambahkan scale F mayor dengan jari 1-2-3-4-1-2-3-4. Ingat, ada Bb (tuts hitam).",
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
        body: "Setiap scale mayor naik dengan pola langkah yang sama: besar, besar, kecil, besar, besar, besar, kecil. Langkah besar namanya whole step, langkah kecil namanya half step. Half step artinya pindah ke tuts sebelahnya persis, misalnya E ke F.",
      },
      {
        week: 1,
        title: "Scale C mayor",
        type: "interactive_sheet",
        body: "Setelah jari 3 menekan E, ibu jari menyelinap lewat bawah ke F. Coba pelan-pelan dulu.",
        notation: "C4/q, D4/q, E4/q, F4/q, G4/q, A4/q, B4/q, C5/q, B4/q, A4/q, G4/q, F4/q, E4/q, D4/q, C4/h",
      },
      {
        week: 2,
        title: "Scale G mayor",
        type: "interactive_sheet",
        body: "Mirip C mayor, tapi nada ketujuhnya naik ke tuts hitam: F#.",
        notation: "G4/q, A4/q, B4/q, C5/q, D5/q, E5/q, F#5/q, G5/q, F#5/q, E5/q, D5/q, C5/q, B4/q, A4/q, G4/h",
      },
      {
        week: 3,
        title: "Scale F mayor",
        type: "interactive_sheet",
        body: "Nada keempatnya turun ke tuts hitam: Bb. Kali ini ibu jari menyeberang setelah jari 4.",
        notation: "F4/q, G4/q, A4/q, Bb4/q, C5/q, D5/q, E5/q, F5/q, E5/q, D5/q, C5/q, Bb4/q, A4/q, G4/q, F4/h",
      },
      {
        week: 4,
        title: "Kuis: scale mayor",
        type: "quiz",
        quiz: [
          q("Pola langkah scale mayor adalah…", ["W-W-H-W-W-W-H", "W-H-W-W-H-W-W", "H-W-W-W-H-W-W"], 0),
          q("Tuts hitam di scale G mayor adalah…", ["C#", "F#", "G#"], 1),
          q("Tuts hitam di scale F mayor adalah…", ["Bb", "Eb", "Ab"], 0),
        ],
      },
    ],
  },
  {
    level: 7,
    tier: 3,
    title: "Chord: tiga nada sekaligus",
    description: "Menekan tiga nada bersamaan (chord), berpindah antar-chord, lalu mengiringi lagu dengan dua tangan.",
    daily_minutes: 25,
    weekly_targets: [
      "Bentuk chord C, F, dan G dengan jari 1-3-5 tanpa melihat tangan.",
      "Pindah dari C ke F ke G lalu kembali ke C tanpa berhenti.",
      "Tangan kiri menahan chord, tangan kanan memainkan melodi lima nada.",
      "Iringi lagu Twinkle Twinkle dengan chord I, IV, dan V.",
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
        body: "Triad adalah chord yang terdiri dari tiga nada yang ditekan bersamaan. Caranya gampang: pilih satu tuts, lewati satu, tekan, lewati satu, tekan. Triad C mayor berisi C, E, dan G. Coba tekan ketiganya di piano di bawah.",
      },
      {
        week: 1,
        title: "Triad C, F, G",
        type: "interactive_sheet",
        body: "Dengan tiga chord ini saja, kamu sudah bisa mengiringi banyak sekali lagu.",
        notation: "(C4 E4 G4)/w, (F4 A4 C5)/w, (G4 B4 D5)/w",
      },
      {
        week: 2,
        title: "Progresi I-IV-V-I",
        type: "interactive_sheet",
        body: "Di C mayor, chord I adalah C, IV adalah F, dan V adalah G. Pindah chord tepat di ketukan pertama, ya.",
        notation: "(C4 E4 G4)/q, (C4 E4 G4)/q, (F4 A4 C5)/q, (F4 A4 C5)/q, (G4 B4 D5)/q, (G4 B4 D5)/q, (C4 E4 G4)/h",
      },
      {
        week: 3,
        title: "Chord tangan kiri",
        type: "interactive_sheet",
        body: "Sekarang tangan kiri yang main chord, lebih rendah. Susunan nada F dan G sedikit diubah supaya tangan tidak perlu melompat jauh.",
        notation: "(C3 E3 G3)/w, (C3 F3 A3)/w, (B2 D3 G3)/w, (C3 E3 G3)/w",
        clef: "bass",
      },
      {
        week: 4,
        title: "Kuis: chord",
        type: "quiz",
        quiz: [
          q("Triad C mayor berisi nada…", ["C E G", "C F A", "C D E"], 0),
          q("Di C mayor, chord V adalah…", ["F", "G", "A"], 1),
          q("Jari yang dipakai untuk menekan triad dengan tangan kanan…", ["1-2-3", "1-3-5", "2-3-4"], 1),
        ],
      },
    ],
  },
  {
    level: 8,
    tier: 3,
    title: "Nada sedih: scale minor",
    description: "Scale minor terdengar lebih sedih atau misterius. Kita juga belajar membaca key signature.",
    daily_minutes: 30,
    weekly_targets: [
      "Mainkan A minor lalu C mayor. Mana yang terdengar ceria, mana yang sedih?",
      "Mainkan A minor harmonic, dengan G# di nada ketujuh.",
      "Kenali key signature satu kres (G mayor atau E minor) dan satu mol (F mayor atau D minor).",
      "Mainkan scale E minor dan D minor harmonic tanpa melihat partitur.",
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
        body: "Semua tuts putih, tapi mulainya dari A. Dengarkan, rasanya lebih sedih dibanding C mayor. Scale ini disebut relatif minor dari C mayor.",
        notation: "A3/q, B3/q, C4/q, D4/q, E4/q, F4/q, G4/q, A4/q, G4/q, F4/q, E4/q, D4/q, C4/q, B3/q, A3/h",
      },
      {
        week: 2,
        title: "A minor harmonic",
        type: "interactive_sheet",
        body: "Nada ketujuhnya naik ke tuts hitam: G#. Lompatan dari F ke G# membuat scale ini terdengar seperti musik petualangan.",
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
        body: "Ada satu kres dari key signature (F#), ditambah D# di nada ketujuh.",
        notation: "E4/q, F#4/q, G4/q, A4/q, B4/q, C5/q, D#5/q, E5/q, D#5/q, C5/q, B4/q, A4/q, G4/q, F#4/q, E4/h",
      },
      {
        week: 4,
        title: "Kuis: minor",
        type: "quiz",
        quiz: [
          q("Relatif minor dari C mayor adalah…", ["E minor", "A minor", "D minor"], 1),
          q("Di scale minor harmonic, nada keberapa yang dinaikkan?", ["Tiga", "Lima", "Tujuh"], 2),
          q("Key signature dengan satu mol (Bb) berarti lagunya di…", ["G mayor atau E minor", "F mayor atau D minor", "D mayor atau B minor"], 1),
        ],
      },
    ],
  },
  // ---------------------------------------------------------------- Advanced
  {
    level: 9,
    tier: 4,
    title: "Arpeggio: chord yang berjalan",
    description: "Nada-nada chord dimainkan satu per satu naik turun, seperti menaiki tangga sambil melompat.",
    daily_minutes: 30,
    weekly_targets: [
      "Mainkan arpeggio C mayor dua oktaf. Saat ibu jari menyeberang, bunyinya tetap halus.",
      "Tambahkan arpeggio F dan G mayor.",
      "Tambahkan arpeggio A minor dan E minor.",
      "Mainkan kelima arpeggio di 108 BPM dengan eighth note.",
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
        body: "Nada C, E, dan G dimainkan satu per satu, naik sampai dua oktaf lalu turun lagi. Ibu jari menyeberang setelah jari 3.",
        notation: "C4/8, E4/8, G4/8, C5/8, E5/8, G5/8, C6/q, G5/8, E5/8, C5/8, G4/8, E4/8, C4/8, R/q",
      },
      {
        week: 2,
        title: "Arpeggio F dan G",
        type: "interactive_sheet",
        body: "Bentuk tangannya sama seperti arpeggio C, hanya tempat mulainya yang pindah.",
        notation: "F4/8, A4/8, C5/8, F5/8, C5/8, A4/8, F4/q, G4/8, B4/8, D5/8, G5/8, D5/8, B4/8, G4/q",
      },
      {
        week: 3,
        title: "Arpeggio minor",
        type: "interactive_sheet",
        body: "A minor dan E minor. Nada tengahnya lebih rendah setengah langkah dibanding versi mayor, makanya terdengar lebih sedih.",
        notation: "A3/8, C4/8, E4/8, A4/8, E4/8, C4/8, A3/q, E4/8, G4/8, B4/8, E5/8, B4/8, G4/8, E4/q",
      },
      {
        week: 4,
        title: "Kuis: arpeggio",
        type: "quiz",
        quiz: [
          q("Arpeggio itu apa?", ["Chord yang dimainkan satu per satu", "Scale yang dimainkan cepat", "Dua tangan bergantian"], 0),
          q("Arpeggio A minor berisi nada…", ["A C# E", "A C E", "A D F"], 1),
        ],
      },
    ],
  },
  {
    level: 10,
    tier: 4,
    title: "Keras, lembut, cepat, lambat",
    description: "Membuat musik bercerita: kadang lembut (piano), kadang keras (forte), kadang melambat. Lalu main lagu klasik pertamamu.",
    daily_minutes: 30,
    weekly_targets: [
      "Mainkan satu bagian lagu dengan lembut (p), lalu dengan keras (f), tanpa mengubah tempo.",
      "Mainkan scale C mayor makin keras saat naik (crescendo) dan makin lembut saat turun (diminuendo).",
      "Di empat ketukan terakhir lagu, perlambat sedikit demi sedikit (ritardando).",
      "Rekam dirimu memainkan Minuet in G, lalu dengarkan bersama keluarga.",
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
        body: "Huruf-huruf kecil di partitur memberi tahu seberapa keras kamu bermain. pp (pianissimo) sangat lembut, p (piano) lembut, mp dan mf sedang, f (forte) keras, ff (fortissimo) sangat keras. Rahasianya: makin cepat jari menekan tuts, makin keras bunyinya.",
      },
      {
        week: 2,
        title: "Crescendo pada scale C",
        type: "interactive_sheet",
        body: "Mulai lembut (p) di C4, makin keras sampai (f) di C5, lalu turun lagi pelan-pelan jadi lembut.",
        notation: "C4/q, D4/q, E4/q, F4/q, G4/q, A4/q, B4/q, C5/q, B4/q, A4/q, G4/q, F4/q, E4/q, D4/q, C4/h",
      },
      {
        week: 3,
        title: "Für Elise (pembuka)",
        type: "interactive_sheet",
        body: "Lagu terkenal dari Beethoven. Mainkan sangat lembut (pianissimo), dengan E dan D# bergantian seperti bisikan. Aslinya ditulis dalam birama 3/8; di sini dirapikan ke 4/4 supaya mudah dibaca.",
        notation: "E5/8, D#5/8, E5/8, D#5/8, E5/8, B4/8, D5/8, C5/8, A4/q, R/8, C4/8, E4/8, A4/8, B4/q, R/8, E4/8, G#4/8, B4/8, C5/q, R/q",
      },
      {
        week: 4,
        title: "Minuet in G (pembuka)",
        type: "interactive_sheet",
        body: "Lagu dansa dari buku catatan Anna Magdalena Bach, dalam birama 3/4. Hitung 1-2-3, 1-2-3, seperti orang berdansa. Mainkan agak keras (mezzo forte).",
        notation: "D5/q, G4/8, A4/8, B4/8, C5/8, D5/q, G4/q, G4/q, E5/q, C5/8, D5/8, E5/8, F#5/8, G5/q, G4/q, G4/q",
        time: "3/4",
      },
      {
        week: 4,
        title: "Kuis: dinamika",
        type: "quiz",
        quiz: [
          q("Huruf p di partitur artinya…", ["Lembut", "Keras", "Pelan (tempo)"], 0),
          q("Crescendo artinya…", ["Makin lambat", "Makin keras", "Makin lembut"], 1),
          q("Ritardando artinya…", ["Makin cepat", "Makin lambat", "Berhenti mendadak"], 1),
        ],
      },
    ],
  },
  // --------------------------------------------------------------------- Pro
  {
    level: 11,
    tier: 5,
    title: "Sight-reading: baca langsung main",
    description: "Melihat partitur baru lalu langsung memainkannya tanpa berhenti. Mata selalu satu birama di depan jari.",
    daily_minutes: 30,
    weekly_targets: [
      "Setiap hari, baca dan mainkan empat birama baru. Kalau salah, jalan terus.",
      "Latih mata melihat birama berikutnya saat jari masih memainkan birama sekarang.",
      "Sight-reading di Bass Clef, empat birama sehari.",
      "Sight-reading dengan eighth note dan rest.",
      "Sight-reading dengan key signature satu kres.",
      "Baca enam belas birama baru di 80 BPM, dengan salah kurang dari tiga not.",
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
        body: "Sebelum mulai, lihat dulu key signature, birama, dan nada paling rendah serta paling tinggi. Lalu mainkan pelan-pelan dan jangan berhenti. Satu not salah tidak apa-apa, asal hitungannya tetap jalan.",
      },
      {
        week: 2,
        title: "Bacaan 1: melangkah",
        type: "interactive_sheet",
        body: "Mainkan sekali dari awal sampai akhir tanpa berhenti. Setelah itu, tekan Play untuk mengecek.",
        notation: "E4/q, F4/q, G4/q, E4/q, D4/q, E4/q, F4/h, G4/q, A4/q, B4/q, G4/q, C5/w",
      },
      {
        week: 3,
        title: "Bacaan 2: Bass Clef",
        type: "interactive_sheet",
        body: "Sama seperti tadi, tapi kali ini dengan tangan kiri.",
        notation: "C3/q, D3/q, E3/q, C3/q, G3/h, F3/h, E3/q, D3/q, C3/q, B2/q, C3/w",
        clef: "bass",
      },
      {
        week: 4,
        title: "Bacaan 3: ritme",
        type: "interactive_sheet",
        body: "Hati-hati dengan rest dan eighth note. Hitung pelan-pelan dulu sebelum mulai.",
        notation: "C5/8, B4/8, A4/q, R/q, G4/q, F4/8, G4/8, A4/q, R/8, A4/8, G4/q, E4/qd, D4/8, C4/h",
      },
      {
        week: 5,
        title: "Bacaan 4: G mayor",
        type: "interactive_sheet",
        body: "Ada satu kres di depan, jadi setiap F dimainkan sebagai F# (tuts hitam).",
        notation: "G4/q, B4/q, D5/q, B4/q, A4/q, F#4/q, G4/h, D4/q, E4/q, F#4/q, A4/q, G4/w",
      },
      {
        week: 6,
        title: "Kuis: sight-reading",
        type: "quiz",
        quiz: [
          q("Saat sight-reading lalu kamu salah not, sebaiknya…", ["Berhenti dan ulangi", "Terus jalan", "Mulai dari awal"], 1),
          q("Apa yang dilihat dulu sebelum mulai membaca?", ["Judul saja", "Key signature dan birama", "Nomor halaman"], 1),
        ],
      },
    ],
  },
  {
    level: 12,
    tier: 5,
    title: "Konser kecil: klasik dan jazz",
    description: "Chord seventh yang terdengar keren, lagu Bach yang indah, blues scale dengan rasa swing, lalu konser kecilmu sendiri.",
    daily_minutes: 30,
    weekly_targets: [
      "Kenali tiga chord seventh: Dm7, G7, dan Cmaj7.",
      "Mainkan ii-V-I di C mayor tanpa melihat tangan.",
      "Mainkan delapan birama pertama Prelude in C dari Bach.",
      "Mainkan blues scale C dengan rasa swing.",
      "Dalam satu kali latihan, mainkan satu lagu klasik dan satu lagu jazz.",
      "Adakan konser kecil di rumah: mainkan dua lagu tanpa berhenti di depan keluarga, lalu rekam.",
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
        body: "Chord seventh adalah triad yang ditambah satu nada lagi di atasnya, jadi empat nada. Dm7, G7, dan Cmaj7 sering dipakai di lagu jazz.",
        notation: "(D4 F4 A4 C5)/w, (G4 B4 D5 F5)/w, (C4 E4 G4 B4)/w",
      },
      {
        week: 2,
        title: "ii-V-I di C",
        type: "interactive_sheet",
        body: "Susunan nada G7 diubah sedikit (inversi) supaya jarimu hampir tidak perlu pindah dari Dm7.",
        notation: "(D4 F4 A4 C5)/h, (D4 F4 G4 B4)/h, (C4 E4 G4 B4)/w",
      },
      {
        week: 3,
        title: "Prelude in C, BWV 846 (pembuka)",
        type: "interactive_sheet",
        body: "Bach membuat lagu ini dari chord yang nadanya dimainkan satu per satu. Jaga semua sixteenth note tetap rata, seperti air yang mengalir.",
        notation:
          "C4/16, E4/16, G4/16, C5/16, E5/16, G4/16, C5/16, E5/16, C4/16, E4/16, G4/16, C5/16, E5/16, G4/16, C5/16, E5/16, C4/16, D4/16, A4/16, D5/16, F5/16, A4/16, D5/16, F5/16, C4/16, D4/16, A4/16, D5/16, F5/16, A4/16, D5/16, F5/16",
      },
      {
        week: 4,
        title: "Blues scale C",
        type: "interactive_sheet",
        body: "Nadanya C, Eb, F, F#, G, Bb. Mainkan dengan rasa swing: dari setiap pasangan eighth note, yang pertama sedikit lebih panjang, seperti langkah sambil bergoyang.",
        notation: "C4/8, Eb4/8, F4/8, F#4/8, G4/8, Bb4/8, C5/q, Bb4/8, G4/8, F#4/8, F4/8, Eb4/8, C4/8, C4/q",
      },
      {
        week: 6,
        title: "Kuis: repertoar",
        type: "quiz",
        quiz: [
          q("Di C mayor, ii-V-I adalah…", ["Dm7 - G7 - Cmaj7", "C - F - G", "Am - Dm - G"], 0),
          q("Nada khas yang membuat blues scale terdengar blues adalah…", ["F#", "B", "D"], 0),
          q("Prelude in C dari Bach dibuat dari…", ["Melodi panjang", "Chord yang dipecah", "Scale cepat"], 1),
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
