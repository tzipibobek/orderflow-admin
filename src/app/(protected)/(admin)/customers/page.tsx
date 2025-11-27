"use client";

import { useEffect, useState } from "react";

import { api, cls } from "@/modules/shared/lib/api";
import { t } from "@/modules/shared/i18n";

import { useToast } from "@/modules/shared/ui/Toast";
import Modal from "@/modules/shared/ui/Modal";
import NameLink from "@/modules/shared/ui/atoms/NameLink";
import PageHeader from "@/modules/shared/ui/PageHeader";
import RowActions from "@/modules/shared/ui/tables/RowActions";

import { Balance } from "@/modules/customers/components/Balance";
import CustomerForm from "@/modules/customers/components/CustomerForm";

type CustomerRow = { id: number; name: string; address: string; accountBalance: string };

export default function CustomersPage() {
  const [rows, setRows] = useState<CustomerRow[]>([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [editRow, setEditRow] = useState<CustomerRow | null>(null);
  const { success, error } = useToast();

  const reload = () => api<CustomerRow[]>("/api/customers").then(setRows);
  useEffect(() => { reload(); }, []);

  const onCreate = async (p: { name: string; address: string; nextBalance: number }) => {
    try {
      await api("/api/customers", {
        method: "POST",
        body: JSON.stringify({ name: p.name, address: p.address, accountBalance: p.nextBalance }),
      });
      success(t("customerCreated")); setOpenCreate(false); reload();
    } catch { error(t("failedCreateCustomer")); }
  };

  const onEdit = async (p: { name: string; address: string; nextBalance: number }) => {
    if (!editRow) return;
    try {
      await api(`/api/customers/${editRow.id}`, {
        method: "PUT",
        body: JSON.stringify({ name: p.name, address: p.address, accountBalance: p.nextBalance }),
      });
      success(t("customerUpdated")); setEditRow(null); reload();
    } catch { error(t("failedUpdateCustomer")); }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title={t("customers")}
        add={{ as: "button", onClick: () => setOpenCreate(true), label: t("newCustomer") }}
      />

      {/* MOBILE — cards */}
      <ul className="md:hidden space-y-2">
        {rows.length === 0 && <li className={`${cls.card} p-4 text-center text-slate-500`}>{t("noCustomers")}</li>}
        {rows.map(c => {
          return (
            <li key={c.id} className={`${cls.card} p-3`}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <NameLink href={`/customers/${c.id}`} label={c.name} />
                  <div className="text-xs text-slate-500 truncate">{c.address}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500 leading-4">{t("balance")}</div>
                  <Balance value={c.accountBalance} />
                  <div className="mt-2 flex justify-end">
                    <RowActions actions={[{ type: "edit", onClick: () => setEditRow(c) }]} />
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* DESKTOP — table */}
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <table
            className={`w-full ${cls.card} table-fixed text-sm [&_th]:py-2.5 [&_th]:px-4 [&_td]:py-2.5 [&_td]:px-4 divide-y divide-slate-200`}
          >
            <colgroup>
              <col className="w-[26%]" />
              <col className="w-[42%]" />
              <col className="w-[14%]" />
              <col className="w-[18%]" />
            </colgroup>
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="text-left font-semibold">{t("name")}</th>
                <th className="text-left font-semibold">{t("address")}</th>
                <th className="text-right font-semibold">{t("balance")}</th>
                <th className="text-right font-semibold">{t("actions")}</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {rows.map(c => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="truncate select-none">
                    <NameLink href={`/customers/${c.id}`} label={c.name} />
                  </td>
                  <td className="whitespace-nowrap overflow-hidden text-ellipsis">{c.address}</td>
                  <td className="text-right tabular-nums">
                    <Balance value={c.accountBalance} />
                  </td>
                  <td className="text-right">
                    <RowActions actions={[{ type: "edit", onClick: () => setEditRow(c) }]} />
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td className="py-8 text-center text-slate-500" colSpan={4}>{t("noCustomers")}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modales */}
      <Modal open={openCreate} onClose={() => setOpenCreate(false)} title={t("newCustomerTitle")} size="md">
        <CustomerForm mode="create" onSubmit={onCreate} onCancel={() => setOpenCreate(false)} />
      </Modal>
      <Modal open={!!editRow} onClose={() => setEditRow(null)} title={t("editCustomerTitle")} size="md">
        {editRow && (
          <CustomerForm
            mode="edit"
            initial={{ id: editRow.id, name: editRow.name, address: editRow.address, accountBalance: editRow.accountBalance }}
            onSubmit={onEdit}
            onCancel={() => setEditRow(null)}
          />
        )}
      </Modal>
    </div>
  );
}
