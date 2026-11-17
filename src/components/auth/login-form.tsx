"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export function LoginForm() {
  const supabase = getSupabaseBrowserClient();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!supabase) {
    return (
      <div className="space-y-4 text-ink">
        <h2 className="text-[20px] font-semibold">Login belum aktif</h2>
        <p className="text-[16px] leading-relaxed">
          Isi <code className="font-mono text-[14px]">NEXT_PUBLIC_SUPABASE_URL</code> dan{" "}
          <code className="font-mono text-[14px]">NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> di{" "}
          <code className="font-mono text-[14px]">.env.local</code> untuk mengaktifkannya. Sampai saat itu, progress
          tersimpan di browser.
        </p>
        <Link href="/dashboard" className="inline-block text-[15px] text-oxblood underline underline-offset-4">
          Lanjut belajar tanpa akun
        </Link>
      </div>
    );
  }

  const redirectTo = () => `${window.location.origin}/auth/callback?next=/dashboard`;

  const sendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo() },
    });
    setLoading(false);
    setMessage(error ? error.message : `Link masuk sudah dikirim ke ${email}. Buka dari perangkat ini.`);
  };

  return (
    <div className="space-y-6 text-ink">
      <h2 className="text-[20px] font-semibold">Masuk</h2>
      <Button
        variant="secondary"
        size="lg"
        className="w-full"
        onClick={() => supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: redirectTo() } })}
      >
        Masuk dengan Google
      </Button>

      <form onSubmit={sendMagicLink} className="space-y-3">
        <label htmlFor="email" className="block text-[14px] text-muted-foreground">
          Atau terima link masuk lewat email
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          placeholder="nama@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-12 w-full rounded-md border border-input bg-white px-3 text-[16px]"
        />
        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? "Mengirim…" : "Kirim link masuk"}
        </Button>
      </form>

      {message && (
        <p className="text-[15px]" aria-live="polite">
          {message}
        </p>
      )}
    </div>
  );
}
