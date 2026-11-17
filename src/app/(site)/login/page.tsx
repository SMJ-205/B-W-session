import type { Metadata } from "next";
import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { KeyBandArt } from "@/components/site/key-band-art";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Masuk · Notes of Nopia" };

export default function LoginPage() {
  return (
    <div className="dotted grid min-h-svh content-start gap-4 p-3 sm:p-4 md:content-stretch md:grid-cols-2">
      <div className="sticker flex flex-col overflow-hidden rounded-[24px] text-ink">
        <KeyBandArt from="C4" to="B4" white="#ffffff" black="var(--ink)" className="h-16 w-full shrink-0 border-b-[2.5px] border-ink" />
        <div className="flex flex-1 flex-col justify-center px-6 py-8 md:px-12 md:py-12">
          <Link href="/" className="flex items-center gap-2 text-[17px] font-bold">
            <BrandMark className="size-10" /> Notes of Nopia
          </Link>
          <h1 className="mt-8 text-[clamp(2rem,1.5rem+1.4vw,2.75rem)] leading-[1.02] font-bold tracking-[-0.035em]">
            Simpan progress ke akun
          </h1>
          <p className="mt-4 max-w-[40ch] text-[17px] leading-[1.55]">
            Minta bantuan orang tua untuk masuk. Tanpa akun pun, progress kamu tetap tersimpan di browser ini. Dengan akun, progress bisa dibuka dari HP atau laptop lain.
          </p>
        </div>
      </div>
      <div className="sticker flex items-center justify-center rounded-[24px] px-6 py-8 md:py-12">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
