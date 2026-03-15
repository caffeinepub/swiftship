import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  Building2,
  CheckCircle2,
  Copy,
  CreditCard,
  Hash,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useActor } from "../hooks/useActor";
import { getOrder, updateOrderStatus } from "../utils/orders";

export default function PaymentPage() {
  const navigate = useNavigate();
  const { orderId } = useParams({ from: "/payment/$orderId" });
  const { actor: backend } = useActor();
  const order = getOrder(orderId);

  function copyToClipboard(text: string, label: string) {
    navigator.clipboard
      .writeText(text)
      .then(() => toast.success(`${label} copied!`));
  }

  async function handleYes() {
    // Update local state
    updateOrderStatus(orderId, "Processing");

    // Update backend (graceful degradation)
    try {
      if (backend && order?.backendId) {
        await backend.confirmPayment(BigInt(order.backendId));
      }
    } catch {
      // Continue even if backend fails
    }

    toast.success("Payment confirmed! Redirecting to tracking...");
    setTimeout(
      () => navigate({ to: "/tracking/$orderId", params: { orderId } }),
      1000,
    );
  }

  function handleNo() {
    toast.error("Please complete your payment to proceed.", {
      description: "Use the bank details above and reference your order ID.",
    });
  }

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
      <main className="flex-1 container mx-auto px-4 py-12 max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <CreditCard className="w-12 h-12 text-accent mx-auto mb-3" />
            <h1 className="font-display text-3xl font-bold text-foreground">
              Complete Payment
            </h1>
            <p className="text-muted-foreground mt-2">
              Order{" "}
              <span className="font-mono font-bold text-primary">
                {order.orderId}
              </span>
            </p>
          </div>

          <Card className="mb-6 border-2 border-primary">
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground text-sm">Amount Due</p>
              <div className="font-display text-4xl font-bold text-primary mt-1">
                ${order.price.toFixed(2)}
              </div>
              <p className="text-muted-foreground text-xs mt-1">
                {order.serviceType} Shipping &middot; {order.weight}kg
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6 bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <Building2 className="w-5 h-5 text-accent" />
                Bank Transfer Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Bank Name", value: "First National Bank" },
                { label: "Account Name", value: "SwiftShip Logistics Ltd" },
                { label: "Account Number", value: "0123456789" },
                { label: "Sort Code", value: "12-34-56" },
                { label: "Reference", value: order.orderId },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex justify-between items-center"
                >
                  <div>
                    <p className="text-primary-foreground/60 text-xs">
                      {item.label}
                    </p>
                    <p className="font-mono font-semibold">{item.value}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(item.value, item.label)}
                    className="text-accent hover:text-accent/70 transition-colors p-1"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <Separator className="bg-primary-foreground/20" />
              <div className="flex items-center gap-2 text-accent text-sm">
                <Hash className="w-4 h-4" />
                <span>Use your Order ID as payment reference</span>
              </div>
            </CardContent>
          </Card>

          <div className="rounded-lg bg-accent/10 border border-accent/30 p-4 mb-8 text-sm text-muted-foreground">
            <p className="font-semibold text-foreground mb-1">
              &#128203; Instructions
            </p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Log in to your bank app or visit any branch</li>
              <li>
                Transfer the exact amount:{" "}
                <strong>${order.price.toFixed(2)}</strong>
              </li>
              <li>
                Use Order ID <strong>{order.orderId}</strong> as the payment
                reference
              </li>
              <li>
                Come back here and click <strong>YES</strong> below
              </li>
            </ol>
          </div>

          <Card>
            <CardContent className="pt-6 text-center">
              <p className="font-display font-bold text-lg text-foreground mb-2">
                Have you completed your payment?
              </p>
              <p className="text-muted-foreground text-sm mb-6">
                Only confirm after the transfer has been made.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  size="lg"
                  className="flex-1 bg-success text-success-foreground hover:bg-success/90 font-bold text-lg"
                  onClick={handleYes}
                  data-ocid="payment.yes_button"
                >
                  <CheckCircle2 className="mr-2 w-5 h-5" />
                  YES, I&apos;ve Paid
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="flex-1 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground font-bold"
                  onClick={handleNo}
                  data-ocid="payment.no_button"
                >
                  <XCircle className="mr-2 w-5 h-5" />
                  NO, Not Yet
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
