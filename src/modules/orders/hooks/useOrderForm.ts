"use client";

import { useCallback, useEffect, useMemo, useReducer } from "react";
import { api, toNumber } from "@/modules/shared/lib/api";
import { t } from "@/modules/shared/i18n";

export type Product = { id: number; name: string; price: string };
export type Customer = { id: number; name: string };

export type OrderItem = { productId: number; quantity: number; unitPrice: number };

export type LineItem = OrderItem & { id: string };

type State = {
  products: Product[];
  customers: Customer[];
  customerId: number | "";
  items: LineItem[];
  saving: boolean;
  loading: boolean;
  error?: string;
};

type Args = {
  initialCustomerId?: number | "";
  initialItems?: OrderItem[];
  onSubmit: (data: { customerId: number; items: OrderItem[] }) => Promise<void> | void;
};

function clampQty(n: number) {
  const q = Number.isFinite(n) ? Math.floor(n) : 1;
  return Math.max(1, q);
}

const digitsOnly = /^\d+$/;

const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

export function useOrderForm({
  initialCustomerId = "",
  initialItems = [],
  onSubmit,
}: Args) {
  const [state, dispatch] = useReducer(
    (s: State, a: Partial<State>) => ({ ...s, ...a }),
    {
      products: [],
      customers: [],
      customerId: initialCustomerId,
      items: initialItems.map((it) => ({ ...it, id: newId() })),
      saving: false,
      loading: true,
      error: undefined,
    }
  );

  const { products, customers, customerId, items, saving, loading, error } = state;

  const pMap = useMemo(() => new Map(products.map((p) => [p.id, p])), [products]);
  const total = useMemo(
    () => items.reduce((s, it) => s + it.unitPrice * it.quantity, 0),
    [items]
  );

  useEffect(() => {
    let mounted = true;
    Promise.all([api<Product[]>("/api/products"), api<Customer[]>("/api/customers")])
      .then(([ps, cs]) => mounted && dispatch({ products: ps, customers: cs }))
      .catch(() => mounted && dispatch({ error: t("errorLoadingData") }))
      .finally(() => mounted && dispatch({ loading: false }));
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    dispatch({
      customerId: initialCustomerId ?? "",
      items: (initialItems ?? []).map((it) => ({ ...it, id: newId() })),
    });
  }, [initialCustomerId, initialItems]);

  const setCustomerId = useCallback(
    (v: number | "") => dispatch({ customerId: v }),
    []
  );

  const addLine = useCallback(() => {
    if (!products.length) return;
    const p = products[0];
    dispatch({
      items: [
        ...items,
        { id: newId(), productId: p.id, quantity: 1, unitPrice: toNumber(p.price) },
      ],
    });
  }, [items, products]);

  const patch = useCallback(
    (idx: number, patch: Partial<LineItem>) => {
      const next = items.map((it, i) => (i === idx ? { ...it, ...patch } : it));
      dispatch({ items: next });
    },
    [items]
  );

  const changeProduct = useCallback(
    (idx: number, productId: number) => {
      const p = pMap.get(productId);
      patch(idx, { productId, unitPrice: p ? toNumber(p.price) : 0 });
    },
    [patch, pMap]
  );

  const changeQty = useCallback(
    (idx: number, qtyStr: string) => {
      if (qtyStr === "") {
        patch(idx, { quantity: 0 });
        return;
      }

      if (!digitsOnly.test(qtyStr)) return;

      const qty = Number(qtyStr);
      patch(idx, { quantity: qty });
    },
    [patch]
  );

  const removeLine = useCallback(
    (idx: number) => dispatch({ items: items.filter((_, i) => i !== idx) }),
    [items]
  );

  const canSave =
    !!customerId &&
    items.length > 0 &&
    items.every((it) => it.productId && it.quantity >= 1) &&
    !saving &&
    !loading;

  const save = useCallback(async () => {
    if (!canSave) return;
    dispatch({ saving: true, error: undefined });
    try {
      const payload: { customerId: number; items: OrderItem[] } = {
        customerId: Number(customerId),
        items: items.map(({ productId, quantity, unitPrice }) => ({
          productId,
          quantity: clampQty(quantity),
          unitPrice,
        })),
      };
      await onSubmit(payload);
    } catch {
      dispatch({ error: t("couldNotSave") });
    } finally {
      dispatch({ saving: false });
    }
  }, [canSave, customerId, items, onSubmit]);

  return {
    products,
    customers,
    customerId,
    items,
    saving,
    loading,
    error,
    total,
    canSave,
    setCustomerId,
    addLine,
    changeProduct,
    changeQty,
    removeLine,
    save,
  };
}
