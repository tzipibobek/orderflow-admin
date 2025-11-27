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

const actionBtn =
  `${cls.btn} ${cls.btnGhost} h-9 min-w-[112px] sm:min-w-[120px] px-3 justify-center whitespace-nowrap`;

const statusPill =
  "inline-flex items-center justify-center h-5 min-w-[72px] px-2 rounded text-[11px] font-medium leading-[20px]";

export default function ProductsTable({ rows, onToggleActive, onEdit }: Props) {
  return (
    <div className="hidden lg:block">
      <div className="overflow-x-auto">
        <table
          className={`w-full ${cls.card} table-fixed text-sm
            [&_th]:py-2.5 [&_th]:px-4
            [&_td]:py-2.5 [&_td]:px-4
            divide-y divide-slate-200 bg-white`}
        >
          <colgroup>
            <col />
            <col className="w-[clamp(96px,20vw,140px)]" />
            <col className="w-[clamp(180px,28vw,260px)]" />
          </colgroup>

          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <th className="text-left font-semibold">{t("name")}</th>
              <th className="text-right font-semibold">{t("price")}</th>
              <th className="text-right font-semibold">{t("actions")}</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((p) => (
              <tr
                key={p.id}
                className={`hover:bg-slate-50 ${!p.isActive ? "opacity-70" : ""
                  }`}
              >
                <td className="truncate select-none">
                  <div className="flex items-center gap-2">
                    <NameLink href={`/products/${p.id}`} label={p.name} />
                    <span
                      className={`${statusPill} ${p.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-200 text-slate-700"
                        }`}
                    >
                      {p.isActive ? t("active") : t("inactive")}
                    </span>
                  </div>
                </td>

                <td className="text-right tabular-nums">{money(p.price)}</td>

                <td className="text-right">
                  <div className="inline-flex items-center justify-end gap-2 w-full min-w-[180px] sm:min-w-[200px]">
                    <button
                      onClick={() => onToggleActive(p)}
                      className={`${actionBtn} hidden sm:inline-flex`}
                    >
                      {p.isActive ? (
                        <>
                          <ToggleRight className="mr-2 h-5 w-5" />
                          {t("deactivate")}
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="mr-2 h-5 w-5" />
                          {t("activate")}
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => onToggleActive(p)}
                      className="sm:hidden sr-only"
                    >
                      toggle
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
                </td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td className="py-8 text-center text-slate-500" colSpan={3}>
                  {t("noProducts")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
