import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Cross, Menu, Shield, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const token = localStorage.getItem("token")
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">

        {/* Logo + Company Name */}
        <Link to="/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="md:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Asmadiya Technologies
            </h1>
            <p className="text-sm text-gray-600">KYC Document Verification</p>
          </div>
        </Link>

        {/* Navigation */}
        {/* Desktoop */}
        <nav className="hidden md:flex items-center gap-6">
          {token ? (
            <Button asChild size="sm">
              <Link to="/kyc-verification">Start KYC</Link>
            </Button>
          ) : (
            <>
              <Button asChild size="sm">
                <Link to="/signup">Register</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/login">Login</Link>
              </Button>
            </>
          )}
        </nav>

        {/* Mobile Hamburger */}
        {!isOpen && <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Menu className="w-6 h-6" />
        </button>}
        {/* Mobile Menu */}
        {isOpen && (
          <nav className="flex flex-col gap-4 md:hidden fixed right-0 top-0 bg-[#e1e8fb99] h-screen p-4">
            <X className="w-6 h-6 self-end mt-1" onClick={() => setIsOpen(!isOpen)}/>
            {token ? (
              <Button asChild size="sm">
                <Link to="/kyc-verification">Start KYC</Link>
              </Button>
            ) : (
              <>
                <Button asChild size="sm">
                  <Link to="/signup">Register</Link>
                </Button>
                <Button asChild size="sm">
                  <Link to="/login">Login</Link>
                </Button>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
