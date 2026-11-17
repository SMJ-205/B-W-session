"use client";

/**
 * Audio service berbasis Tone.js.
 *
 * - Tone.js di-import secara dinamis (lazy) supaya tidak membebani bundle awal.
 * - Sampel piano asli (Salamander Grand Piano) baru diunduh saat pertama kali
 *   dibutuhkan, bukan saat halaman dimuat.
 * - `ensureAudioStarted()` WAJIB dipanggil dari event klik/tap user karena
 *   browser (terutama Safari) memblokir AudioContext sebelum ada interaksi.
 */

import type * as ToneNS from "tone";
import type { ParsedNote } from "@/lib/music/notation";

type Tone = typeof ToneNS;

const SAMPLE_BASE_URL = "https://tonejs.github.io/audio/salamander/";
const SAMPLE_MAP: Record<string, string> = {
  A0: "A0.mp3", C1: "C1.mp3", "D#1": "Ds1.mp3", "F#1": "Fs1.mp3",
  A1: "A1.mp3", C2: "C2.mp3", "D#2": "Ds2.mp3", "F#2": "Fs2.mp3",
  A2: "A2.mp3", C3: "C3.mp3", "D#3": "Ds3.mp3", "F#3": "Fs3.mp3",
  A3: "A3.mp3", C4: "C4.mp3", "D#4": "Ds4.mp3", "F#4": "Fs4.mp3",
  A4: "A4.mp3", C5: "C5.mp3", "D#5": "Ds5.mp3", "F#5": "Fs5.mp3",
  A5: "A5.mp3", C6: "C6.mp3", "D#6": "Ds6.mp3", "F#6": "Fs6.mp3",
  A6: "A6.mp3", C7: "C7.mp3", "D#7": "Ds7.mp3", "F#7": "Fs7.mp3",
  A7: "A7.mp3", C8: "C8.mp3",
};

let tonePromise: Promise<Tone> | null = null;
let samplerPromise: Promise<ToneNS.Sampler> | null = null;

function loadTone(): Promise<Tone> {
  tonePromise ??= import("tone");
  return tonePromise;
}

async function getSampler(): Promise<ToneNS.Sampler> {
  samplerPromise ??= loadTone().then(
    (Tone) =>
      new Promise<ToneNS.Sampler>((resolve, reject) => {
        const sampler = new Tone.Sampler({
          urls: SAMPLE_MAP,
          baseUrl: SAMPLE_BASE_URL,
          release: 1,
          onload: () => resolve(sampler),
          onerror: reject,
        }).toDestination();
      }),
  );
  return samplerPromise;
}

/** Panggil di handler klik pertama (tombol "Mulai Belajar" / "Play"). */
export async function ensureAudioStarted(): Promise<void> {
  const Tone = await loadTone();
  if (Tone.getContext().state !== "running") await Tone.start();
  await getSampler();
}

/** Mainkan satu nada (dari klik notasi atau tuts virtual). */
export async function playNote(pitch: string | string[], duration: string = "8n"): Promise<void> {
  await ensureAudioStarted();
  const sampler = await getSampler();
  sampler.triggerAttackRelease(pitch, duration);
}

export interface PlaybackHandle {
  stop: () => void;
}

/**
 * Mainkan rangkaian not sesuai durasinya.
 * `onStep(index)` dipanggil tepat saat not ke-index berbunyi (untuk highlight),
 * `onStep(-1)` saat selesai/berhenti.
 */
export async function playSequence(
  notes: ParsedNote[],
  { bpm = 90, onStep }: { bpm?: number; onStep?: (index: number) => void } = {},
): Promise<PlaybackHandle> {
  await ensureAudioStarted();
  const Tone = await loadTone();
  const sampler = await getSampler();
  const transport = Tone.getTransport();

  transport.stop();
  transport.cancel();
  transport.bpm.value = bpm;

  const secondsPerBeat = 60 / bpm;
  let time = 0;
  const ids: number[] = [];

  notes.forEach((note, index) => {
    const dur = note.beats * secondsPerBeat;
    ids.push(
      transport.schedule((t) => {
        if (note.pitches.length) sampler.triggerAttackRelease(note.pitches, dur * 0.95, t);
        Tone.getDraw().schedule(() => onStep?.(index), t);
      }, time),
    );
    time += dur;
  });

  ids.push(
    transport.schedule((t) => {
      Tone.getDraw().schedule(() => onStep?.(-1), t);
      transport.stop();
    }, time),
  );

  transport.start("+0.05");

  return {
    stop: () => {
      transport.stop();
      transport.cancel();
      onStep?.(-1);
    },
  };
}
