"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2, Search, User, Package, ClipboardList, ArrowUpRight, X } from "lucide-react";
import Link from "next/link";
import { t } from "@/modules/shared/i18n";

export type SearchHit = {
    id: string;
    kind: "customer" | "order" | "product";
    title: string;
    subtitle?: string;
    href: string;
};

type GlobalSearchProps = {
    inputRef?: React.RefObject<HTMLInputElement | null>;
    className?: string;
    autoFocus?: boolean;
    onSelect?: () => void;
};

export default function GlobalSearch({ inputRef, className, autoFocus = false, onSelect }: GlobalSearchProps) {
    const [q, setQ] = useState("");
    const [focus, setFocus] = useState(false);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<SearchHit[]>([]);
    const [error, setError] = useState<string | null>(null);
    const abortRef = useRef<AbortController | null>(null);

    useEffect(() => {
        if (!q.trim()) { setResults([]); setLoading(false); setError(null); return; }
        setLoading(true); setError(null);

        abortRef.current?.abort();
        const ac = new AbortController();
        abortRef.current = ac;

        const tmo = setTimeout(async () => {
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=6`, { signal: ac.signal });
                if (!res.ok) throw new Error("Search failed");
                const data: { hits: SearchHit[] } = await res.json();
                setResults(data.hits ?? []);
            } catch (e: any) {
                if (e.name !== "AbortError") setError(e.message || "Search failed");
            } finally {
                setLoading(false);
            }
        }, 220);

        return () => clearTimeout(tmo);
    }, [q]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            const isMac = navigator.platform.toUpperCase().includes("MAC");
            if ((isMac ? e.metaKey : e.ctrlKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                inputRef?.current?.focus();
                setFocus(true);
            }
            if (e.key === "Escape") setFocus(false);
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [inputRef]);

    const grouped = useMemo(() => {
        const g: Record<string, SearchHit[]> = { customer: [], order: [], product: [] };
        for (const r of results) g[r.kind].push(r);
        return g;
    }, [results]);

    return (
        <div className={`relative ${className ?? ""}`}>
            <div className={`flex items-center gap-2 rounded-md border bg-white px-2 ${focus ? "ring-2 ring-slate-300" : ""}`}>
                <Search className="w-4 h-4 text-slate-400" />
                <input
                    ref={inputRef as any}
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    onFocus={() => setFocus(true)}
                    onBlur={() => setTimeout(() => setFocus(false), 150)}
                    placeholder={t("search")}
                    className="h-10 w-full bg-transparent outline-none placeholder:text-slate-400 text-[15px]"
                    aria-label={t("search")}
                    autoFocus={autoFocus}
                />
                {q && (
                    <button
                        className="p-1 rounded hover:bg-slate-100"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => setQ("")}
                        aria-label={t("clear")}
                    >
                        <X className="w-4 h-4 text-slate-400" />
                    </button>
                )}
            </div>

            {focus && (q || loading) && (
                <div className="absolute left-0 right-0 mt-1 rounded-md border bg-white shadow-lg overflow-hidden z-50">
                    {loading && (
                        <div className="p-3 text-sm text-slate-500 flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" /> {t("searching")}
                        </div>
                    )}

                    {!loading && error && <div className="p-3 text-sm text-red-600">{error}</div>}

                    {!loading && !error && results.length === 0 && (
                        <div className="p-3 text-sm text-slate-500">{t("noResults")}</div>
                    )}

                    {!loading && !error && results.length > 0 && (
                        <div className="max-h-80 overflow-auto">
                            <Section title={t("customers")} icon={<User className="w-4 h-4" />} items={grouped.customer} onSelect={onSelect} />
                            <Section title={t("orders")} icon={<ClipboardList className="w-4 h-4" />} items={grouped.order} onSelect={onSelect} />
                            <Section title={t("products")} icon={<Package className="w-4 h-4" />} items={grouped.product} onSelect={onSelect} />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function Section({ title, icon, items, onSelect }: {
    title: string;
    icon: React.ReactNode;
    items: SearchHit[];
    onSelect?: () => void;
}) {
    if (!items.length) return null;
    return (
        <div className="py-1">
            <div className="px-3 py-1.5 text-[11px] uppercase tracking-wide text-slate-500 flex items-center gap-2">
                {icon} <span>{title}</span>
            </div>
            <ul className="px-1 pb-1">
                {items.map((it) => (
                    <li key={`${it.kind}:${it.id}`}>
                        <Link
                            href={it.href}
                            className="flex items-center justify-between gap-3 rounded-md px-2 py-2 hover:bg-slate-50 transition"
                            onClick={() => onSelect?.()}
                        >
                            <div>
                                <div className="text-[14px] font-medium text-slate-900">{it.title}</div>
                                {it.subtitle && <div className="text-[12px] text-slate-500 line-clamp-1">{it.subtitle}</div>}
                            </div>
                            <ArrowUpRight className="w-4 h-4 text-slate-400" />
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
