// In-memory orders store (simulates database)

import { Order } from "../types/Order";

// In a real app this would be persisted to a backend
export const ordersList: Order[] = [
  {
    id: "ORD-001",
    userId: "u1",
    customerName: "João Silva",
    customerEmail: "joao@email.com",
    customerPhone: "(11) 99999-0001",
    address: "Rua das Flores, 123 - São Paulo, SP",
    items: [
      { productId: "h1", name: "Classic Smash", price: 32.9, quantity: 2 },
      { productId: "b1", name: "Refrigerante Lata", price: 7.9, quantity: 2 },
    ],
    subtotal: 81.6,
    deliveryFee: 5.0,
    total: 86.6,
    payment: { method: "credit_card", status: "approved" },
    status: "delivered",
    statusHistory: [
      { status: "pending", time: "18:05", label: "Pedido realizado" },
      { status: "production", time: "18:08", label: "Em produção" },
      { status: "sent", time: "18:35", label: "Saiu para entrega" },
      { status: "delivered", time: "18:58", label: "Entregue" },
    ],
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    estimatedTime: "30-45 min",
    notes: "",
  },
  {
    id: "ORD-002",
    userId: "u2",
    customerName: "Maria Souza",
    customerEmail: "maria@email.com",
    customerPhone: "(11) 99999-0002",
    address: "Av. Paulista, 456 - São Paulo, SP",
    items: [
      { productId: "p1", name: "Pepperoni Supreme", price: 54.9, quantity: 1 },
      { productId: "b2", name: "Milkshake Premium", price: 22.9, quantity: 1 },
    ],
    subtotal: 77.8,
    deliveryFee: 5.0,
    total: 82.8,
    payment: { method: "pix", status: "approved" },
    status: "production",
    statusHistory: [
      { status: "pending", time: "19:10", label: "Pedido realizado" },
      { status: "production", time: "19:12", label: "Em produção" },
    ],
    createdAt: new Date(Date.now() - 600000).toISOString(),
    estimatedTime: "30-45 min",
    notes: "Sem cebola na pizza.",
  },
];

export const ORDER_STATUSES = {
  pending: {
    label: "Pedido Recebido",
    color: "yellow",
    icon: "📋",
    next: "production",
  },
  production: { label: "Em Produção", color: "blue", icon: "👨‍🍳", next: "sent" },
  sent: {
    label: "Saiu para Entrega",
    color: "orange",
    icon: "🛵",
    next: "delivered",
  },
  delivered: { label: "Entregue", color: "green", icon: "✅", next: null },
};

let orderCounter = 3;

export function createOrder(orderData: Omit<Order, "id" | "status" | "statusHistory" | "createdAt" | "estimatedTime">) {
  const id = `ORD-${String(orderCounter++).padStart(3, "0")}`;
  const now = new Date();
  const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
  const newOrder: Order = {
    ...orderData,
    id,
    status: "pending",
    statusHistory: [
      { status: "pending", time: timeStr, label: "Pedido realizado" },
    ],
    createdAt: now.toISOString(),
    estimatedTime: "30-45 min",
  };
  ordersList.push(newOrder);
  return newOrder;
}

export function updateOrderStatus(orderId: string, newStatus: keyof typeof ORDER_STATUSES) {
  const order = ordersList.find((o) => o.id === orderId);
  if (!order) return null;
  const now = new Date();
  const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
  order.status = newStatus;
  order.statusHistory.push({
    status: newStatus,
    time: timeStr,
    label: ORDER_STATUSES[newStatus].label,
  });
  return order;
}

export function getOrdersByUser(userId: string) {
  return ordersList
    .filter((o) => o.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getAllOrders() {
  return [...ordersList].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}
