"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { OrderForm, type OrderItem } from "@/modules/orders/components";

import { api, cls, toNumber } from "@/modules/shared/lib/api";
import { t } from "@/modules/shared/i18n";
import { useToast } from "@/modules/shared/ui/Toast";

type Order = {
  id: number;
  customerId: number;
  status: "DELIVERED" | "TO_DELIVER";
  items: { productId: number; quantity: number; unitPrice: string }[];
};

export default function EditOrderPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { success, error } = useToast();

  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    api<Order>(`/api/orders/${id}`).then(setOrder).catch(() => error(t("orderNotFound")));
  }, [id]);

  if (!order) return <div>{t("loading")}</div>;

  const initialItems: OrderItem[] = order.items.map((it) => ({
    productId: it.productId,
    quantity: it.quantity,
    unitPrice: toNumber(it.unitPrice),
  }));

  const handleSubmit = async (data: { customerId: number; items: OrderItem[] }) => {
    try {
      await api(`/api/orders/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          customerId: data.customerId,
          status: order.status,
          items: data.items,
        }),
      });
      success(t("orderUpdated"));
      router.push("/orders");
    } catch {
      error(t("failedUpdateOrderStatus"));
    }
  };

  return (
    <div className="space-y-6">
      <h1 className={cls.h1}>
        {t("edit")} {t("order")} #{order.id}
      </h1>
      <OrderForm
        initialCustomerId={order.customerId}
        initialItems={initialItems}
        statusBadge={order.status}
        submitLabel={t("saveChanges")}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/orders")}
      />
    </div>
  );
}
