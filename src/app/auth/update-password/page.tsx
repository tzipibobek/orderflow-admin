"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseBrowser } from "@/modules/shared/lib/supabase/browser";

function Inner() {
  const router = useRouter();
  const sp = useSearchParams();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const supabase = supabaseBrowser();
      try {
        const code = sp.get("code");
        if (code) await supabase.auth.exchangeCodeForSession(code);

        const hash = new URLSearchParams(window.location.hash.slice(1));
        const access_token = hash.get("access_token");
        const refresh_token = hash.get("refresh_token");
        if (access_token && refresh_token) {
          await supabase.auth.setSession({ access_token, refresh_token });
        }
      } catch (e) {
        console.warn("No se pudo establecer la sesión desde el enlace", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setWorking(true);
    setMsg(null);
    try {
      const supabase = supabaseBrowser();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      try {
        const { data: s } = await supabase.auth.getSession();
        await fetch("/auth/set", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
          body: JSON.stringify({ event: "PASSWORD_UPDATED", session: s.session }),
        });
      } catch { }

      setDone(true);
      setWorking(false);
      setTimeout(() => { router.replace("/dashboard"); router.refresh(); }, 900);
    } catch (err: any) {
      console.error(err);
      setMsg(err.message || "No se pudo actualizar la contraseña");
      setWorking(false);
    }
  };

  if (loading) return (
    <div className="max-w-sm mx-auto px-4 py-10">
      <div className="rounded-2xl border bg-white p-6">Verificando enlace…</div>
    </div>
  );

  if (done) return (
    <div className="max-w-sm mx-auto px-4 py-10">
      <div className="space-y-3 rounded-2xl border bg-white p-6 text-center" aria-live="polite">
        <div className="text-4xl">✅</div>
        <h1 className="text-xl font-semibold">Contraseña actualizada</h1>
        <p className="text-sm text-zinc-600">Te estamos llevando al panel…</p>
        <button onClick={() => { router.replace("/dashboard"); router.refresh(); }}
          className="mt-2 h-10 w-full rounded-lg bg-black text-white">
          Ir ahora
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-sm mx-auto px-4 py-10">
      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border bg-white p-6">
        <h1 className="text-xl font-semibold">Crear nueva contraseña</h1>
        <label className="text-sm font-medium" htmlFor="password">Nueva contraseña</label>
        <input id="password" type="password" className="w-full rounded-lg border px-3 py-2"
          placeholder="••••••••" value={password}
          onChange={(e) => setPassword(e.target.value)} required minLength={8} disabled={working} />
        <button className="w-full h-10 rounded-lg bg-black text-white disabled:opacity-60" disabled={working}>
          {working ? "Actualizando…" : "Actualizar contraseña"}
        </button>
        {msg && <p role="alert" className="text-sm text-red-600" aria-live="assertive">{msg}</p>}
      </form>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <Inner />
    </Suspense>
  );
}
