import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, Package2, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 bg-primary shadow-navy">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link
          to="/"
          className="flex items-center gap-2"
          data-ocid="nav.home_link"
        >
          <Package2 className="w-7 h-7 text-accent" />
          <span className="font-display font-800 text-xl text-primary-foreground tracking-tight">
            Swift<span className="text-accent">Ship</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className="text-primary-foreground/80 hover:text-accent transition-colors text-sm font-medium"
          >
            Home
          </Link>
          <Link
            to="/track"
            className="text-primary-foreground/80 hover:text-accent transition-colors text-sm font-medium"
            data-ocid="nav.track_link"
          >
            Track Shipment
          </Link>
          <Link
            to="/admin"
            className="text-primary-foreground/80 hover:text-accent transition-colors text-sm font-medium"
            data-ocid="nav.admin_link"
          >
            Admin
          </Link>
          <Button
            size="sm"
            className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
            onClick={() => {
              navigate({ to: "/" });
            }}
            data-ocid="nav.ship_button"
          >
            Ship Now
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="md:hidden text-primary-foreground"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-primary border-t border-primary-foreground/10 px-4 py-4 flex flex-col gap-4">
          <Link
            to="/"
            className="text-primary-foreground/80 hover:text-accent text-sm font-medium"
            onClick={() => setOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/track"
            className="text-primary-foreground/80 hover:text-accent text-sm font-medium"
            onClick={() => setOpen(false)}
          >
            Track Shipment
          </Link>
          <Link
            to="/admin"
            className="text-primary-foreground/80 hover:text-accent text-sm font-medium"
            onClick={() => setOpen(false)}
          >
            Admin Login
          </Link>
        </div>
      )}
    </nav>
  );
}
