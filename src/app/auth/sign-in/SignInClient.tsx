"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { supabaseBrowser } from "@/modules/shared/lib/supabase/browser";

export default function SignInClient() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { router.prefetch("/dashboard"); }, [router]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    const supabase = supabaseBrowser();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMsg(error.message || "Credenciales inválidas");
      setLoading(false);
      return;
    }
    setTimeout(async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session) router.replace("/dashboard");
      } catch {}
    }, 500);
  };

  return (
    <main className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-sm px-4 py-14">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Gestión de pedidos</h1>
          <p className="text-sm text-zinc-500">
            Accedé para administrar pedidos, clientes y productos
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <input id="email" className="w-full rounded-lg border border-zinc-300 px-3 py-2"
                   type="email" placeholder="tu@correo.com" value={email}
                   onChange={(e) => setEmail(e.target.value)} autoComplete="email" required disabled={loading}/>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium">Contraseña</label>
            <div className="relative">
              <input id="password" className="w-full rounded-lg border border-zinc-300 px-3 py-2 pr-10"
                     type={showPass ? "text" : "password"} placeholder="••••••••" value={password}
                     onChange={(e) => setPassword(e.target.value)} autoComplete="current-password"
                     required disabled={loading}/>
              <button type="button" onMouseDown={(e) => e.preventDefault()}
                      onClick={() => !loading && setShowPass(s => !s)}
                      className="absolute inset-y-0 right-0 px-3 text-zinc-500 hover:text-zinc-800"
                      aria-label={showPass ? "Ocultar contraseña" : "Mostrar contraseña"} disabled={loading}>
                {showPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button type="submit" className="mt-2 h-10 w-full rounded-lg bg-black text-white disabled:opacity-60" disabled={loading}>
            {loading ? "Entrando…" : "Entrar"}
          </button>

          {msg && <p role="alert" className="text-sm text-red-600">{msg}</p>}

          <div className="flex items-center justify-end text-sm">
            <a href="/auth/forgot-password" className="text-zinc-600 hover:text-zinc-900">
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        </form>

        <p className="mt-6 text-center text-xs text-zinc-400">
          © {new Date().getFullYear()} Bobek — Acceso privado
        </p>
      </div>
    </main>
  );
}
