import { cn } from "@/lib/utils";

/**
 * Ikon Notes of Nopia: keyboard miring dengan not musik dan garis bunyi di
 * atasnya, digambar ulang sebagai SVG tanpa latar. Garis memakai warna `ink`
 * (default currentColor), tuts putih memakai `paper`.
 */
export function BrandMark({
  className,
  ink = "currentColor",
  paper = "#ffffff",
  title,
}: {
  className?: string;
  ink?: string;
  paper?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 512 512"
      className={cn("size-6", className)}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title && <title>{title}</title>}
      <BrandMarkArt ink={ink} paper={paper} />
    </svg>
  );
}

const WHITE_W = 47.4;
const KEY_X = 82;
const KEYS_TOP = 300;
const KEYS_FRONT = 404;
const KEYS_BOTTOM = 436;

/** Isi SVG, dipakai juga oleh app/icon.tsx untuk favicon. */
export function BrandMarkArt({ ink, paper }: { ink: string; paper: string }) {
  const stroke = { stroke: ink, strokeWidth: 13, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };
  const dividers = Array.from({ length: 6 }, (_, i) => KEY_X + WHITE_W * (i + 1));
  const blacks = [1, 2, 4, 5, 6].map((k) => KEY_X + WHITE_W * k - 15);

  return (
    <>
      {/* Garis bunyi */}
      <g {...stroke} strokeWidth={10}>
        <path d="M96 286c4-22 14-40 28-54" />
        <path d="M128 296c6-30 20-56 40-74" />
        <path d="M166 280c10-34 30-62 58-80" />
        <path d="M214 272c18-38 48-66 88-84 40-18 84-22 120-12" />
        <path d="M268 262c26-32 64-50 110-52 26-2 52 4 72 14" />
        <path d="M330 236c30-12 66-12 98 0" />
        <path d="M402 138c14 16 22 36 22 58" />
        <path d="M440 168c6 18 6 38-2 56" />
        <path d="M54 300c-2-14 0-28 6-40" />
      </g>

      {/* Not tunggal kiri */}
      <g fill={ink}>
        <ellipse cx="190" cy="206" rx="20" ry="15" transform="rotate(-24 190 206)" />
        <path d="M200 202V112" {...stroke} strokeWidth={11} />
        <path d="M200 112c14 2 26 10 30 22-8-4-18-6-30-4z" />
        {/* Not kecil atas */}
        <ellipse cx="258" cy="128" rx="16" ry="12" transform="rotate(-24 258 128)" />
        <path d="M267 125V52" {...stroke} strokeWidth={10} />
        <path d="M267 52c12 4 22 12 24 24-8-6-16-8-24-6z" />
        {/* Sepasang not ber-beam */}
        <ellipse cx="300" cy="226" rx="20" ry="15" transform="rotate(-24 300 226)" />
        <ellipse cx="364" cy="196" rx="20" ry="15" transform="rotate(-24 364 196)" />
        <path d="M310 222V142M374 192V114" {...stroke} strokeWidth={11} />
        <path d="M304 134l76-28v26l-76 28z" />
      </g>

      {/* Keyboard miring */}
      <g transform="rotate(-14 256 370)">
        <rect
          x={KEY_X}
          y={KEYS_TOP}
          width={WHITE_W * 7}
          height={KEYS_BOTTOM - KEYS_TOP}
          rx="22"
          {...stroke}
          fill={paper}
        />
        <path d={`M${KEY_X + 6} ${KEYS_FRONT}H${KEY_X + WHITE_W * 7 - 6}`} {...stroke} />
        {dividers.map((x) => (
          <path key={x} d={`M${x} ${KEYS_TOP + 6}V${KEYS_BOTTOM - 6}`} {...stroke} strokeWidth={10} />
        ))}
        {blacks.map((x) => (
          <rect key={x} x={x} y={KEYS_TOP - 10} width="30" height="76" rx="7" fill={ink} />
        ))}
      </g>
    </>
  );
}
