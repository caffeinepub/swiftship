import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  Calendar,
  CheckCircle2,
  CreditCard,
  MapPin,
  Package,
  Search,
  Shield,
} from "lucide-react";
import { motion } from "motion/react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { getOrder } from "../utils/orders";

export default function OrderConfirmationPage() {
  const navigate = useNavigate();
  const { orderId } = useParams({ from: "/order-confirmation/$orderId" });
  const order = getOrder(orderId);

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="font-display text-2xl font-bold mb-4">
              Order Not Found
            </h2>
            <Button onClick={() => navigate({ to: "/" })}>Go Home</Button>
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
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="w-16 h-16 text-success" />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Order Created Successfully!
            </h1>
            <p className="text-muted-foreground">
              Your shipment has been booked. Here are your order details.
            </p>
          </div>

          <Card className="mb-6 border-2 border-accent">
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground text-sm mb-1">
                Your Order Number
              </p>
              <div className="font-display text-4xl font-bold text-primary tracking-widest">
                {order.orderId}
              </div>
              <Badge className="mt-3 bg-accent/20 text-accent border-accent/30">
                Order Placed
              </Badge>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <Package className="w-5 h-5 text-accent" />
                Shipment Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-accent mt-0.5" />
                <div>
                  <div className="font-medium">From &rarr; To</div>
                  <div className="text-muted-foreground">
                    {order.senderCity}, {order.senderState} &rarr;{" "}
                    {order.receiverCity}, {order.receiverState}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Package className="w-4 h-4 text-accent mt-0.5" />
                <div>
                  <div className="font-medium">
                    Service: {order.serviceType}
                  </div>
                  <div className="text-muted-foreground">
                    {order.packageType} &middot; {order.weight}kg
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-accent mt-0.5" />
                <div>
                  <div className="font-medium">Estimated Delivery</div>
                  <div className="text-muted-foreground">
                    {order.estimatedDelivery}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="w-4 h-4 text-accent mt-0.5" />
                <div>
                  <div className="font-medium">Insurance</div>
                  <div className="text-muted-foreground">
                    {order.insurance ? "Included (+$15)" : "Not added"}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CreditCard className="w-4 h-4 text-accent mt-0.5" />
                <div>
                  <div className="font-medium">Total Amount</div>
                  <div className="text-2xl font-bold text-primary">
                    ${order.price.toFixed(2)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              size="lg"
              className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90 font-bold"
              onClick={() =>
                navigate({
                  to: "/payment/$orderId",
                  params: { orderId: order.orderId },
                })
              }
            >
              <CreditCard className="mr-2 w-5 h-5" />
              Proceed to Payment
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="flex-1 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              onClick={() =>
                navigate({
                  to: "/tracking/$orderId",
                  params: { orderId: order.orderId },
                })
              }
            >
              <Search className="mr-2 w-5 h-5" />
              Track Order
            </Button>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
