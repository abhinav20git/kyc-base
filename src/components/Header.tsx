import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; // ⬅️ added useLocation
import { Menu, Shield, X, LogOut, User, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logoutUser } from "@/api/auth";
import { useToast } from "@/hooks/use-toast";

const Header = ({isDarkTheme}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation(); 
  const { toast } = useToast();

  useEffect(() => {
    const checkAuthState = () => {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      setToken(storedToken && storedToken !== "undefined" ? storedToken : null);
      setUser(
        storedUser && storedUser !== "undefined"
          ? JSON.parse(storedUser)
          : null
      );
    };

    checkAuthState();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token" || e.key === "user") {
        checkAuthState();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    const handleAuthChange = () => {
      checkAuthState();
    };
    window.addEventListener("authStateChanged", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("authStateChanged", handleAuthChange);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      setToken(null);
      setUser(null);
      window.dispatchEvent(new Event("authStateChanged"));
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      setToken(null);
      setUser(null);
      window.dispatchEvent(new Event("authStateChanged"));
      toast({
        title: "Logged Out",
        description: "You have been logged out locally.",
      });
      navigate("/login");
    }
  };

  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <header className={`sticky top-0 z-40 w-full border-b ${isDarkTheme? 'bg-zinc-900 border-zinc-700':'bg-background/80'} backdrop-blur`}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center space-x-3 hover:opacity-90 transition-opacity"
        >
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            {isDarkTheme ? <Bot className="h-5 w-5 text-primary-foreground" /> : <Shield className="w-5 h-5 text-white" />}
          </div>
          <div>
            <h1 className="md:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Asmadiya Technologies
            </h1>
            <p className={`text-sm ${isDarkTheme? 'text-gray-400':'text-gray-600'}`}>KYC Document Verification {isDarkTheme && 'with AI Assistant'}</p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-4">
          {token ? (
            <div className="flex items-center gap-4">
              {user && (
                <span className={`text-sm ${isDarkTheme? 'text-gray-300' :'text-gray-600'}`}>
                  Welcome, {user.name}
                </span>
              )}

              {/* Start KYC button */}
              {!isDarkTheme && <Button
                asChild
                size="sm"
                variant={isActive("/kyc-verification") ? "default" : "outline"}
              >
                <Link to="/kyc-verification">Start KYC</Link>
              </Button>}

              {/* Profile button */}
              {!isDarkTheme && <Button
                asChild
                size="sm"
                variant={isActive("/profile") ? "default" : "outline"}
              >
                <Link to="/profile">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Link>
              </Button>}

              {/* Logout */}
              <Button size="sm" variant="ghost" className={`${isDarkTheme? 'bg-zinc-900 text-white hover:bg-zinc-700':''}`} onClick={handleLogout}>
                <LogOut className={`w-4 h-4 mr-2`} />
                Logout
              </Button>
            </div>
          ) : (
            <>
              <Button asChild size="sm" variant={isActive("/signup") ? "default" : "outline"}>
                <Link to="/signup">Register</Link>
              </Button>
              <Button asChild size="sm" variant={isActive("/login") ? "default" : "outline"}>
                <Link to="/login">Login</Link>
              </Button>
            </>
          )}
        </nav>

        {/* Mobile Hamburger */}
        {!isOpen && (
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
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
                <Button
                  asChild
                  size="sm"
                  variant={isActive("/kyc-verification") ? "default" : "outline"}
                  onClick={() => setIsOpen(false)}
                >
                  <Link to="/kyc-verification">Start KYC</Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  variant={isActive("/profile") ? "default" : "outline"}
                  onClick={() => setIsOpen(false)}
                >
                  <Link to="/profile">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Link>
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
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
