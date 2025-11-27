"use client";

import { useState, useRef, useEffect, useId } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/modules/shared/lib/supabase/browser";

export default function SimpleLogoutButton({
  className = "px-3 py-2 rounded-lg border",
  children = "Cerrar sesión",
  id,
  confirm = true,
}: {
  className?: string;
  children?: React.ReactNode;
  id?: string;
  confirm?: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const firstBtnRef = useRef<HTMLButtonElement | null>(null);

  const uid = useId();
  const btnId = id ?? `logout-btn-${uid}`;
  const dialogId = `${btnId}-dialog`;
  const titleId = `${btnId}-title`;

  useEffect(() => {
    if (open && firstBtnRef.current) firstBtnRef.current.focus();
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  async function doLogout() {
    if (busy) return;
    setBusy(true);
    try {
      await supabaseBrowser().auth.signOut();
    } catch { }
    try {
      const blob = new Blob([JSON.stringify({ event: "SIGNED_OUT" })], {
        type: "application/json",
      });
      navigator.sendBeacon("/auth/set", blob);
    } catch { }
    setOpen(false);
    router.replace("/auth/sign-in");
  }

  if (!confirm) {
    return (
      <button
        id={btnId}
        className={className}
        onClick={async () => {
          if (window.confirm("¿Cerrar sesión en este dispositivo?")) await doLogout();
        }}
      >
        {children}
      </button>
    );
  }

  return (
    <>
      <button
        id={btnId}
        className={className}
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open ? true : false}
        aria-controls={dialogId}
      >
        {children}
      </button>

      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onClick={() => !busy && setOpen(false)}
          >
            <div className="absolute inset-0 bg-black/50" />

            <div
              className="relative w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl mx-4"
              id={dialogId}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 id={titleId} className="text-base font-semibold">
                ¿Cerrar sesión?
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Se cerrará la sesión solo en este dispositivo.
              </p>

              <div className="mt-4 flex gap-2 justify-end">
                <button
                  className="h-9 rounded-lg px-3 text-sm text-slate-600 hover:text-slate-900 disabled:opacity-50"
                  onClick={() => setOpen(false)}
                  disabled={busy}
                >
                  Cancelar
                </button>
                <button
                  ref={firstBtnRef}
                  className="h-9 rounded-lg px-3 text-sm bg-black text-white hover:opacity-90 disabled:opacity-50"
                  onClick={doLogout}
                  disabled={busy}
                >
                  {busy ? "Cerrando…" : "Cerrar sesión"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
