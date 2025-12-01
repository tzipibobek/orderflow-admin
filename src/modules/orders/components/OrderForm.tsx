"use client";

import { useEffect, useId } from "react";
import { cls } from "@/modules/shared/lib/api";
import { money } from "@/modules/shared/lib/format";
import { t } from "@/modules/shared/i18n";
import OrderLineRow from "./OrderLineRow";
import { useOrderForm, type OrderItem } from "../hooks/useOrderForm";

type Props = {
  initialCustomerId?: number | "";
  initialItems?: OrderItem[];
  statusBadge?: "DELIVERED" | "TO_DELIVER";
  submitLabel?: string;
  onSubmit: (data: { customerId: number; items: OrderItem[] }) => Promise<void> | void;
  onCancel?: () => void;
};

export default function OrderForm({
  initialCustomerId = "",
  initialItems = [],
  statusBadge,
  submitLabel = t("save"),
  onSubmit,
  onCancel,
}: Props) {
  const {
    products,
    customers,
    customerId,
    items,
    saving,
    loading,
    error,
    total,
    canSave,
    setCustomerId,
    addLine,
    changeProduct,
    changeQty,
    removeLine,
    save,
  } = useOrderForm({ initialCustomerId, initialItems, onSubmit });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") save();
      if (e.key === "Escape" && onCancel) onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [save, onCancel]);

  const custId = useId();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3">
        <label htmlFor={custId} className="text-sm font-medium text-gray-700">
          {t("customer")}
        </label>
        <select
          id={custId}
          className={`${cls.input} w-full sm:w-60`}
          value={customerId}
          onChange={(e) => setCustomerId(Number(e.target.value) || "")}
          disabled={loading}
        >
          <option value="">{t("select")}</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {statusBadge && (
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider
            ${statusBadge === "DELIVERED"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
              }`}
          >
            {statusBadge === "DELIVERED" ? t("delivered") : t("toDeliver")}
          </span>
        )}
      </div>

      {/* Items */}
      <div className={`${cls.card} p-4 space-y-4`}>
        {loading && <div className="h-24 animate-pulse rounded bg-gray-100" />}

        {!loading && items.length > 0 && (
          <div className="hidden sm:grid sm:grid-cols-[5fr_2fr_2fr_2fr_auto] gap-3 text-sm font-semibold text-gray-500 pb-2 border-b border-gray-200">
            <div>{t("product")}</div>
            <div className="text-center">{t("qty")}</div>
            <div className="text-right">{t("unitPrice")}</div>
            <div className="text-right">{t("lineTotal")}</div>
            <div className="w-8" />
          </div>
        )}

        {!loading &&
          items.map((it, i) => (
            <OrderLineRow
              key={it.id}
              products={products}
              item={it}
              index={i}
              onProductChange={changeProduct}
              onQtyChange={changeQty}
              onRemove={removeLine}
            />
          ))}

        <button
          onClick={addLine}
          disabled={loading || products.length === 0}
          className={`${cls.btn} ${cls.btnGhost} w-full sm:w-32 mt-4 text-blue-600 hover:text-blue-800`}
        >
          {t("addItem")}
        </button>

        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-lg font-bold">{t("total")}</div>
            <div className="text-lg font-bold" aria-live="polite">
              {money(total)}
            </div>
          </div>
        </div>
      </div>

      {error && <div className="text-sm text-red-600">{error}</div>}

      <div className="flex flex-col sm:flex-row gap-2">
        <button
          onClick={save}
          disabled={!canSave}
          className={`${cls.btn} ${cls.btnPrimary} w-full sm:w-36`}
        >
          {saving ? t("saving") : submitLabel ?? t("save")}
        </button>
        {onCancel && (
          <button onClick={onCancel} className={`${cls.btn} ${cls.btnGhost} w-full sm:w-28`}>
            {t("cancel")}
          </button>
        )}
      </div>
    </div>
  );
}
