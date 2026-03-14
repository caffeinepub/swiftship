import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  CheckCircle2,
  Circle,
  Download,
  Home,
  MapPin,
  Package,
  PartyPopper,
  Share2,
  Truck,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { getOrder, updateOrderStatus } from "../utils/orders";
import type { OrderData } from "../utils/orders";

const STAGES = [
  { key: "Placed", label: "Order Placed", icon: Package },
  { key: "Processing", label: "Processing", icon: CheckCircle2 },
  { key: "InTransit", label: "In Transit", icon: Truck },
  { key: "OutForDelivery", label: "Out for Delivery", icon: MapPin },
  { key: "Delivered", label: "Delivered", icon: Home },
];

const STATUS_INDEX: Record<string, number> = {
  Placed: 0,
  Processing: 1,
  InTransit: 2,
  OutForDelivery: 3,
  Delivered: 4,
};

export default function TrackingPage() {
  const { orderId } = useParams({ from: "/tracking/$orderId" });
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderData | null>(
    getOrder(orderId) ?? null,
  );
  const [delivered, setDelivered] = useState(false);

  const statusIndex = order ? (STATUS_INDEX[order.status] ?? 0) : 0;

  useEffect(() => {
    if (!order || !orderId) return;
    if (statusIndex >= 4) {
      setDelivered(true);
      return;
    }
    if (statusIndex < 1) return;

    const sequence: Array<[string, number]> = [
      ["InTransit", 3000],
      ["OutForDelivery", 6000],
      ["Delivered", 9000],
    ];

    const timers = sequence
      .filter(([s]) => STATUS_INDEX[s] > statusIndex)
      .map(([s, delay]) =>
        setTimeout(() => {
          updateOrderStatus(orderId, s);
          const fresh = getOrder(orderId);
          setOrder(fresh ?? null);
          if (s === "Delivered") {
            setDelivered(true);
            toast.success(`🎉 Your package ${orderId} has been delivered!`, {
              duration: 6000,
              description: "Thank you for shipping with SwiftShip!",
            });
          }
        }, delay),
      );

    return () => timers.forEach(clearTimeout);
  }, [statusIndex, orderId, order]);

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="font-display text-2xl font-bold mb-4">
              Order Not Found
            </h2>
            <Button onClick={() => navigate({ to: "/track" })}>
              Search Orders
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-2xl">
        <div className="text-center mb-8">
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-3">
            Live Tracking
          </Badge>
          <h1 className="font-display text-3xl font-bold text-foreground">
            {order.orderId}
          </h1>
          <p className="text-muted-foreground mt-1">
            Estimated Delivery:{" "}
            <span className="font-semibold text-foreground">
              {order.estimatedDelivery}
            </span>
          </p>
        </div>

        <AnimatePresence>
          {delivered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="mb-6 rounded-xl bg-success/10 border-2 border-success p-6 text-center"
            >
              <PartyPopper className="w-12 h-12 text-success mx-auto mb-3" />
              <h2 className="font-display text-2xl font-bold text-success">
                Package Delivered!
              </h2>
              <p className="text-muted-foreground mt-1">
                Your order has been successfully delivered. Thank you for
                choosing SwiftShip!
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <Card className="mb-6">
          <CardContent className="pt-8 pb-8">
            <div className="relative">
              <div
                className="absolute top-5 h-0.5 bg-border"
                style={{ left: "2.5rem", right: "2.5rem" }}
              />
              <div
                className="absolute top-5 h-0.5 bg-accent transition-all duration-1000"
                style={{
                  left: "2.5rem",
                  width: `calc((100% - 5rem) * ${statusIndex / (STAGES.length - 1)})`,
                }}
              />
              <div className="relative flex justify-between">
                {STAGES.map((stage, i) => {
                  const Icon = stage.icon;
                  const done = i <= statusIndex;
                  const active = i === statusIndex;
                  return (
                    <div
                      key={stage.key}
                      className="flex flex-col items-center"
                      data-ocid={`tracking.step.${i + 1}`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 z-10 ${
                          done
                            ? "bg-accent border-accent text-accent-foreground"
                            : "bg-background border-border text-muted-foreground"
                        } ${active ? "ring-4 ring-accent/30" : ""}`}
                      >
                        {done ? (
                          <Icon className="w-5 h-5" />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </div>
                      <div className="mt-2 text-center">
                        <p
                          className={`text-xs font-medium ${done ? "text-foreground" : "text-muted-foreground"}`}
                        >
                          {stage.label}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success("Tracking link copied!");
            }}
          >
            <Share2 className="mr-2 w-4 h-4" />
            Share Tracking
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() =>
              toast.success("Receipt downloaded!", {
                description: `Order ${order.orderId}`,
              })
            }
          >
            <Download className="mr-2 w-4 h-4" />
            Download Receipt
          </Button>
        </div>

        <Accordion type="single" collapsible>
          <AccordionItem value="details">
            <AccordionTrigger className="font-semibold">
              Shipment Details
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-muted-foreground">From</p>
                    <p className="font-medium">{order.senderName}</p>
                    <p className="text-muted-foreground text-xs">
                      {order.senderCity}, {order.senderState}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">To</p>
                    <p className="font-medium">{order.receiverName}</p>
                    <p className="text-muted-foreground text-xs">
                      {order.receiverCity}, {order.receiverState}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-muted-foreground">Service</p>
                    <p className="font-medium">{order.serviceType}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Weight</p>
                    <p className="font-medium">{order.weight} kg</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-muted-foreground">Package Type</p>
                    <p className="font-medium">{order.packageType}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Insurance</p>
                    <p className="font-medium">
                      {order.insurance ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground">Total Paid</p>
                  <p className="font-bold text-primary">
                    ${order.price.toFixed(2)}
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </main>
      <Footer />
    </div>
  );
}
