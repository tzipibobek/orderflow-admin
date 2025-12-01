"use client";
import IconButton from "@/modules/shared/ui/atoms/IconButton";
import { CheckCircle2, RotateCcw } from "lucide-react";
import { t } from "@/modules/shared/i18n";

export default function DeliverToggleButton({
  status,
  onToggle,
  titleDelivered = t("markPending"),
  titlePending = t("markDelivered"),
  disabled,
}: {
  status: "DELIVERED" | "TO_DELIVER" | "CANCELLED";
  onToggle: () => void;
  titleDelivered?: string;
  titlePending?: string;
  disabled?: boolean;
}) {
  const isDelivered = status === "DELIVERED";
  return (
    <IconButton
      aria-label={isDelivered ? titleDelivered : titlePending}
      title={isDelivered ? titleDelivered : titlePending}
      onClick={onToggle}
      disabled={disabled}
      aria-pressed={isDelivered}
      className={isDelivered ? "bg-green-50 border-green-200" : ""}
    >
      {isDelivered ? <RotateCcw className="w-4 h-4 text-slate-600" /> : <CheckCircle2 className="w-4 h-4 text-green-600" />}
    </IconButton>
  );
}
