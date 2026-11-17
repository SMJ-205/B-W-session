"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export function AuthButton() {
  const supabase = getSupabaseBrowserClient();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
    return () => data.subscription.unsubscribe();
  }, [supabase]);

  if (!supabase) {
    return (
      <p className="leading-snug text-muted-foreground">
        Progress tersimpan di browser ini.{" "}
        <Link href="/login" className="text-ink underline underline-offset-2">
          Simpan ke akun
        </Link>
      </p>
    );
  }

  if (!user) {
    return (
      <Link href="/login" className="text-ink underline underline-offset-2">
        Masuk
      </Link>
    );
  }

  return (
    <div className="space-y-1">
      <p className="truncate text-muted-foreground" title={user.email}>
        {user.email}
      </p>
      <button
        type="button"
        className="text-ink underline underline-offset-2"
        onClick={() => supabase.auth.signOut()}
      >
        Keluar
      </button>
    </div>
  );
}
