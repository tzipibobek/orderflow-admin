"use client";
import Link from "next/link";
import type { ReactNode } from "react";
import type { UrlObject } from "url";
import { cls } from "@/modules/shared/lib/api";
import { t } from "@/modules/shared/i18n";

type AddLink = { as: "link"; href: string | UrlObject; label?: string };
type AddButton = { as: "button"; onClick: () => void; label?: string };
type Add = AddLink | AddButton;

export default function PageHeader({ title, add, inline }: {
  title: string | ReactNode;
  add?: Add;
  inline?: ReactNode;
}) {
  const defaultLabel = t("new");

  return (
    <header className="mb-5 flex items-center justify-between gap-3">
      <div className="min-w-0 flex items-center gap-3">
        <h1 className={`${cls.h1} text-lg sm:text-xl truncate`}>{title}</h1>
        {inline ? <div className="shrink-0">{inline}</div> : null}
      </div>

      {add?.as === "link" ? (
        <Link href={add.href} className={`${cls.btn} ${cls.btnPrimary} h-10 px-4 shrink-0 inline-flex items-center justify-center`}>
          {add.label ?? defaultLabel}
        </Link>
      ) : add?.as === "button" ? (
        <button onClick={add.onClick} className={`${cls.btn} ${cls.btnPrimary} h-10 px-4 shrink-0 inline-flex items-center justify-center`}>
          {add.label ?? defaultLabel}
        </button>
      ) : null}
    </header>
  );
}
