import { locale } from "../config";
import en from "./en";
import es from "./es";

const M = locale === "en" ? en : es;
export type MessageKey = keyof typeof en;

export const t = (k: MessageKey) => M[k] ?? (k as string);

export const fmtDate = (d: Date | string | null) =>
  !d ? "—" : new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" })
    .format(new Date(d));
