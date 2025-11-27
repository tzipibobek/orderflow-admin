import React from "react";
import { t } from "../../i18n";

export type Column<T> = {
  header: string;
  align?: "left" | "right";
  className?: string;
  render: (row: T) => React.ReactNode;
};

type Props<T> = {
  rows: T[];
  getKey: (row: T) => React.Key;
  columns: Column<T>[];
  empty?: string;
  renderCard: (row: T) => React.ReactNode;
};

export default function ResponsiveTable<T>({
  rows,
  getKey,
  columns,
  empty = t("noData"),
  renderCard,
}: Props<T>) {
  const tx = (a?: "left" | "right") => (a === "right" ? "text-right" : "text-left");

  return (
    <>
      {/* Mobile — cards */}
      <ul className="md:hidden space-y-2">
        {rows.length === 0 && (
          <li className="rounded-lg bg-white shadow-sm border p-4 text-center text-slate-500">
            {empty}
          </li>
        )}
        {rows.map((r) => (
          <li key={getKey(r)} className="rounded-lg bg-white shadow-sm border">
            {renderCard(r)}
          </li>
        ))}
      </ul>

      {/* Desktop — table */}
      <div className="hidden md:block">
        <div className="rounded-lg bg-white shadow-sm border overflow-x-auto">
          <table className="w-full table-auto text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                {columns.map((c, i) => (
                  <th key={i} className={`font-semibold py-2.5 px-4 ${tx(c.align)} ${c.className ?? ""}`}>
                    {c.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {rows.length === 0 && (
                <tr>
                  <td className="py-6 px-4 text-center text-slate-500" colSpan={columns.length}>
                    {empty}
                  </td>
                </tr>
              )}
              {rows.map((r) => (
                <tr key={getKey(r)} className="hover:bg-slate-50">
                  {columns.map((c, i) => (
                    <td key={i} className={`py-2.5 px-4 ${tx(c.align)} ${c.className ?? ""}`}>
                      {c.render(r)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
