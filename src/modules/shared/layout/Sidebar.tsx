"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { isDemo } from "@/modules/shared/config";
import { t } from "@/modules/shared/i18n";

const links = [
  { href: "/dashboard", labelKey: "dashboard" },
  { href: "/orders", labelKey: "orders" },
  { href: "/products", labelKey: "products" },
  { href: "/customers", labelKey: "customers" },
] as const;

export default function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  return (
    <>
      {/* Backdrop (mobile) */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/30 md:hidden transition-opacity ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        role="navigation"
        aria-label="Sidebar"
        aria-hidden={open ? undefined : true}
        className={[
          "fixed inset-y-0 left-0 top-0 h-screen w-64 flex flex-col bg-white border-r border-slate-200 overflow-y-auto",
          "transform transition-transform duration-200 md:transform-none md:transition-none",
          open ? "translate-x-0 md:translate-x-0" : "-translate-x-full md:translate-x-0",
          "z-50",
        ].join(" ")}
      >

        <nav className="flex-1 p-4 space-y-1">
          {links.map((link) => {
            const active = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                aria-current={active ? "page" : undefined}
                className={[
                  "block rounded-md px-3 py-2 hover:bg-blue-50",
                  active ? "bg-blue-100 text-blue-900 font-medium" : "text-slate-700",
                ].join(" ")}
              >
                {t(link.labelKey as any)}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t text-xs text-slate-500 bg-white">
          {isDemo && (
            <span className="hidden md:inline-flex items-center gap-1 rounded-md bg-sky-100 text-sky-800 px-2 py-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
              Public demo (shared data)
            </span>
          )}
          <span className="md:ml-2 block md:inline mt-2 md:mt-0">v1.0</span>
        </div>

      </aside>
    </>
  );
}
