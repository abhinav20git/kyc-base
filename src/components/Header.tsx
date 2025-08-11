import React from "react";
import { Link, NavLink } from "react-router-dom";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <span className="font-semibold">KYC Verify</span>
        </Link>
        <nav className="flex items-center gap-6">
          <NavLink
            to="/kyc-verification"
            className={({ isActive }) =>
              `text-sm transition-colors hover:text-foreground ${isActive ? "text-foreground" : "text-muted-foreground"}`
            }
          >
            Verification
          </NavLink>
          <Button asChild size="sm">
            <Link to="/kyc-verification">Start KYC</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;



