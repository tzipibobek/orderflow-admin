"use client";
import { useState } from "react";
import { cls } from "@/modules/shared/lib/api";
import { t } from "@/modules/shared/i18n";

export type Product = { id?: number; name: string; price: number | string };

type Props = {
  mode: "create" | "edit";
  initial?: Product;
  onSubmit: (payload: { name: string; price: number }) => Promise<void> | void;
  onCancel: () => void;
};

export default function ProductForm({ mode, initial, onSubmit, onCancel }: Props) {
  const [name, setName] = useState(initial?.name ?? "");
  const [price, setPrice] = useState<string>(initial?.price?.toString() ?? "");

  const submit = async () => {
    await onSubmit({ name, price: Number(price || 0) });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm mb-1">{t("name")}</label>
        <input className={`${cls.input} w-full`} value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div>
        <label className="block text-sm mb-1">{t("price")}</label>
        <input
          type="number"
          className={`${cls.input} w-full`}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button onClick={onCancel} className={`${cls.btn} ${cls.btnGhost} w-28`}>{t("cancel")}</button>
        <button onClick={submit} className={`${cls.btn} ${cls.btnPrimary} w-32`}>
          {mode === "create" ? t("save") : t("saveChanges")}
        </button>
      </div>
    </div>
  );
}
