import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "@tanstack/react-router";
import {
  ChevronRight,
  Clock,
  Mail,
  MapPin,
  Moon,
  Package,
  Phone,
  Shield,
  Star,
  Truck,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import {
  calculatePrice,
  generateOrderId,
  getEstimatedDelivery,
  saveOrder,
} from "../utils/orders";

const SERVICE_INFO: Record<
  string,
  { days: string; rate: number; icon: React.ReactNode; color: string }
> = {
  Standard: {
    days: "3–5 Business Days",
    rate: 5,
    icon: <Truck className="w-6 h-6" />,
    color: "text-blue-600",
  },
  Express: {
    days: "1–2 Business Days",
    rate: 10,
    icon: <Zap className="w-6 h-6" />,
    color: "text-orange-500",
  },
  Overnight: {
    days: "Next Day Delivery",
    rate: 20,
    icon: <Moon className="w-6 h-6" />,
    color: "text-purple-600",
  },
};

const FEATURES = [
  {
    icon: <MapPin className="w-8 h-8" />,
    title: "Real-Time Tracking",
    desc: "Follow your package every step of the way.",
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Full Insurance",
    desc: "Protect your valuables with our coverage plans.",
  },
  {
    icon: <Clock className="w-8 h-8" />,
    title: "24/7 Support",
    desc: "Our team is always here when you need us.",
  },
  {
    icon: <Star className="w-8 h-8" />,
    title: "Secure Payments",
    desc: "Bank-grade encryption on all transactions.",
  },
];

const FAQS = [
  {
    q: "How do I track my shipment?",
    a: "Visit the Track Shipment page and enter your order ID (e.g. SS-ABC123) to see live status updates.",
  },
  {
    q: "What items are prohibited?",
    a: "Flammable materials, hazardous chemicals, live animals, and illegal substances cannot be shipped.",
  },
  {
    q: "Is insurance mandatory?",
    a: "Insurance is optional but highly recommended for electronics, jewelry, and fragile items.",
  },
  {
    q: "How long does standard shipping take?",
    a: "Standard shipping takes 3–5 business days. Express is 1–2 days and Overnight is next-day delivery.",
  },
  {
    q: "Can I change my delivery address?",
    a: "Contact us within 2 hours of placing your order to modify the delivery address.",
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const bookingRef = useRef<HTMLDivElement>(null);

  const [quoteWeight, setQuoteWeight] = useState("");
  const [quoteService, setQuoteService] = useState("Standard");
  const [quoteResult, setQuoteResult] = useState<{
    price: number;
    days: string;
  } | null>(null);

  const [form, setForm] = useState({
    senderName: "",
    senderAddress: "",
    senderCity: "",
    senderState: "",
    senderZip: "",
    senderPhone: "",
    senderEmail: "",
    receiverName: "",
    receiverAddress: "",
    receiverCity: "",
    receiverState: "",
    receiverZip: "",
    receiverPhone: "",
    receiverEmail: "",
    weight: "",
    length: "",
    width: "",
    height: "",
    packageType: "Parcel",
    description: "",
    serviceType: "Standard",
    insurance: false,
  });
  const [submitting, setSubmitting] = useState(false);

  function handleQuote() {
    const w = Number.parseFloat(quoteWeight);
    if (!w || w <= 0) return;
    const price = calculatePrice(w, quoteService, false);
    setQuoteResult({ price, days: SERVICE_INFO[quoteService].days });
  }

  function setField(key: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const orderId = generateOrderId();
    const weight = Number.parseFloat(form.weight) || 0;
    const price = calculatePrice(weight, form.serviceType, form.insurance);
    const estimatedDelivery = getEstimatedDelivery(form.serviceType);
    saveOrder({
      orderId,
      senderName: form.senderName,
      senderAddress: form.senderAddress,
      senderCity: form.senderCity,
      senderState: form.senderState,
      senderZip: form.senderZip,
      senderPhone: form.senderPhone,
      senderEmail: form.senderEmail,
      receiverName: form.receiverName,
      receiverAddress: form.receiverAddress,
      receiverCity: form.receiverCity,
      receiverState: form.receiverState,
      receiverZip: form.receiverZip,
      receiverPhone: form.receiverPhone,
      receiverEmail: form.receiverEmail,
      weight: form.weight,
      length: form.length,
      width: form.width,
      height: form.height,
      packageType: form.packageType,
      description: form.description,
      serviceType: form.serviceType,
      insurance: form.insurance,
      status: "Placed",
      createdAt: new Date().toISOString(),
      estimatedDelivery,
      price,
    });
    setTimeout(() => {
      setSubmitting(false);
      navigate({ to: "/order-confirmation/$orderId", params: { orderId } });
    }, 800);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-primary overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage:
              "url('/assets/generated/swiftship-hero.dim_1600x500.jpg')",
          }}
        />
        <div className="relative container mx-auto px-4 py-24 md:py-36 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="bg-accent/20 text-accent border-accent/30 mb-4 px-3 py-1">
              🚚 America's Trusted Logistics Platform
            </Badge>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-primary-foreground mb-4 leading-tight">
              Fast. Reliable.
              <br />
              <span className="text-accent">Delivered.</span>
            </h1>
            <p className="text-primary-foreground/70 text-lg md:text-xl max-w-xl mx-auto mb-8">
              SwiftShip connects senders and receivers with lightning-fast
              logistics across 50+ cities nationwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-lg px-8"
                onClick={() =>
                  bookingRef.current?.scrollIntoView({ behavior: "smooth" })
                }
                data-ocid="hero.cta_button"
              >
                Ship Now <ChevronRight className="ml-1 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                onClick={() => navigate({ to: "/track" })}
              >
                Track Shipment
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-accent">
        <div className="container mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Deliveries", value: "10k+" },
            { label: "Cities Covered", value: "50+" },
            { label: "On-Time Rate", value: "99%" },
            { label: "Support", value: "24/7" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display font-bold text-2xl md:text-3xl text-accent-foreground">
                {s.value}
              </div>
              <div className="text-accent-foreground/80 text-sm font-medium">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Our Services
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Choose the shipping speed that fits your needs and budget.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(SERVICE_INFO).map(([name, info], i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full hover:shadow-navy transition-shadow">
                  <CardHeader>
                    <div className={`${info.color} mb-2`}>{info.icon}</div>
                    <CardTitle className="font-display">
                      {name} Shipping
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-3">
                      {info.days}
                    </p>
                    <p className="font-bold text-primary text-lg">
                      ${info.rate}
                      <span className="text-muted-foreground font-normal text-sm">
                        /kg
                      </span>
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                      onClick={() => {
                        setField("serviceType", name);
                        bookingRef.current?.scrollIntoView({
                          behavior: "smooth",
                        });
                      }}
                    >
                      Book {name}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Calculator */}
      <section id="quote" className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2 text-center">
              Get an Instant Quote
            </h2>
            <p className="text-muted-foreground text-center mb-8 text-sm">
              Estimate your shipping cost in seconds.
            </p>
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <Label htmlFor="quoteWeight">Package Weight (kg)</Label>
                  <Input
                    id="quoteWeight"
                    type="number"
                    min="0"
                    placeholder="e.g. 5"
                    value={quoteWeight}
                    onChange={(e) => setQuoteWeight(e.target.value)}
                    data-ocid="quote.weight_input"
                  />
                </div>
                <div>
                  <Label>Service Type</Label>
                  <Select value={quoteService} onValueChange={setQuoteService}>
                    <SelectTrigger data-ocid="quote.service_select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Standard">
                        Standard ($5/kg, 3–5 days)
                      </SelectItem>
                      <SelectItem value="Express">
                        Express ($10/kg, 1–2 days)
                      </SelectItem>
                      <SelectItem value="Overnight">
                        Overnight ($20/kg, Next Day)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  className="w-full bg-primary text-primary-foreground"
                  onClick={handleQuote}
                  data-ocid="quote.calculate_button"
                >
                  Calculate Price
                </Button>
                {quoteResult && (
                  <div className="rounded-lg bg-accent/10 border border-accent/30 p-4 text-center">
                    <div className="font-display text-3xl font-bold text-accent">
                      ${quoteResult.price.toFixed(2)}
                    </div>
                    <div className="text-muted-foreground text-sm mt-1">
                      {quoteResult.days}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Booking Form */}
      <section id="booking" ref={bookingRef} className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 text-center"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              Book a Shipment
            </h2>
            <p className="text-muted-foreground">
              Fill in the details below to create your shipment order.
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Sender */}
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-primary flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-accent" />
                  Sender Details
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Full Name *</Label>
                  <Input
                    required
                    value={form.senderName}
                    onChange={(e) => setField("senderName", e.target.value)}
                    placeholder="John Doe"
                    data-ocid="booking.sender_name_input"
                  />
                </div>
                <div>
                  <Label>Email *</Label>
                  <Input
                    required
                    type="email"
                    value={form.senderEmail}
                    onChange={(e) => setField("senderEmail", e.target.value)}
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <Label>Phone *</Label>
                  <Input
                    required
                    value={form.senderPhone}
                    onChange={(e) => setField("senderPhone", e.target.value)}
                    placeholder="+1 (212) 555-0000"
                  />
                </div>
                <div>
                  <Label>Address *</Label>
                  <Input
                    required
                    value={form.senderAddress}
                    onChange={(e) => setField("senderAddress", e.target.value)}
                    placeholder="123 Main Street"
                  />
                </div>
                <div>
                  <Label>City *</Label>
                  <Input
                    required
                    value={form.senderCity}
                    onChange={(e) => setField("senderCity", e.target.value)}
                    placeholder="New York"
                  />
                </div>
                <div>
                  <Label>State *</Label>
                  <Input
                    required
                    value={form.senderState}
                    onChange={(e) => setField("senderState", e.target.value)}
                    placeholder="NY"
                  />
                </div>
                <div>
                  <Label>ZIP Code</Label>
                  <Input
                    value={form.senderZip}
                    onChange={(e) => setField("senderZip", e.target.value)}
                    placeholder="10001"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Receiver */}
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-primary flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-accent" />
                  Receiver Details
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Full Name *</Label>
                  <Input
                    required
                    value={form.receiverName}
                    onChange={(e) => setField("receiverName", e.target.value)}
                    placeholder="Jane Smith"
                    data-ocid="booking.receiver_name_input"
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={form.receiverEmail}
                    onChange={(e) => setField("receiverEmail", e.target.value)}
                    placeholder="jane@example.com"
                  />
                </div>
                <div>
                  <Label>Phone *</Label>
                  <Input
                    required
                    value={form.receiverPhone}
                    onChange={(e) => setField("receiverPhone", e.target.value)}
                    placeholder="+1 (310) 555-0000"
                  />
                </div>
                <div>
                  <Label>Address *</Label>
                  <Input
                    required
                    value={form.receiverAddress}
                    onChange={(e) =>
                      setField("receiverAddress", e.target.value)
                    }
                    placeholder="456 Oak Avenue"
                  />
                </div>
                <div>
                  <Label>City *</Label>
                  <Input
                    required
                    value={form.receiverCity}
                    onChange={(e) => setField("receiverCity", e.target.value)}
                    placeholder="Los Angeles"
                  />
                </div>
                <div>
                  <Label>State *</Label>
                  <Input
                    required
                    value={form.receiverState}
                    onChange={(e) => setField("receiverState", e.target.value)}
                    placeholder="CA"
                  />
                </div>
                <div>
                  <Label>ZIP Code</Label>
                  <Input
                    value={form.receiverZip}
                    onChange={(e) => setField("receiverZip", e.target.value)}
                    placeholder="90001"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Package */}
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-primary flex items-center gap-2">
                  <Package className="w-5 h-5 text-accent" />
                  Package Details
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Package Type *</Label>
                  <Select
                    value={form.packageType}
                    onValueChange={(v) => setField("packageType", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "Document",
                        "Parcel",
                        "Fragile",
                        "Electronics",
                        "Clothing",
                      ].map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Service Type *</Label>
                  <Select
                    value={form.serviceType}
                    onValueChange={(v) => setField("serviceType", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Standard">Standard ($5/kg)</SelectItem>
                      <SelectItem value="Express">Express ($10/kg)</SelectItem>
                      <SelectItem value="Overnight">
                        Overnight ($20/kg)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Weight (kg) *</Label>
                  <Input
                    required
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={form.weight}
                    onChange={(e) => setField("weight", e.target.value)}
                    placeholder="2.5"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Input
                    value={form.description}
                    onChange={(e) => setField("description", e.target.value)}
                    placeholder="Package contents..."
                  />
                </div>
                <div>
                  <Label>Length (cm)</Label>
                  <Input
                    type="number"
                    value={form.length}
                    onChange={(e) => setField("length", e.target.value)}
                    placeholder="30"
                  />
                </div>
                <div>
                  <Label>Width (cm)</Label>
                  <Input
                    type="number"
                    value={form.width}
                    onChange={(e) => setField("width", e.target.value)}
                    placeholder="20"
                  />
                </div>
                <div>
                  <Label>Height (cm)</Label>
                  <Input
                    type="number"
                    value={form.height}
                    onChange={(e) => setField("height", e.target.value)}
                    placeholder="15"
                  />
                </div>
                <div className="sm:col-span-2">
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-accent/10 border border-accent/30">
                    <Checkbox
                      id="insurance"
                      checked={form.insurance}
                      onCheckedChange={(c) => setField("insurance", c === true)}
                    />
                    <Label htmlFor="insurance" className="cursor-pointer">
                      <span className="font-semibold">
                        Add Insurance (+$15)
                      </span>
                      <span className="text-muted-foreground text-sm ml-2">
                        — Full coverage for your package
                      </span>
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <Button
                type="submit"
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-lg px-12"
                disabled={submitting}
                data-ocid="booking.submit_button"
              >
                {submitting ? "Creating Order..." : "Create Shipment Order →"}
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl font-bold text-primary-foreground text-center mb-12">
            Why Choose SwiftShip?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6"
              >
                <div className="text-accent mb-4 flex justify-center">
                  {f.icon}
                </div>
                <h3 className="font-display font-bold text-primary-foreground mb-2">
                  {f.title}
                </h3>
                <p className="text-primary-foreground/60 text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="font-display text-3xl font-bold text-foreground text-center mb-10">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible>
            {FAQS.map((faq, i) => (
              <AccordionItem key={faq.q} value={`faq-${i}`}>
                <AccordionTrigger className="font-medium text-left">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="font-display text-3xl font-bold text-foreground mb-4">
            Get In Touch
          </h2>
          <p className="text-muted-foreground mb-10">
            Have questions? Our team is ready to help 24/7.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <MapPin className="w-6 h-6 text-accent" />,
                label: "Address",
                value: "350 Fifth Avenue, Suite 4100, New York, NY 10118",
              },
              {
                icon: <Phone className="w-6 h-6 text-accent" />,
                label: "Phone",
                value: "+1 (212) 555-7469",
              },
              {
                icon: <Mail className="w-6 h-6 text-accent" />,
                label: "Email",
                value: "hello@swiftship.com",
              },
            ].map((c) => (
              <Card key={c.label}>
                <CardContent className="pt-6 flex flex-col items-center gap-2">
                  {c.icon}
                  <div className="font-semibold text-sm text-muted-foreground">
                    {c.label}
                  </div>
                  <div className="font-medium text-sm">{c.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
