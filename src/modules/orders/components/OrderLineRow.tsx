"use client";

import { money } from "@/modules/shared/lib/format";
import { t } from "@/modules/shared/i18n";
import { cls } from "@/modules/shared/lib/api";
import type { LineItem, Product } from "../hooks/useOrderForm";

type Props = {
  products: Product[];
  item: LineItem;
  index: number;
  onProductChange: (index: number, productId: number) => void;
  onQtyChange: (index: number, qtyStr: string) => void;
  onRemove: (index: number) => void;
};

export default function OrderLineRow({
  products,
  item,
  index,
  onProductChange,
  onQtyChange,
  onRemove,
}: Props) {
  const qtyValue = !item.quantity ? "" : String(item.quantity);

  return (
    <div
      className="grid grid-cols-12 gap-3 items-center border-t border-gray-200 first:border-t-0 pt-3 sm:pt-0 sm:border-0 sm:grid-cols-[5fr_2fr_2fr_2fr_auto]"
      key={item.id}
    >
      {/* Product */}
      <select
        className={`${cls.input} col-span-12 sm:col-auto w-full min-w-0`}
        value={item.productId}
        onChange={(e) => onProductChange(index, Number(e.target.value))}
        aria-label={t("product")}
      >
        {products.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      {/* Qty */}
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        className={`${cls.input} col-span-3 sm:col-auto w-full min-w-0 text-center`}
        value={qtyValue}
        onChange={(e) => onQtyChange(index, e.target.value)}
        onBlur={(e) => onQtyChange(index, e.target.value)}
        aria-label={t("qty")}
      />

      {/* Desktop prices */}
      <div className="hidden sm:flex flex-col items-end">
        <div className="text-xs text-gray-500">{t("unit")}</div>
        <div className="font-medium">{money(item.unitPrice)}</div>
      </div>
      <div className="hidden sm:flex flex-col items-end">
        <div className="text-xs text-gray-500">{t("lineTotal")}</div>
        <div className="font-medium">
          {money(item.unitPrice * Number(item.quantity || 0))}
        </div>
      </div>

      {/* Mobile prices */}
      <div className="col-span-4 sm:hidden text-xs text-gray-600 flex flex-col justify-center">
        <span className="font-light">
          {t("unit")}:{" "}
          <strong className="text-gray-800">{money(item.unitPrice)}</strong>
        </span>
      </div>
      <div className="col-span-4 sm:hidden text-xs text-right text-gray-600 flex flex-col justify-center">
        <span className="font-light">
          {t("line")}:{" "}
          <strong className="text-gray-800">
            {money(item.unitPrice * Number(item.quantity || 0))}
          </strong>
        </span>
      </div>

      <div className="col-span-1 sm:col-auto flex justify-center h-full items-center">
        <button
          onClick={() => onRemove(index)}
          aria-label={t("removeLine")}
          className="text-xl text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 h-8 w-8"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
