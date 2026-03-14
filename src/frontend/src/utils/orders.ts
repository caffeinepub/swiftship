export interface OrderData {
  orderId: string;
  senderName: string;
  senderAddress: string;
  senderCity: string;
  senderState: string;
  senderZip: string;
  senderPhone: string;
  senderEmail: string;
  receiverName: string;
  receiverAddress: string;
  receiverCity: string;
  receiverState: string;
  receiverZip: string;
  receiverPhone: string;
  receiverEmail: string;
  weight: string;
  length: string;
  width: string;
  height: string;
  packageType: string;
  description: string;
  serviceType: string;
  insurance: boolean;
  status: string;
  createdAt: string;
  estimatedDelivery: string;
  price: number;
}

const KEY = "swiftship_orders";

export function getOrders(): OrderData[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function getOrder(orderId: string): OrderData | undefined {
  return getOrders().find((o) => o.orderId === orderId);
}

export function saveOrder(order: OrderData): void {
  const orders = getOrders();
  const idx = orders.findIndex((o) => o.orderId === order.orderId);
  if (idx >= 0) {
    orders[idx] = order;
  } else {
    orders.unshift(order);
  }
  localStorage.setItem(KEY, JSON.stringify(orders));
}

export function updateOrderStatus(orderId: string, status: string): void {
  const orders = getOrders();
  const idx = orders.findIndex((o) => o.orderId === orderId);
  if (idx >= 0) {
    orders[idx].status = status;
    localStorage.setItem(KEY, JSON.stringify(orders));
  }
}

export function generateOrderId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "SS-";
  for (let i = 0; i < 6; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

export function calculatePrice(
  weight: number,
  serviceType: string,
  insurance: boolean,
): number {
  const rates: Record<string, number> = {
    Standard: 5,
    Express: 10,
    Overnight: 20,
  };
  const rate = rates[serviceType] ?? 5;
  return weight * rate + (insurance ? 15 : 0);
}

export function getEstimatedDelivery(serviceType: string): string {
  const days: Record<string, number> = {
    Standard: 4,
    Express: 2,
    Overnight: 1,
  };
  const d = days[serviceType] ?? 4;
  const date = new Date();
  date.setDate(date.getDate() + d);
  return date.toISOString().split("T")[0];
}
