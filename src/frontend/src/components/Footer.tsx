import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Package2, Phone } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const utm = encodeURIComponent(window.location.hostname);
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Package2 className="w-6 h-6 text-accent" />
              <span className="font-display font-bold text-lg">
                Swift<span className="text-accent">Ship</span>
              </span>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Fast, reliable logistics solutions for businesses and individuals
              across 50+ cities nationwide.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-accent">Services</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>Standard Shipping</li>
              <li>Express Delivery</li>
              <li>Overnight Service</li>
              <li>Freight Solutions</li>
              <li>Package Insurance</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-accent">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-primary-foreground/70 hover:text-accent transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/track"
                  className="text-primary-foreground/70 hover:text-accent transition-colors"
                >
                  Track Shipment
                </Link>
              </li>
              <li>
                <Link
                  to="/admin"
                  className="text-primary-foreground/70 hover:text-accent transition-colors"
                >
                  Admin Panel
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-accent">Contact</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 flex-shrink-0 text-accent" /> 350
                Fifth Avenue, Suite 4100, New York, NY 10118
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0 text-accent" /> +1 (212)
                555-7469
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0 text-accent" />{" "}
                swiftshipcustomeroutreach@gmail.com
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-primary-foreground/20 mt-10 pt-6 text-center text-sm text-primary-foreground/50">
          &copy; {year} SwiftShip Inc. All rights reserved. Built with &hearts;
          using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${utm}`}
            target="_blank"
            rel="noreferrer"
            className="text-accent hover:underline"
          >
            caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
