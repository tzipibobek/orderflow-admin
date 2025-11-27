import { cls } from "@/modules/shared/lib/api";
import RowActions from "@/modules/shared/ui/tables/RowActions";
import NameLink from "@/modules/shared/ui/atoms/NameLink";
import { money } from "@/modules/shared/lib/format";
import { ToggleLeft, ToggleRight } from "lucide-react";
import { t } from "@/modules/shared/i18n";
import type { ProductRow } from "@/modules/products/types";

type Props = {
    rows: ProductRow[];
    onToggleActive: (p: ProductRow) => void;
    onEdit: (p: ProductRow) => void;
};

const actionIconBtn =
    `${cls.btn} ${cls.btnGhost} h-10 w-10 inline-flex items-center justify-center`;

export default function ProductsCards({ rows, onToggleActive, onEdit }: Props) {
    return (
        <ul className="lg:hidden space-y-2">
            {rows.length === 0 && (
                <li className={`${cls.card} p-4 text-center text-slate-500`}>
                    {t("noProducts")}
                </li>
            )}

            {rows.map((p) => (
                <li key={p.id} className={`${cls.card} p-3`}>
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <NameLink href={`/products/${p.id}`} label={p.name} />
                            </div>
                            <div className="mt-1 text-sm text-slate-600 tabular-nums">
                                {money(p.price)}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => onToggleActive(p)}
                                className={actionIconBtn}
                                aria-label={p.isActive ? t("deactivate") : t("activate")}
                                title={p.isActive ? t("deactivate") : t("activate")}
                            >
                                {p.isActive ? (
                                    <div className="p-1 text-green-600">
                                        <ToggleRight className="h-5 w-5" />
                                    </div>
                                ) : (
                                    <div className="p-1 text-slate-400">
                                        <ToggleLeft className="h-5 w-5" />
                                    </div>
                                )}
                            </button>

                            <RowActions
                                actions={[
                                    {
                                        type: "edit",
                                        onClick: () => onEdit(p),
                                    },
                                ]}
                            />
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
}
