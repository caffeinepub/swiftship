export interface OrderData {
  orderId: string; // SS-XXXXXX local format
  backendId?: string; // string representation of backend bigint id
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
  paymentConfirmed: boolean;
  deliveryLocation?: string;
}

export interface NotificationLogEntry {
  orderId: string;
  oldStatus: string;
  newStatus: string;
  timestamp: string;
}

const KEY = "swiftship_orders";
const NOTIF_KEY = "swiftship_notifications";

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

export function saveOrder(
  order: Omit<OrderData, "paymentConfirmed" | "deliveryLocation"> &
    Partial<
      Pick<OrderData, "paymentConfirmed" | "deliveryLocation" | "backendId">
    >,
): void {
  const orders = getOrders();
  const toSave: OrderData = { paymentConfirmed: false, ...order };
  const idx = orders.findIndex((o) => o.orderId === toSave.orderId);
  if (idx >= 0) {
    orders[idx] = toSave;
  } else {
    orders.unshift(toSave);
  }
  localStorage.setItem(KEY, JSON.stringify(orders));
}

export function getNotificationLog(): NotificationLogEntry[] {
  try {
    return JSON.parse(localStorage.getItem(NOTIF_KEY) || "[]");
  } catch {
    return [];
  }
}

function addNotificationLog(entry: NotificationLogEntry): void {
  const log = getNotificationLog();
  log.unshift(entry);
  localStorage.setItem(NOTIF_KEY, JSON.stringify(log.slice(0, 100)));
}

export function updateOrderStatus(orderId: string, status: string): void {
  const orders = getOrders();
  const idx = orders.findIndex((o) => o.orderId === orderId);
  if (idx >= 0) {
    const oldStatus = orders[idx].status;
    orders[idx].status = status;
    localStorage.setItem(KEY, JSON.stringify(orders));
    addNotificationLog({
      orderId,
      oldStatus,
      newStatus: status,
      timestamp: new Date().toISOString(),
    });
  }
}

export function updateOrderFull(
  orderId: string,
  updates: Partial<OrderData>,
): void {
  const orders = getOrders();
  const idx = orders.findIndex((o) => o.orderId === orderId);
  if (idx >= 0) {
    orders[idx] = { ...orders[idx], ...updates };
    localStorage.setItem(KEY, JSON.stringify(orders));
  }
}

export function confirmPayment(orderId: string): void {
  updateOrderFull(orderId, { paymentConfirmed: true });
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
