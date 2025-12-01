"use client";
import { useState } from "react";
import Modal from "@/modules/shared/ui/Modal";
import { cls } from "@/modules/shared/lib/api";
import { t } from "@/modules/shared/i18n";

export function useConfirm() {
  const [state, setState] = useState<{ open: boolean; msg: string; resolve?: (v: boolean) => void }>({ open: false, msg: "" });

  const confirm = (msg: string) =>
    new Promise<boolean>((resolve) => setState({ open: true, msg, resolve }));

  const onClose = (v: boolean) => {
    state.resolve?.(v);
    setState({ open: false, msg: "" });
  };

  const ConfirmDialog = (
    <Modal open={state.open} onClose={() => onClose(false)} title={t("confirm")}>
      <p className="mb-4">{state.msg}</p>
      <div className="flex justify-end gap-2">
        <button className={`${cls.btn} ${cls.btnGhost}`} onClick={() => onClose(false)}>
          {t("cancel")}
        </button>
        <button className={`${cls.btn} ${cls.btnDanger}`} onClick={() => onClose(true)}>
          {t("confirm")}
        </button>
      </div>
    </Modal>
  );

  return { confirm, ConfirmDialog };
}
