export type Product = { id: number; name: string; price: string };

export type Customer = { id: number; name: string; address: string };

export type OrderItem = {
  id: number;
  productId: number;
  quantity: number;
  unitPrice: string;
  product?: Product;
};

export type Order = {
  id: number;
  customerId: number;
  customer?: Customer;
  items: OrderItem[];
  total: string;
  status: "DELIVERED" | "TO_DELIVER";
  createdAt: string;
};
