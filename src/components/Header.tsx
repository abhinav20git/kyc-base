import React, { useContext, useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { User } from "@/utils/constants";
import { UserContext } from "@/context/UserContext";

const Header: React.FC = () => {
  const user: User = useContext(UserContext);
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <span className="font-semibold">Asma KYC</span>
        </Link>
        <nav className="flex items-center gap-6">
          {!user ? <Button asChild size="sm">
            <Link to="/kyc-verification">Start KYC</Link>
          </Button> :
            <>
              <Button asChild size="sm">
                <Link to="/signup">Register</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/login">Login</Link>
              </Button>
            </>
          }
        </nav>
      </div>
    </header>
  );
};

export default Header;



