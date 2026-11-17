import { midiToPitch, toMidi } from "@/lib/music/notation";

/**
 * Deret tuts sebagai gambar SVG datar (tanpa interaksi), untuk motif besar.
 * Warna diambil dari token CSS lewat `fill`.
 */
export function KeyBandArt({
  from = "E4",
  to = "C5",
  className,
  white = "var(--paper-2)",
  black = "var(--oxblood)",
  label = "Deret tuts piano",
}: {
  from?: string;
  to?: string;
  className?: string;
  white?: string;
  black?: string;
  label?: string;
}) {
  const keys: { black: boolean }[] = [];
  for (let m = toMidi(from); m <= toMidi(to); m++) keys.push({ black: midiToPitch(m).includes("#") });
  const whites = keys.filter((k) => !k.black).length;
  const W = 100; // lebar satu tuts putih
  const H = 600;
  const gap = 6;
  let wi = 0;
  const rects: React.ReactNode[] = [];
  const blacks: React.ReactNode[] = [];
  keys.forEach((k, i) => {
    if (!k.black) {
      rects.push(<path key={i} d={keyPath(wi * W, W - gap, H, 18)} fill={white} />);
      wi++;
    } else {
      const bw = W * 0.56;
      blacks.push(<path key={i} d={keyPath(wi * W - bw / 2 - gap / 2, bw, H * 0.62, 14)} fill={black} />);
    }
  });
  return (
    <svg
      viewBox={`0 0 ${whites * W} ${H}`}
      preserveAspectRatio="xMinYMin slice"
      role="img"
      aria-label={label}
      className={className}
    >
      {rects}
      {blacks}
    </svg>
  );
}

/** Persegi panjang dengan sudut atas tajam dan sudut bawah membulat. */
function keyPath(x: number, w: number, h: number, r: number) {
  return `M${x} 0H${x + w}V${h - r}Q${x + w} ${h} ${x + w - r} ${h}H${x + r}Q${x} ${h} ${x} ${h - r}Z`;
}
