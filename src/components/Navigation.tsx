
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ShoppingCart, Utensils, Clock, Shield, User, Truck, ChevronDown, Settings, Languages, Moon, Sun, LogOut, UserPlus, Trash2, RotateCcw, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";

type NavigationProps = {
  activeTab: 'menu' | 'cart' | 'orders';
  setActiveTab: (tab: 'menu' | 'cart' | 'orders') => void;
  cartItemCount: number;
};

export const Navigation = ({ activeTab, setActiveTab, cartItemCount }: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState("id");
  const navigate = useNavigate();
  const isUserLoggedIn = localStorage.getItem("userLoggedIn");
  const currentUser = localStorage.getItem("currentUser");
  const isDriverLoggedIn = localStorage.getItem("driverLoggedIn");
  const currentDriver = localStorage.getItem("currentDriver");
  const isAdminLoggedIn = localStorage.getItem("adminAuth");
  const isCashierLoggedIn = localStorage.getItem("cashierLoggedIn");
  const currentCashier = localStorage.getItem("currentCashier");

  const handleAdminPanel = () => {
    navigate("/admin/login");
  };

  const handleUserLogin = () => {
    navigate("/user/login");
  };

  const handleDriverPanel = () => {
    navigate("/driver/login");
  };

  const handleCashierPanel = () => {
    navigate("/cashier/login");
  };

  const handleUserLogout = () => {
    localStorage.removeItem("userLoggedIn");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("currentUserData");
    window.location.reload();
  };

  const getCurrentUserDisplay = () => {
    if (isAdminLoggedIn) return "Admin";
    if (isDriverLoggedIn) return `Driver: ${currentDriver}`;
    if (isCashierLoggedIn) return `Kasir: ${currentCashier}`;
    if (isUserLoggedIn) return `User: ${currentUser}`;
    return null;
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Add dark mode logic here
  };

  const changeLanguage = (lang: string) => {
    setLanguage(lang);
    // Add language change logic here
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-white/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            {/* Settings Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="mr-4 hover:bg-primary/10">
                  <Menu size={20} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 bg-white border-2 border-gray-200 shadow-xl">
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="cursor-pointer hover:bg-gray-100 focus:bg-gray-100">
                    <Settings size={16} className="mr-2" />
                    Setting
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="bg-white border-2 border-gray-200 shadow-xl">
                    <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 focus:bg-gray-100">
                      <User size={16} className="mr-2" />
                      Pengaturan Akun
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 focus:bg-gray-100">
                      <RotateCcw size={16} className="mr-2" />
                      Transaksi
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 focus:bg-gray-100">
                      <Trash2 size={16} className="mr-2" />
                      Pengaturan Lanjutan
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="cursor-pointer hover:bg-gray-100 focus:bg-gray-100">
                    <Languages size={16} className="mr-2" />
                    Bahasa
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="bg-white border-2 border-gray-200 shadow-xl">
                    <DropdownMenuItem onClick={() => changeLanguage("id")} className="cursor-pointer hover:bg-gray-100 focus:bg-gray-100">
                      🇮🇩 Indonesia
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => changeLanguage("en")} className="cursor-pointer hover:bg-gray-100 focus:bg-gray-100">
                      🇺🇸 English
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuItem onClick={toggleDarkMode} className="cursor-pointer hover:bg-gray-100 focus:bg-gray-100">
                  {isDarkMode ? <Sun size={16} className="mr-2" /> : <Moon size={16} className="mr-2" />}
                  Mode Tampilan
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {isUserLoggedIn && (
                  <DropdownMenuItem onClick={handleUserLogout} className="cursor-pointer hover:bg-red-50 focus:bg-red-50 text-red-600">
                    <LogOut size={16} className="mr-2" />
                    LogOut
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 focus:bg-gray-100">
                  <UserPlus size={16} className="mr-2" />
                  Ganti Akun
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
              <Utensils className="h-8 w-8 text-primary mr-2" />
              <div className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                FoodOrder
              </div>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <button 
                onClick={() => setActiveTab('menu')}
                className={`hover:text-primary hover:bg-primary/10 transition-colors duration-200 flex items-center gap-2 px-3 py-2 rounded-lg ${
                  activeTab === 'menu' ? 'text-primary bg-primary/10' : 'text-gray-700'
                }`}
              >
                <Utensils size={18} />
                Menu
              </button>
              <button 
                onClick={() => setActiveTab('cart')}
                className={`hover:text-primary hover:bg-primary/10 transition-colors duration-200 flex items-center gap-2 relative px-3 py-2 rounded-lg ${
                  activeTab === 'cart' ? 'text-primary bg-primary/10' : 'text-gray-700'
                }`}
              >
                <ShoppingCart size={18} />
                Keranjang
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-lg">
                    {cartItemCount}
                  </span>
                )}
              </button>
              <button 
                onClick={() => setActiveTab('orders')}
                className={`hover:text-primary hover:bg-primary/10 transition-colors duration-200 flex items-center gap-2 px-3 py-2 rounded-lg ${
                  activeTab === 'orders' ? 'text-primary bg-primary/10' : 'text-gray-700'
                }`}
              >
                <Clock size={18} />
                Pesanan
              </button>
              
              {/* Current User Display */}
              {getCurrentUserDisplay() && (
                <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-lg">
                  <span className="text-sm font-medium text-primary">{getCurrentUserDisplay()}</span>
                </div>
              )}
              
              {!isUserLoggedIn && (
                <button 
                  onClick={handleUserLogin}
                  className="hover:text-primary hover:bg-primary/10 transition-colors duration-200 flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700"
                >
                  <User size={18} />
                  Login User
                </button>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 bg-white hover:bg-gray-50 border-2 border-primary/20 hover:border-primary/40">
                    <Shield size={18} />
                    Panel
                    <ChevronDown size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white border-2 border-gray-200 shadow-xl z-50">
                  <DropdownMenuItem onClick={handleCashierPanel} className="cursor-pointer hover:bg-orange-50 focus:bg-orange-50">
                    <CreditCard size={16} className="mr-2" />
                    Cashier Panel
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDriverPanel} className="cursor-pointer hover:bg-blue-50 focus:bg-blue-50">
                    <Truck size={16} className="mr-2" />
                    Driver Panel
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleAdminPanel} className="cursor-pointer hover:bg-green-50 focus:bg-green-50">
                    <Shield size={16} className="mr-2" />
                    Admin Panel
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur border-b border-white/20">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <button 
              onClick={() => { setActiveTab('menu'); setIsOpen(false); }}
              className={`block px-3 py-2 hover:text-primary hover:bg-primary/10 transition-colors w-full text-left rounded-lg ${
                activeTab === 'menu' ? 'text-primary bg-primary/10' : 'text-gray-700'
              }`}
            >
              Menu
            </button>
            <button 
              onClick={() => { setActiveTab('cart'); setIsOpen(false); }}
              className={`block px-3 py-2 hover:text-primary hover:bg-primary/10 transition-colors w-full text-left rounded-lg ${
                activeTab === 'cart' ? 'text-primary bg-primary/10' : 'text-gray-700'
              }`}
            >
              Keranjang {cartItemCount > 0 && `(${cartItemCount})`}
            </button>
            <button 
              onClick={() => { setActiveTab('orders'); setIsOpen(false); }}
              className={`block px-3 py-2 hover:text-primary hover:bg-primary/10 transition-colors w-full text-left rounded-lg ${
                activeTab === 'orders' ? 'text-primary bg-primary/10' : 'text-gray-700'
              }`}
            >
              Pesanan
            </button>
            
            {getCurrentUserDisplay() && (
              <div className="px-3 py-2">
                <span className="text-sm text-gray-600">{getCurrentUserDisplay()}</span>
              </div>
            )}
            
            {!isUserLoggedIn && (
              <button 
                onClick={() => { handleUserLogin(); setIsOpen(false); }}
                className="block px-3 py-2 hover:text-primary hover:bg-primary/10 transition-colors w-full text-left rounded-lg text-gray-700"
              >
                Login User
              </button>
            )}
            
            <button 
              onClick={() => { handleCashierPanel(); setIsOpen(false); }}
              className="block px-3 py-2 hover:text-orange-600 hover:bg-orange-50 transition-colors w-full text-left rounded-lg text-gray-700"
            >
              Cashier Panel
            </button>
            
            <button 
              onClick={() => { handleDriverPanel(); setIsOpen(false); }}
              className="block px-3 py-2 hover:text-blue-600 hover:bg-blue-50 transition-colors w-full text-left rounded-lg text-gray-700"
            >
              Driver Panel
            </button>
            
            <button 
              onClick={() => { handleAdminPanel(); setIsOpen(false); }}
              className="block px-3 py-2 hover:text-primary hover:bg-green-50 transition-colors w-full text-left rounded-lg text-gray-700"
            >
              Admin Panel
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
