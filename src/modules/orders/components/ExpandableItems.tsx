"use client";


import { useEffect, useState } from "react";
import { money } from "@/modules/shared/lib/format";
import { t } from "@/modules/shared/i18n";
import type { OrderItem } from "@/types";

export default function ExpandableItems({ items }: { items: OrderItem[] }) {
  const [expanded, setExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const mobileThreshold = 6;
  const collapsedCount = isMobile ? 4 : 3;

  const shouldCollapse =
    (isMobile && items.length > mobileThreshold) ||
    (!isMobile && items.length > collapsedCount);

  const visible = expanded || !shouldCollapse ? items : items.slice(0, collapsedCount);
  const hidden = shouldCollapse ? items.length - visible.length : 0;

  return (
    <div className="space-y-1 pr-1 sm:pr-4">
      <ul className="space-y-1">
        {visible.map((it) => (
          <li key={it.id} className="flex justify-between text-slate-700 text-sm">
            <span className="min-w-0 truncate" title={it.product?.name ?? `#${it.productId}`}>
              {it.product?.name ?? `#${it.productId}`}
            </span>
            <span
              className="shrink-0 tabular-nums text-slate-600 ml-3 whitespace-nowrap"
              title={`${it.quantity}× ${money(it.unitPrice)}`}
            >
              {it.quantity}× {money(it.unitPrice)}
            </span>
          </li>
        ))}
      </ul>

      {shouldCollapse && (
        <button
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          className="text-xs text-blue-600 hover:underline sm:mt-0 mt-1"
        >
          {expanded ? t("showLess") : t("showMoreN").replace("{n}", String(hidden))}
        </button>
      )}
    </div>
  );
}
