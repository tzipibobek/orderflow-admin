"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { OrderForm, type OrderItem } from "@/modules/orders/components";

import { api, cls } from "@/modules/shared/lib/api";
import { useToast } from "@/modules/shared/ui/Toast";
import { t } from "@/modules/shared/i18n";

export default function AddOrderPage() {
  const router = useRouter();
  const { success, error } = useToast();

  useEffect(() => {
    router.prefetch("/orders");
  }, [router]);

  const handleSubmit = async (data: { customerId: number; items: OrderItem[] }) => {
    try {
      await api("/api/orders", {
        method: "POST",
        body: JSON.stringify({
          customerId: data.customerId,
          items: data.items,
        }),
      });
      success(t("orderCreated"));
      router.push("/orders");
    } catch {
      error(t("failedUpdateOrderStatus"));
    }
  };

  return (
    <div className="space-y-6">
      <h1 className={cls.h1}>{t("newOrder").replace("+ ", "")}</h1>
      <OrderForm
        initialCustomerId=""
        initialItems={[]}
        statusBadge="TO_DELIVER"
        submitLabel={t("createOrder")}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/orders")}
      />
    </div>
  );
}
