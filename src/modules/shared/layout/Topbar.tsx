"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

import { Menu, Search, LogOut } from "lucide-react";

import GlobalSearch from "@/modules/shared/search/GlobalSearch";
import SimpleLogoutButton from "@/modules/auth/SimpleLogoutButton";
import { isDemo } from "@/modules/shared/config";
import { t } from "@/modules/shared/i18n";

export default function Topbar({ onMenu }: { onMenu: () => void }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const searchWrapRef = useRef<HTMLDivElement | null>(null);
  const searchBtnRef = useRef<HTMLButtonElement | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (searchOpen) setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!searchOpen) return;
    const onClick = (e: MouseEvent) => {
      const tnode = e.target as Node;
      if (searchWrapRef.current?.contains(tnode) || searchBtnRef.current?.contains(tnode)) return;
      setSearchOpen(false);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSearchOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchOpen]);

  return (
    <header className="sticky top-0 z-40 md:pl-64 bg-white supports-[backdrop-filter]:bg-white/80 supports-[backdrop-filter]:backdrop-blur border-b border-slate-200">
      <div className="h-14 mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 flex items-center gap-2">
        <button
          onClick={onMenu}
          className="p-2 rounded-md hover:bg-slate-100 md:hidden"
          aria-label={t("openMenu")}
        >
          <Menu className="w-5 h-5" />
        </button>

        <a
          href="/dashboard"
          className="font-semibold text-slate-800 hover:text-blue-700 truncate"
          title={t("appTitle")}
        >
          {t("appTitle")}
        </a>

        {isDemo && (
          <span className="ml-2 hidden sm:inline rounded-md bg-sky-100 text-sky-800 text-xs px-2 py-0.5">
            demo
          </span>
        )}

        {/* Desktop */}
        <div className="ml-auto hidden lg:flex items-center gap-2 w-full max-w-[28rem]">
          <div className="flex-1 min-w-0">
            <GlobalSearch className="w-full" />
          </div>
          {!isDemo && <SimpleLogoutButton />}
        </div>

        {/* Mobile + tablet */}
        <div className="ml-auto flex-1 flex lg:hidden items-center justify-end gap-2 min-w-0">
          <div
            ref={searchWrapRef}
            className={[
              "relative min-w-0 transition-all duration-200 ease-out",
              searchOpen
                ? "max-w-[min(92vw,24rem)] opacity-100 z-50"
                : "max-w-0 opacity-0 pointer-events-none",
            ].join(" ")}
            style={{ flex: searchOpen ? "1 1 auto" : "0 0 auto" }}
            aria-expanded={searchOpen}
          >
            <GlobalSearch className="w-full" autoFocus={searchOpen} />
          </div>

          {!searchOpen && (
            <button
              ref={searchBtnRef}
              className="p-2 rounded-md hover:bg-slate-100"
              aria-label={t("search")}
              onClick={() => setSearchOpen(true)}
            >
              <Search className="w-5 h-5" />
            </button>
          )}

          {!isDemo && (
            <>
              <SimpleLogoutButton id="signout-hidden" className="sr-only" />
              <button
                className="p-2 rounded-md hover:bg-slate-100"
                aria-label="Sign out"
                onClick={() =>
                  document.getElementById("signout-hidden")?.click()
                }
              >
                <LogOut className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
