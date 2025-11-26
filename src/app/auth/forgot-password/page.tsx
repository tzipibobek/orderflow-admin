"use client";
import { useState } from "react";
import { supabaseBrowser } from "@/modules/shared/lib/supabase/browser";

export default function ForgotPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setMsg(null);

    try {
      const supabase = supabaseBrowser();
      const redirectTo =
        `${window.location.origin}/auth/update-password`;

      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
      if (error) throw error;

      setSent(true);
    } catch (err: any) {
      console.warn(err);
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto px-4 py-10">
      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border bg-white p-6">
        <h1 className="text-xl font-semibold">Recuperar contraseña</h1>
        {sent ? (
          <p className="text-sm text-zinc-600">
            Si el email está registrado, te enviamos un enlace para restablecer tu contraseña.
            Revisá tu bandeja de entrada y spam.
          </p>
        ) : (
          <>
            <label className="text-sm font-medium" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="w-full rounded-lg border px-3 py-2"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
            <button className="w-full h-10 rounded-lg bg-black text-white disabled:opacity-60" disabled={loading}>
              {loading ? "Enviando…" : "Enviar enlace"}
            </button>
            {msg && <p className="text-sm text-red-600">{msg}</p>}
          </>
        )}
      </form>
    </div>
  );
}
