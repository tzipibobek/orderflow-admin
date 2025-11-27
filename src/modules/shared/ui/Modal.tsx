"use client";

import { PropsWithChildren, useEffect } from "react";

type ModalProps = PropsWithChildren<{
  title?: string;
  open: boolean;
  onClose: () => void;
  size?: "sm" | "md" | "lg";
}>;

export default function Modal({ title, open, onClose, size = "md", children }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  if (!open) return null;

  const maxWidth =
    size === "sm" ? "max-w-md" : size === "lg" ? "max-w-3xl" : "max-w-xl";

  return (
    <div
      className={`
        fixed inset-0 z-50
        p-4
        flex items-start justify-center
        md:justify-start md:pl-64
      `}
    >
      <div
        className="fixed inset-0 md:left-64 bg-slate-900/30 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-full flex justify-center mt-24 md:mt-20">
        <div
          className={`
            ${maxWidth} w-full bg-white rounded-2xl shadow-xl
          `}
        >
          {title && (
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
              <button
                onClick={onClose}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
          )}

          <div className="px-4 py-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
