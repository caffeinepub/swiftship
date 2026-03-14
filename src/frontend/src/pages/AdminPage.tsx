import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  CheckCircle2,
  Clock,
  Lock,
  Package2,
  Search,
  Truck,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { getOrders, updateOrderStatus } from "../utils/orders";
import type { OrderData } from "../utils/orders";

const STATUS_COLORS: Record<string, string> = {
  Placed: "bg-blue-100 text-blue-700",
  Processing: "bg-yellow-100 text-yellow-700",
  InTransit: "bg-orange-100 text-orange-700",
  OutForDelivery: "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
};

const ADMIN_PASSWORD = "admin123";

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [pwError, setPwError] = useState("");
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    if (authed) setOrders(getOrders());
  }, [authed]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
      setPwError("");
    } else {
      setPwError("Incorrect password. Try 'admin123'.");
    }
  }

  function handleStatusChange(orderId: string, status: string) {
    updateOrderStatus(orderId, status);
    setOrders(getOrders());
    toast.success(`Order ${orderId} updated to ${status}`);
  }

  const filtered = orders.filter((o) => {
    const matchSearch =
      !search ||
      o.orderId.toLowerCase().includes(search.toLowerCase()) ||
      o.senderName.toLowerCase().includes(search.toLowerCase()) ||
      o.receiverName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: orders.length,
    delivered: orders.filter((o) => o.status === "Delivered").length,
    inTransit: orders.filter(
      (o) => o.status === "InTransit" || o.status === "OutForDelivery",
    ).length,
    processing: orders.filter((o) => o.status === "Processing").length,
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
            <Card>
              <CardHeader className="text-center">
                <Lock className="w-10 h-10 text-primary mx-auto mb-2" />
                <CardTitle className="font-display text-2xl">
                  Admin Login
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="adminPw">Password</Label>
                    <Input
                      id="adminPw"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter admin password"
                      className="mt-1"
                    />
                    {pwError && (
                      <p
                        className="text-destructive text-sm mt-1"
                        data-ocid="admin.error_state"
                      >
                        {pwError}
                      </p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground"
                    data-ocid="admin.login_button"
                  >
                    Login to Admin Panel
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
      <main className="flex-1 container mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground">
            Admin Dashboard
          </h1>
          <Button variant="outline" size="sm" onClick={() => setAuthed(false)}>
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total Orders",
              value: stats.total,
              icon: <Package2 className="w-5 h-5" />,
              color: "text-primary",
            },
            {
              label: "Delivered",
              value: stats.delivered,
              icon: <CheckCircle2 className="w-5 h-5" />,
              color: "text-green-600",
            },
            {
              label: "In Transit",
              value: stats.inTransit,
              icon: <Truck className="w-5 h-5" />,
              color: "text-orange-500",
            },
            {
              label: "Processing",
              value: stats.processing,
              icon: <Clock className="w-5 h-5" />,
              color: "text-yellow-600",
            },
          ].map((s) => (
            <Card key={s.label}>
              <CardContent className="pt-6 flex items-center gap-3">
                <div className={s.color}>{s.icon}</div>
                <div>
                  <div className="font-display text-2xl font-bold">
                    {s.value}
                  </div>
                  <div className="text-muted-foreground text-xs">{s.label}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by Order ID or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              data-ocid="admin.order_search_input"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[
                "All",
                "Placed",
                "Processing",
                "InTransit",
                "OutForDelivery",
                "Delivered",
              ].map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {filtered.length === 0 ? (
          <div
            className="text-center py-20 text-muted-foreground"
            data-ocid="admin.empty_state"
          >
            <Package2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No orders found.</p>
          </div>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <Table data-ocid="admin.table">
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Sender</TableHead>
                    <TableHead>Receiver</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Update Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((order, i) => (
                    <TableRow
                      key={order.orderId}
                      data-ocid={`admin.row.${i + 1}`}
                    >
                      <TableCell className="font-mono font-semibold text-primary">
                        {order.orderId}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{order.senderName}</div>
                        <div className="text-muted-foreground text-xs">
                          {order.senderCity}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{order.receiverName}</div>
                        <div className="text-muted-foreground text-xs">
                          {order.receiverCity}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{order.serviceType}</Badge>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-600"}`}
                        >
                          {order.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={order.status}
                          onValueChange={(v) =>
                            handleStatusChange(order.orderId, v)
                          }
                        >
                          <SelectTrigger
                            className="w-36 h-8 text-xs"
                            data-ocid={`admin.status_select.${i + 1}`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              "Placed",
                              "Processing",
                              "InTransit",
                              "OutForDelivery",
                              "Delivered",
                            ].map((s) => (
                              <SelectItem key={s} value={s} className="text-xs">
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
          </Card>
        )}
      </main>
      <Footer />
    </div>
  );
}
