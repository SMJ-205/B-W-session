import type { Metadata } from "next";
import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { KeyBandArt } from "@/components/site/key-band-art";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Masuk · Notes of Nopia" };

export default function LoginPage() {
  return (
    <div className="grid min-h-svh content-start gap-3 bg-paper p-3 md:content-stretch md:grid-cols-2">
      <div className="flex flex-col overflow-hidden rounded-[4px_4px_32px_32px] bg-paper-2 text-oxblood">
        <KeyBandArt from="C4" to="B4" white="var(--paper)" className="h-16 w-full shrink-0" />
        <div className="flex flex-1 flex-col justify-center px-6 py-8 md:px-12 md:py-12">
          <Link href="/" className="flex items-center gap-2 text-[17px] font-bold">
            <BrandMark className="size-10" /> Notes of Nopia
          </Link>
          <h1 className="mt-8 text-[clamp(2rem,1.5rem+1.4vw,2.75rem)] leading-[1.02] font-bold tracking-[-0.035em]">
            Simpan progress ke akun
          </h1>
          <p className="mt-4 max-w-[40ch] font-serif text-[17px] leading-[1.55]">
            Tanpa akun, progress tetap tersimpan di browser ini. Dengan akun, timeline, streak, dan kuis yang sudah
            lulus ikut ke perangkat lain.
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center rounded-[4px_4px_32px_32px] bg-white px-6 py-8 md:py-12">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
