"use client";

import { useState } from "react";
import { cls, toNumber } from "@/modules/shared/lib/api";
import { money } from "@/modules/shared/lib/format";
import { t } from "@/modules/shared/i18n";

export type Customer = { id?: number; name: string; address: string; accountBalance?: string | number };

type Props = {
  mode: "create" | "edit";
  initial?: Customer;
  onSubmit: (payload: { name: string; address: string; nextBalance: number }) => Promise<void> | void;
  onCancel: () => void;
};

export default function CustomerForm({ mode, initial, onSubmit, onCancel }: Props) {
  const [name, setName] = useState(initial?.name ?? "");
  const [address, setAddress] = useState(initial?.address ?? "");

  const current = toNumber(initial?.accountBalance ?? 0);
  const [payment, setPayment] = useState<string>("");

  const submit = async () => {
    const nextBalance =
      mode === "create" ? 0 : current - (payment === "" ? 0 : Number(payment));
    await onSubmit({ name, address, nextBalance });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm mb-1">{t("name")}</label>
        <input className={`${cls.input} w-full`} value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div>
        <label className="block text-sm mb-1">{t("address")}</label>
        <input className={`${cls.input} w-full`} value={address} onChange={(e) => setAddress(e.target.value)} />
      </div>

      {mode === "edit" && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-600 mb-1">{t("currentDebt")}</div>
            <div className="font-semibold">{money(current)}</div>
          </div>
          <div>
            <label className="block text-sm mb-1">{t("payment")}</label>
            <input
              type="number"
              min={0}
              placeholder={t("amountPaid")}
              className={`${cls.input} w-full text-right`}
              value={payment}
              onChange={(e) => setPayment(e.target.value)}
            />
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <button onClick={onCancel} className={`${cls.btn} ${cls.btnGhost} w-28`}>{t("cancel")}</button>
        <button onClick={submit} className={`${cls.btn} ${cls.btnPrimary} w-32`}>
          {mode === "create" ? t("save") : t("saveChanges")}
        </button>
      </div>
    </div>
  );
}
