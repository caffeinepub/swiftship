import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  CheckCircle2,
  Clock,
  CreditCard,
  DollarSign,
  HeadphonesIcon,
  Loader2,
  Lock,
  Package2,
  RefreshCw,
  Truck,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useActor } from "../hooks/useActor";
import type { OrderData } from "../utils/orders";
import { updateOrderFull } from "../utils/orders";

// Real backend types (matching actual backend.ts generated file)
interface BackendOrder {
  orderId: bigint;
  senderName: string;
  senderAddress: string;
  senderCity: string;
  senderState: string;
  senderEmail: string;
  senderPhone: string;
  receiverName: string;
  receiverAddress: string;
  receiverCity: string;
  receiverState: string;
  receiverZip: string;
  receiverEmail: string;
  serviceType: string;
  status: string;
  price: number;
  paymentConfirmed: boolean;
  createdAt: bigint;
  description: string;
}

interface BackendNotification {
  id: bigint;
  orderId?: bigint;
  message: string;
  timestamp: bigint;
}

interface BackendServiceRequest {
  id: bigint;
  name: string;
  email: string;
  phone: string;
  message: string;
  timestamp: bigint;
}

interface BackendUser {
  name: string;
  email: string;
  phone: string;
}

const STATUS_COLORS: Record<string, string> = {
  Processing: "bg-yellow-100 text-yellow-700",
  "In Transit": "bg-orange-100 text-orange-700",
  "Out For Delivery": "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  Placed: "bg-blue-100 text-blue-700",
};

const STATUS_LABELS: Record<string, string> = {
  Processing: "Processing",
  "In Transit": "In Transit",
  "Out For Delivery": "Out For Delivery",
  Delivered: "Delivered",
  Placed: "Placed",
};

const ALL_STATUSES = [
  "Processing",
  "In Transit",
  "Out For Delivery",
  "Delivered",
];

const ADMIN_PASSWORD = "admin123";

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
        STATUS_COLORS[status] ?? "bg-gray-100 text-gray-600"
      }`}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

// Display row from backend Order
interface AdminOrder {
  backendId: bigint;
  senderName: string;
  senderCity: string;
  senderState: string;
  senderEmail: string;
  senderPhone: string;
  receiverName: string;
  receiverCity: string;
  receiverState: string;
  receiverEmail: string;
  receiverAddress: string;
  receiverZip: string;
  serviceType: string;
  status: string;
  price: number;
  paymentConfirmed: boolean;
  createdAt: bigint;
  description: string;
}

function toAdminOrder(o: BackendOrder): AdminOrder {
  return {
    backendId: o.orderId,
    senderName: o.senderName,
    senderCity: o.senderCity,
    senderState: o.senderState,
    senderEmail: o.senderEmail,
    senderPhone: o.senderPhone,
    receiverName: o.receiverName,
    receiverCity: o.receiverCity,
    receiverState: o.receiverState,
    receiverEmail: o.receiverEmail,
    receiverAddress: o.receiverAddress,
    receiverZip: o.receiverZip,
    serviceType: o.serviceType,
    status: o.status,
    price: o.price,
    paymentConfirmed: o.paymentConfirmed,
    createdAt: o.createdAt,
    description: o.description,
  };
}

function EditOrderDialog({
  order,
  open,
  onClose,
  onSave,
}: {
  order: OrderData;
  open: boolean;
  onClose: () => void;
  onSave: (updated: OrderData) => void;
}) {
  const [form, setForm] = useState<OrderData>(order);

  useEffect(() => {
    setForm(order);
  }, [order]);

  function set(field: keyof OrderData, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSave() {
    onSave(form);
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="max-w-2xl p-0 overflow-hidden"
        data-ocid="admin.edit.dialog"
      >
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="font-display text-xl">Edit Order</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          <div className="px-6 py-4 space-y-6">
            <section>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Receiver Information
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <Label htmlFor="edit-receiver-address">Address</Label>
                  <Input
                    id="edit-receiver-address"
                    value={form.receiverAddress}
                    onChange={(e) => set("receiverAddress", e.target.value)}
                    data-ocid="admin.edit.receiver_address.input"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-receiver-city">City</Label>
                  <Input
                    id="edit-receiver-city"
                    value={form.receiverCity}
                    onChange={(e) => set("receiverCity", e.target.value)}
                    data-ocid="admin.edit.receiver_city.input"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-receiver-state">State</Label>
                  <Input
                    id="edit-receiver-state"
                    value={form.receiverState}
                    onChange={(e) => set("receiverState", e.target.value)}
                    data-ocid="admin.edit.receiver_state.input"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-receiver-zip">ZIP</Label>
                  <Input
                    id="edit-receiver-zip"
                    value={form.receiverZip}
                    onChange={(e) => set("receiverZip", e.target.value)}
                    data-ocid="admin.edit.receiver_zip.input"
                  />
                </div>
              </div>
            </section>
            <section>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Status & Payment
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={form.status}
                    onValueChange={(v) => set("status", v)}
                  >
                    <SelectTrigger
                      id="edit-status"
                      data-ocid="admin.edit.status.select"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ALL_STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <Checkbox
                    id="edit-payment-confirmed"
                    checked={form.paymentConfirmed}
                    onCheckedChange={(v) => set("paymentConfirmed", v === true)}
                    data-ocid="admin.edit.payment_confirmed.checkbox"
                  />
                  <Label
                    htmlFor="edit-payment-confirmed"
                    className="cursor-pointer font-medium"
                  >
                    Payment Confirmed
                  </Label>
                </div>
              </div>
            </section>
          </div>
        </ScrollArea>
        <DialogFooter className="px-6 py-4 border-t border-border">
          <Button
            variant="outline"
            onClick={onClose}
            data-ocid="admin.edit.cancel_button"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-primary text-primary-foreground"
            data-ocid="admin.edit.save_button"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminPage() {
  const { actor: backend } = useActor();
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [pwError, setPwError] = useState("");
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [notifications, setNotifications] = useState<BackendNotification[]>([]);
  const [serviceRequests, setServiceRequests] = useState<
    BackendServiceRequest[]
  >([]);
  const [users, setUsers] = useState<BackendUser[]>([]);
  const [editOrderData, setEditOrderData] = useState<OrderData | null>(null);

  const refresh = useCallback(async () => {
    if (!backend) return;
    setLoading(true);
    try {
      const [allOrders, allNotifs, allRequests, allUsers] = await Promise.all([
        backend.getAllOrders() as Promise<BackendOrder[]>,
        backend.getAllNotifications() as Promise<BackendNotification[]>,
        backend.getServiceRequests() as Promise<BackendServiceRequest[]>,
        backend.getUsers() as Promise<BackendUser[]>,
      ] as const);
      setOrders((allOrders as BackendOrder[]).map(toAdminOrder));
      setNotifications(allNotifs as BackendNotification[]);
      setServiceRequests(allRequests as BackendServiceRequest[]);
      setUsers(allUsers as BackendUser[]);
    } catch {
      toast.error("Failed to load data from server.");
    } finally {
      setLoading(false);
    }
  }, [backend]);

  useEffect(() => {
    if (authed && backend) {
      refresh();
      const interval = setInterval(refresh, 15000);
      return () => clearInterval(interval);
    }
  }, [authed, backend, refresh]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
      setPwError("");
    } else {
      setPwError("Incorrect password. Please try again.");
    }
  }

  async function handleStatusChange(backendId: bigint, status: string) {
    try {
      if (backend) {
        await backend.updateOrderStatus(backendId, status);
        await refresh();
        toast.success(
          `\ud83d\udce6 Order updated to ${STATUS_LABELS[status] ?? status}`,
          { duration: 5000 },
        );
      }
    } catch {
      toast.error("Failed to update status.");
    }
  }

  async function handleConfirmPayment(backendId: bigint) {
    try {
      if (backend) {
        await backend.confirmPayment(backendId);
        await refresh();
        toast.success("\u2705 Payment confirmed");
      }
    } catch {
      toast.error("Failed to confirm payment.");
    }
  }

  async function handleSaveEdit(updated: OrderData) {
    if (!backend || !updated.backendId) {
      setEditOrderData(null);
      return;
    }
    // Update local cache
    updateOrderFull(updated.orderId, updated);
    const backendId = BigInt(updated.backendId);
    const oldOrder = orders.find((o) => o.backendId === backendId);

    try {
      // Update status if changed
      if (oldOrder && oldOrder.status !== updated.status) {
        await backend.updateOrderStatus(backendId, updated.status);
      }
      // Confirm payment if toggled
      if (updated.paymentConfirmed && oldOrder && !oldOrder.paymentConfirmed) {
        await backend.confirmPayment(backendId);
      }
      await refresh();
      toast.success("Order updated successfully");
    } catch {
      toast.error("Failed to save some changes.");
    }
    setEditOrderData(null);
  }

  function openEdit(order: AdminOrder) {
    // Build a minimal OrderData for the edit dialog
    const od: OrderData = {
      orderId: order.backendId.toString(),
      backendId: order.backendId.toString(),
      senderName: order.senderName,
      senderAddress: "",
      senderCity: order.senderCity,
      senderState: order.senderState,
      senderZip: "",
      senderPhone: order.senderPhone,
      senderEmail: order.senderEmail,
      receiverName: order.receiverName,
      receiverAddress: order.receiverAddress,
      receiverCity: order.receiverCity,
      receiverState: order.receiverState,
      receiverZip: order.receiverZip,
      receiverPhone: "",
      receiverEmail: order.receiverEmail,
      weight: "0",
      length: "0",
      width: "0",
      height: "0",
      packageType: "",
      description: order.description,
      serviceType: order.serviceType,
      insurance: false,
      status: order.status,
      createdAt: new Date(Number(order.createdAt) / 1_000_000).toISOString(),
      estimatedDelivery: "",
      price: order.price,
      paymentConfirmed: order.paymentConfirmed,
    };
    setEditOrderData(od);
  }

  const stats = {
    total: orders.length,
    delivered: orders.filter((o) => o.status === "Delivered").length,
    inTransit: orders.filter(
      (o) => o.status === "In Transit" || o.status === "Out For Delivery",
    ).length,
    processing: orders.filter((o) => o.status === "Processing").length,
    pendingPayments: orders.filter((o) => !o.paymentConfirmed).length,
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-sm"
          >
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-7 h-7 text-primary" />
              </div>
              <h1 className="font-display text-2xl font-bold text-foreground">
                Admin Panel
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Staff access only
              </p>
            </div>
            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="admin-pw">Password</Label>
                    <Input
                      id="admin-pw"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter admin password"
                      className="mt-1"
                      data-ocid="admin.password.input"
                    />
                    {pwError && (
                      <p
                        className="text-destructive text-sm mt-1"
                        data-ocid="admin.password.error_state"
                      >
                        {pwError}
                      </p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground"
                    data-ocid="admin.login.submit_button"
                  >
                    Sign In
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              SwiftShip Operations Center
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refresh}
            disabled={loading}
            data-ocid="admin.refresh.button"
          >
            {loading ? (
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 w-4 h-4" />
            )}
            {loading ? "Loading..." : "Refresh"}
          </Button>
        </div>

        <Tabs defaultValue="dashboard">
          <TabsList className="mb-6 flex-wrap h-auto gap-1">
            <TabsTrigger value="dashboard" data-ocid="admin.dashboard.tab">
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="orders" data-ocid="admin.orders.tab">
              Orders
            </TabsTrigger>
            <TabsTrigger value="payments" data-ocid="admin.payments.tab">
              Payments
            </TabsTrigger>
            <TabsTrigger value="users" data-ocid="admin.users.tab">
              Users
            </TabsTrigger>
            <TabsTrigger value="tracking" data-ocid="admin.tracking.tab">
              Tracking Control
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              data-ocid="admin.notifications.tab"
            >
              Notifications
            </TabsTrigger>
            <TabsTrigger value="service" data-ocid="admin.service.tab">
              Service Requests
            </TabsTrigger>
          </TabsList>

          {/* ── DASHBOARD ── */}
          <TabsContent value="dashboard">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
              {[
                {
                  label: "Total Orders",
                  value: stats.total,
                  icon: Package2,
                  color: "text-primary",
                  bg: "bg-primary/10",
                },
                {
                  label: "Delivered",
                  value: stats.delivered,
                  icon: CheckCircle2,
                  color: "text-green-600",
                  bg: "bg-green-50",
                },
                {
                  label: "In Transit",
                  value: stats.inTransit,
                  icon: Truck,
                  color: "text-orange-500",
                  bg: "bg-orange-50",
                },
                {
                  label: "Processing",
                  value: stats.processing,
                  icon: Clock,
                  color: "text-yellow-600",
                  bg: "bg-yellow-50",
                },
                {
                  label: "Pending Payments",
                  value: stats.pendingPayments,
                  icon: CreditCard,
                  color: "text-red-500",
                  bg: "bg-red-50",
                },
              ].map((s) => (
                <Card key={s.label}>
                  <CardContent className="pt-5 flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center flex-shrink-0`}
                    >
                      <s.icon className={`w-5 h-5 ${s.color}`} />
                    </div>
                    <div>
                      <div className="font-display text-2xl font-bold leading-none">
                        {s.value}
                      </div>
                      <div className="text-muted-foreground text-xs mt-0.5">
                        {s.label}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="pt-5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-display text-2xl font-bold leading-none">
                      {users.length}
                    </div>
                    <div className="text-muted-foreground text-xs mt-0.5">
                      Registered Users
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                    <Bell className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-display text-2xl font-bold leading-none">
                      {notifications.length}
                    </div>
                    <div className="text-muted-foreground text-xs mt-0.5">
                      Notifications
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0">
                    <HeadphonesIcon className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <div className="font-display text-2xl font-bold leading-none">
                      {serviceRequests.length}
                    </div>
                    <div className="text-muted-foreground text-xs mt-0.5">
                      Service Requests
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="font-display text-lg">
                  Recent Orders
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {orders.length === 0 ? (
                  <div
                    className="text-center py-12 text-muted-foreground"
                    data-ocid="admin.dashboard.empty_state"
                  >
                    <Package2 className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p>No orders yet.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Sender</TableHead>
                          <TableHead>Receiver</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Payment</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.slice(0, 5).map((order, i) => (
                          <TableRow
                            key={order.backendId.toString()}
                            data-ocid={`admin.dashboard.row.${i + 1}`}
                          >
                            <TableCell className="font-mono font-semibold text-primary text-xs">
                              #{order.backendId.toString()}
                            </TableCell>
                            <TableCell className="text-sm">
                              {order.senderName}
                            </TableCell>
                            <TableCell className="text-sm">
                              {order.receiverName}
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={order.status} />
                            </TableCell>
                            <TableCell>
                              {order.paymentConfirmed ? (
                                <span className="text-green-600 text-xs font-medium">
                                  Confirmed
                                </span>
                              ) : (
                                <span className="text-yellow-600 text-xs font-medium">
                                  Pending
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-muted-foreground text-xs">
                              {new Date(
                                Number(order.createdAt) / 1_000_000,
                              ).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── ORDERS ── */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-lg">
                  Order Management
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {orders.length === 0 ? (
                  <div
                    className="text-center py-12 text-muted-foreground"
                    data-ocid="admin.orders.empty_state"
                  >
                    <Package2 className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p>No orders found.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table data-ocid="admin.orders.table">
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Sender</TableHead>
                          <TableHead>Receiver</TableHead>
                          <TableHead>Service</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Payment</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map((order, i) => (
                          <TableRow
                            key={order.backendId.toString()}
                            data-ocid={`admin.orders.row.${i + 1}`}
                          >
                            <TableCell className="font-mono font-semibold text-primary text-xs">
                              #{order.backendId.toString()}
                            </TableCell>
                            <TableCell>
                              <div className="text-sm font-medium">
                                {order.senderName}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {order.senderCity}, {order.senderState}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm font-medium">
                                {order.receiverName}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {order.receiverCity}, {order.receiverState}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs">
                                {order.serviceType}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={order.status} />
                            </TableCell>
                            <TableCell>
                              {order.paymentConfirmed ? (
                                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                  Confirmed
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                                  Pending
                                </span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs"
                                onClick={() => openEdit(order)}
                                data-ocid={`admin.order.edit_button.${i + 1}`}
                              >
                                Edit
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── PAYMENTS ── */}
          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-lg">
                  Payment Management
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {orders.length === 0 ? (
                  <div
                    className="text-center py-12 text-muted-foreground"
                    data-ocid="admin.payments.empty_state"
                  >
                    <DollarSign className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p>No payment records.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table data-ocid="admin.payments.table">
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Sender</TableHead>
                          <TableHead>Service</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map((order, i) => (
                          <TableRow
                            key={order.backendId.toString()}
                            data-ocid={`admin.payments.row.${i + 1}`}
                          >
                            <TableCell className="font-mono font-semibold text-primary text-xs">
                              #{order.backendId.toString()}
                            </TableCell>
                            <TableCell className="text-sm">
                              {order.senderName}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs">
                                {order.serviceType}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-semibold">
                              ${order.price.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              {order.paymentConfirmed ? (
                                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                  Confirmed
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                                  Pending
                                </span>
                              )}
                            </TableCell>
                            <TableCell>
                              {!order.paymentConfirmed && (
                                <Button
                                  size="sm"
                                  className="h-7 text-xs bg-primary text-primary-foreground"
                                  onClick={() =>
                                    handleConfirmPayment(order.backendId)
                                  }
                                  data-ocid={`admin.payments.confirm_button.${i + 1}`}
                                >
                                  Confirm
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── USERS ── */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-lg">
                  Customers
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {users.length === 0 ? (
                  <div
                    className="text-center py-12 text-muted-foreground"
                    data-ocid="admin.users.empty_state"
                  >
                    <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p>No customers yet.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table data-ocid="admin.users.table">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Phone</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user, i) => (
                          <TableRow
                            key={`${user.email}-${i}`}
                            data-ocid={`admin.users.row.${i + 1}`}
                          >
                            <TableCell className="font-medium text-sm">
                              {user.name}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {user.email || "—"}
                            </TableCell>
                            <TableCell className="text-sm">
                              {user.phone || "—"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── TRACKING CONTROL ── */}
          <TabsContent value="tracking">
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-lg">
                  Order Tracking Control
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Manually advance order delivery status. Each change
                  automatically notifies the customer.
                </p>
              </CardHeader>
              <CardContent className="p-0">
                {orders.length === 0 ? (
                  <div
                    className="text-center py-12 text-muted-foreground"
                    data-ocid="admin.tracking.empty_state"
                  >
                    <Truck className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p>No orders to track.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table data-ocid="admin.tracking.table">
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Sender → Receiver</TableHead>
                          <TableHead>Service</TableHead>
                          <TableHead>Current Status</TableHead>
                          <TableHead>Update Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map((order, i) => (
                          <TableRow
                            key={order.backendId.toString()}
                            data-ocid={`admin.tracking.row.${i + 1}`}
                          >
                            <TableCell className="font-mono font-semibold text-primary text-xs">
                              #{order.backendId.toString()}
                            </TableCell>
                            <TableCell className="text-sm">
                              <span className="font-medium">
                                {order.senderName}
                              </span>
                              <span className="text-muted-foreground mx-1">
                                →
                              </span>
                              <span className="font-medium">
                                {order.receiverName}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs">
                                {order.serviceType}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={order.status} />
                            </TableCell>
                            <TableCell>
                              <Select
                                value={order.status}
                                onValueChange={(v) =>
                                  handleStatusChange(order.backendId, v)
                                }
                              >
                                <SelectTrigger
                                  className="w-44 h-8 text-xs"
                                  data-ocid={`admin.order.status_select.${i + 1}`}
                                >
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {ALL_STATUSES.map((s) => (
                                    <SelectItem
                                      key={s}
                                      value={s}
                                      className="text-xs"
                                    >
                                      {s}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── NOTIFICATIONS ── */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-lg">
                  Notification Log
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Record of all status-change notifications sent to customers.
                </p>
              </CardHeader>
              <CardContent className="p-0">
                {notifications.length === 0 ? (
                  <div
                    className="text-center py-12 text-muted-foreground"
                    data-ocid="admin.notifications.empty_state"
                  >
                    <Bell className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p className="font-semibold">No notifications yet.</p>
                    <p className="text-sm mt-1 opacity-70">
                      Notifications appear when order statuses are updated.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table data-ocid="admin.notifications.table">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Time</TableHead>
                          <TableHead>Order</TableHead>
                          <TableHead>Message</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {notifications.map((n, i) => (
                          <TableRow
                            key={`${n.id.toString()}`}
                            data-ocid={`admin.notifications.row.${i + 1}`}
                          >
                            <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                              {new Date(
                                Number(n.timestamp) / 1_000_000,
                              ).toLocaleString()}
                            </TableCell>
                            <TableCell className="font-mono font-semibold text-primary text-xs">
                              {n.orderId ? `#${n.orderId.toString()}` : "—"}
                            </TableCell>
                            <TableCell className="text-sm">
                              {n.message}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── SERVICE REQUESTS ── */}
          <TabsContent value="service">
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-lg">
                  Service Requests
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Customer inquiries and service requests submitted via the
                  website.
                </p>
              </CardHeader>
              <CardContent className="p-0">
                {serviceRequests.length === 0 ? (
                  <div
                    className="text-center py-12 text-muted-foreground"
                    data-ocid="admin.service.empty_state"
                  >
                    <HeadphonesIcon className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <h3 className="font-display text-xl font-semibold mb-2">
                      No Service Requests
                    </h3>
                    <p className="text-sm">
                      Customer service requests will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table data-ocid="admin.service.table">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Time</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Message</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {serviceRequests.map((req, i) => (
                          <TableRow
                            key={req.id.toString()}
                            data-ocid={`admin.service.row.${i + 1}`}
                          >
                            <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                              {new Date(
                                Number(req.timestamp) / 1_000_000,
                              ).toLocaleString()}
                            </TableCell>
                            <TableCell className="font-medium text-sm">
                              {req.name}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {req.email}
                            </TableCell>
                            <TableCell className="text-sm">
                              {req.phone || "—"}
                            </TableCell>
                            <TableCell className="text-sm max-w-xs">
                              {req.message}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />

      {editOrderData && (
        <EditOrderDialog
          order={editOrderData}
          open={!!editOrderData}
          onClose={() => setEditOrderData(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}
