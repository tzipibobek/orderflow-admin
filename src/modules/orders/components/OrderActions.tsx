"use client";
import RowActions from "@/modules/shared/ui/tables/RowActions";
import { DeliverToggleButton } from "./";
import { t } from "@/modules/shared/i18n";

export default function OrderActions({
    status,
    onToggleDelivered,
    onEdit,
    onCancel,
    confirmCancel = t("confirmCancelOrder"),
}: {
    status: "DELIVERED" | "TO_DELIVER" | "CANCELLED";
    onToggleDelivered: () => void;
    onEdit: () => void;
    onCancel: () => void;
    confirmCancel?: string;
}) {
    return (
        <div className="inline-flex gap-2">
            <DeliverToggleButton status={status} onToggle={onToggleDelivered} />
            <RowActions
                actions={[
                    { type: "edit", onClick: onEdit },
                    { type: "cancel", onClick: onCancel, confirmText: confirmCancel },
                ]}
            />
        </div>
    );
}
