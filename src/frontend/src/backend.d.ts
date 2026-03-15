export interface Order {
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
  paymentConfirmed: boolean;
  deliveryLocation: string;
}

export interface Notification {
  id: bigint;
  orderId: string;
  message: string;
  timestamp: string;
  oldStatus: string;
  newStatus: string;
}

export interface ServiceRequest {
  id: bigint;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  timestamp: string;
}

export interface User {
  name: string;
  email: string;
  phone: string;
  registeredAt: string;
}

export interface backendInterface {
  createOrder(
    orderId: string,
    senderName: string,
    senderAddress: string,
    senderCity: string,
    senderState: string,
    senderZip: string,
    senderPhone: string,
    senderEmail: string,
    receiverName: string,
    receiverAddress: string,
    receiverCity: string,
    receiverState: string,
    receiverZip: string,
    receiverPhone: string,
    receiverEmail: string,
    weight: string,
    length: string,
    width: string,
    height: string,
    packageType: string,
    description: string,
    serviceType: string,
    insurance: boolean,
    createdAt: string,
    estimatedDelivery: string,
    price: number
  ): Promise<string>;
  getOrder(orderId: string): Promise<Order | null>;
  submitServiceRequest(name: string, email: string, phone: string, subject: string, message: string, timestamp: string): Promise<void>;
  getAllOrders(adminSecret: string): Promise<Order[]>;
  updateOrderStatus(adminSecret: string, orderId: string, newStatus: string, timestamp: string): Promise<void>;
  confirmPayment(adminSecret: string, orderId: string, timestamp: string): Promise<void>;
  updateOrderDetails(adminSecret: string, orderId: string, deliveryLocation: string, receiverAddress: string, receiverCity: string, receiverState: string, receiverZip: string): Promise<void>;
  getAllNotifications(adminSecret: string): Promise<Notification[]>;
  getAllServiceRequests(adminSecret: string): Promise<ServiceRequest[]>;
  getAllUsers(adminSecret: string): Promise<User[]>;
}
