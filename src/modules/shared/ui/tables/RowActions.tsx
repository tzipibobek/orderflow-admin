"use client";
import IconButton from "@/modules/shared/ui/atoms/IconButton";
import { Pencil, Trash2 } from "lucide-react";
import { t } from "@/modules/shared/i18n";

export type RowAction =
  | { type: "edit"; onClick: () => void; title?: string; disabled?: boolean }
  | { type: "cancel"; onClick: () => void; title?: string; confirmText?: string; disabled?: boolean };

export default function RowActions({ actions }: { actions: RowAction[] }) {
  const onCancel = (a: Extract<RowAction, { type: "cancel" }>) => {
    if (a.disabled) return;
    a.onClick();
  };

  return (
    <div className="inline-flex gap-2">
      {actions.map((a, i) =>
        a.type === "edit" ? (
          <IconButton key={i} aria-label={a.title ?? t("edit")} title={a.title ?? t("edit")} onClick={a.onClick} disabled={a.disabled}>
            <Pencil className="w-4 h-4" />
          </IconButton>
        ) : (
          <IconButton
            key={i}
            aria-label={a.title ?? t("cancel")}
            title={a.title ?? t("cancel")}
            onClick={() => onCancel(a)}
            disabled={a.disabled}
            className="hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </IconButton>
        )
      )}
    </div>
  );
}
