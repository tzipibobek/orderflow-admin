const LOCALE = "es-AR";
const CURRENCY = "ARS";

export function money(
  v: number | string | null | undefined,
  {
    digits = 0,
    display = "symbol",
  }: { digits?: number; display?: "symbol" | "code" | "narrowSymbol" | "name" } = {}
) {
  const n = typeof v === "string" ? Number(v) : v ?? 0;
  const safe = Number.isFinite(n as number) ? (n as number) : 0;
  return new Intl.NumberFormat(LOCALE, {
    style: "currency",
    currency: CURRENCY,
    currencyDisplay: display,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(safe);
}
