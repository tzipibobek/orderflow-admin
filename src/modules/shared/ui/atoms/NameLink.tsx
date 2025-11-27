"use client";
import Link from "next/link";
import { t } from "@/modules/shared/i18n";

type Props = { href: string; label: string; className?: string };

export default function NameLink({ href, label, className }: Props) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-1.5 font-medium text-slate-800 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded ${className ?? ""}`}
      title={label}
      aria-label={`${t("view")} ${label}`}
    >
      <span className="truncate">{label}</span>
      <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 -translate-x-0.5 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100">
        <path d="M7 5l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  );
}
