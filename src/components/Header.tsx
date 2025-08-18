import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Shield, X, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logoutUser } from "@/api/auth";
import { useToast } from "@/hooks/use-toast";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check for token and user data on component mount and when storage changes
  useEffect(() => {
    const checkAuthState = () => {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      
      setToken(storedToken && storedToken !== 'undefined' ? storedToken : null);
      setUser(storedUser && storedUser !== 'undefined' ? JSON.parse(storedUser) : null);
    };

    // Initial check
    checkAuthState();

    // Listen for storage changes (when login/logout happens in other tabs or components)
    const handleStorageChange = (e) => {
      if (e.key === 'token' || e.key === 'user') {
        checkAuthState();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Custom event listener for same-tab updates
    const handleAuthChange = () => {
      checkAuthState();
    };
    
    window.addEventListener('authStateChanged', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authStateChanged', handleAuthChange);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      
      // Clear local state
      setToken(null);
      setUser(null);
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event('authStateChanged'));
      
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Even if logout API fails, clear local storage and redirect
      setToken(null);
      setUser(null);
      window.dispatchEvent(new Event('authStateChanged'));
      navigate("/login");
    }
  };

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
        {/* Desktop */}
        <nav className="hidden md:flex items-center gap-4">
          {token ? (
            <div className="flex items-center gap-4">
              {user && (
                <span className="text-sm text-gray-600">
                  Welcome, {user.name}
                </span>
              )}
              <Button asChild size="sm">
                <Link to="/kyc-verification">Start KYC</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link to="/profile">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Link>
              </Button>
              <Button size="sm" variant="ghost" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <>
              <Button asChild size="sm" variant="outline">
                <Link to="/signup">Register</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/login">Login</Link>
              </Button>
            </>
          )}
        </nav>

        {/* Mobile Hamburger */}
        {!isOpen && (
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        )}

        {/* Mobile Menu */}
        {isOpen && (
          <nav className="flex flex-col gap-4 md:hidden fixed right-0 top-0 bg-background/95 backdrop-blur h-screen p-4 border-l min-w-[250px]">
            <div className="flex justify-between items-center mb-4">
              {user && (
                <span className="text-sm text-gray-600">
                  Hi, {user.name}
                </span>
              )}
              <X 
                className="w-6 h-6 cursor-pointer" 
                onClick={() => setIsOpen(!isOpen)}
              />
            </div>
            
            {token ? (
              <>
                <Button asChild size="sm" onClick={() => setIsOpen(false)}>
                  <Link to="/kyc-verification">Start KYC</Link>
                </Button>
                <Button asChild size="sm" variant="outline" onClick={() => setIsOpen(false)}>
                  <Link to="/profile">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Link>
                </Button>
                <Button size="sm" variant="ghost" onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button asChild size="sm" variant="outline" onClick={() => setIsOpen(false)}>
                  <Link to="/signup">Register</Link>
                </Button>
                <Button asChild size="sm" onClick={() => setIsOpen(false)}>
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