"use client";

import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type Props = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    "aria-label": string;
    title?: string;
  }
>;

export default function IconButton({
  className = "",
  children,
  ...rest
}: Props) {
  return (
    <button
      {...rest}
      className={[
        "inline-flex items-center justify-center",
        "w-9 h-9 rounded-lg",
        "border border-slate-200",
        "bg-white hover:bg-slate-100 active:scale-[.98]",
        "transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-blue-500",
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
}
