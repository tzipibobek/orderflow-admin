"use client";

import { useEffect, useState } from "react";
import { api, toNumber } from "@/modules/shared/lib/api";
import Modal from "@/modules/shared/ui/Modal";
import ProductForm from "@/modules/products/components/ProductForm";
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "@/modules/shared/ui/Toast";
import PageHeader from "@/modules/shared/ui/PageHeader";
import { t } from "@/modules/shared/i18n";

import type { ProductRow } from "@/modules/products/types";
import ProductsCards from "@/modules/products/components/ProductsCards";
import ProductsTable from "@/modules/products/components/ProductsTable";

export default function ProductsPage() {
  const [rows, setRows] = useState<ProductRow[]>([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [editRow, setEditRow] = useState<ProductRow | null>(null);
  const [showInactive, setShowInactive] = useState(false);
  const { success, error } = useToast();

  const reload = () =>
    api<ProductRow[]>(`/api/products${showInactive ? "?includeInactive=1" : ""}`)
      .then(setRows);

  useEffect(() => {
    reload();
  }, [showInactive]);

  const onCreate = async (p: { name: string; price: number }) => {
    try {
      await api("/api/products", {
        method: "POST",
        body: JSON.stringify(p),
      });
      success(t("productCreated"));
      setOpenCreate(false);
      reload();
    } catch {
      error(t("failedCreateProduct"));
    }
  };

  const onEdit = async (p: { name: string; price: number }) => {
    if (!editRow) return;
    try {
      await api(`/api/products/${editRow.id}`, {
        method: "PUT",
        body: JSON.stringify(p),
      });
      success(t("productUpdated"));
      setEditRow(null);
      reload();
    } catch {
      error(t("failedUpdateProduct"));
    }
  };

  const toggleActive = async (p: ProductRow) => {
    const nextIsActive = !p.isActive;
    const snapshot = rows.slice();

    setRows((xs) => {
      const updated = xs.map((x) =>
        x.id === p.id ? { ...x, isActive: nextIsActive } : x
      );
      return !showInactive && !nextIsActive
        ? updated.filter((x) => x.id !== p.id)
        : updated;
    });

    try {
      await api(`/api/products/${p.id}`, {
        method: "PATCH",
        body: JSON.stringify({ isActive: nextIsActive }),
      });
      success(nextIsActive ? t("productActivated") : t("productDeactivated"));
    } catch {
      setRows(snapshot);
      error(t("failedToggleProduct"));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("products")}
        inline={
          <button
            onClick={() => setShowInactive((x) => !x)}
            className="inline-flex items-center gap-2 text-sm text-slate-700 hover:text-slate-900"
            aria-pressed={showInactive}
            title={showInactive ? t("hideInactive") : t("showInactive")}
          >
            {showInactive ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
            <span className="hidden sm:inline">
              {showInactive ? t("hideInactive") : t("showInactive")}
            </span>
          </button>
        }
        add={{
          as: "button",
          onClick: () => setOpenCreate(true),
          label: t("newProduct"),
        }}
      />

      {/* MOBILE + TABLET */}
      <ProductsCards
        rows={rows}
        onToggleActive={toggleActive}
        onEdit={(row) => setEditRow(row)}
      />

      {/* DESKTOP TABLE */}
      <ProductsTable
        rows={rows}
        onToggleActive={toggleActive}
        onEdit={(row) => setEditRow(row)}
      />

      {/* MODALES */}
      <Modal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        title={t("newProductTitle")}
        size="sm"
      >
        <ProductForm
          mode="create"
          onSubmit={onCreate}
          onCancel={() => setOpenCreate(false)}
        />
      </Modal>

      <Modal
        open={!!editRow}
        onClose={() => setEditRow(null)}
        title={t("editProductTitle")}
        size="sm"
      >
        {editRow && (
          <ProductForm
            mode="edit"
            initial={{
              id: editRow.id,
              name: editRow.name,
              price: toNumber(editRow.price),
            }}
            onSubmit={onEdit}
            onCancel={() => setEditRow(null)}
          />
        )}
      </Modal>
    </div>
  );
}
