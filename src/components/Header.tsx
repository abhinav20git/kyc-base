import React from "react";
import { Link, NavLink } from "react-router-dom";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        
        {/* Logo + Company Name wrapped in Link */}
        <Link to="/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Asmadiya Technologies
            </h1>
            <p className="text-sm text-gray-600">KYC Document Verification</p>
          </div>
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
