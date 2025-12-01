"use client";

import { useEffect, useState } from "react";

import { api } from "@/modules/shared/lib/api";
import { t } from "@/modules/shared/i18n";

import { useToast } from "@/modules/shared/ui/Toast";
import PageHeader from "@/modules/shared/ui/PageHeader";

import { OrdersMobileList, OrdersDesktopTable } from "@/modules/orders/components";
import { useConfirm } from "@/modules/orders/hooks/useConfirm";

import type { Order } from "@/types";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { confirm, ConfirmDialog } = useConfirm();
  const { success, error } = useToast();

  useEffect(() => {
    api<Order[]>("/api/orders")
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  const toggleDelivered = async (order: Order) => {
    const nextStatus = order.status === "TO_DELIVER" ? "DELIVERED" : "TO_DELIVER";
    const snapshot = orders;
    setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: nextStatus } : o)));

    try {
      const updated = await api<Order>(`/api/orders/${order.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: nextStatus }),
      });
      setOrders((prev) => prev.map((o) => (o.id === order.id ? updated : o)));
      success(nextStatus === "DELIVERED" ? t("orderDelivered") : t("orderBackToPending"));
    } catch {
      setOrders(snapshot);
      error(t("failedUpdateOrderStatus"));
    }
  };

  const cancelOrder = async (order: Order) => {
    if (!(await confirm(t("confirmCancelOrder")))) return;
    const snapshot = orders;
    setOrders((prev) => prev.filter((o) => o.id !== order.id));
    try {
      await api(`/api/orders/${order.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: "CANCELLED" }),
      });
      success(t("orderCancelled"));
    } catch {
      setOrders(snapshot);
      error(t("failedCancelOrder"));
    }
  };

  if (loading) return <div className="mx-auto max-w-7xl px-4 py-6">{t("loading")}</div>;

  return (
    <section className="space-y-6">
      <PageHeader title={t("orders")} add={{ as: "link", href: "/orders/add", label: t("newOrder") }} />

      <OrdersMobileList
        orders={orders}
        onToggleDelivered={toggleDelivered}
        onCancel={cancelOrder}
      />

      <OrdersDesktopTable
        orders={orders}
        onToggleDelivered={toggleDelivered}
        onCancel={cancelOrder}
      />

      {ConfirmDialog}
    </section>
  );
}
