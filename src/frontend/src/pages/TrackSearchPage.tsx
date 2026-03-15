import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, Package2, Search } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { getOrder } from "../utils/orders";

export default function TrackSearchPage() {
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleTrack(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const trimmed = orderId.trim().toUpperCase();
    if (!trimmed) {
      setError("Please enter an Order ID.");
      return;
    }

    setLoading(true);
    try {
      // Check localStorage (which is synced from backend when order is placed)
      const localOrder = getOrder(trimmed);
      if (localOrder) {
        navigate({ to: "/tracking/$orderId", params: { orderId: trimmed } });
        return;
      }

      setError(
        `No order found with ID "${trimmed}". Please check and try again.`,
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 flex items-center justify-center container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <Package2 className="w-14 h-14 text-accent mx-auto mb-4" />
            <h1 className="font-display text-3xl font-bold text-foreground">
              Track Your Shipment
            </h1>
            <p className="text-muted-foreground mt-2">
              Enter your order ID to get real-time updates.
            </p>
          </div>
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleTrack} className="space-y-4">
                <div>
                  <Label htmlFor="trackOrderId">Order ID</Label>
                  <Input
                    id="trackOrderId"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder="e.g. SS-AB12CD"
                    className="mt-1 font-mono"
                    data-ocid="track.search_input"
                  />
                  {error && (
                    <p
                      className="text-destructive text-sm mt-1"
                      data-ocid="track.error_state"
                    >
                      {error}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground font-semibold"
                  disabled={loading}
                  data-ocid="track.submit_button"
                >
                  {loading ? (
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="mr-2 w-4 h-4" />
                  )}
                  {loading ? "Searching..." : "Track Shipment"}
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
