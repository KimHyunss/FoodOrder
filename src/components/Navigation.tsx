import { useState, useEffect } from "react";
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

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const savedLanguage = localStorage.getItem("language");
    
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
    
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

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
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    if (newMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const changeLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const getLanguageText = () => {
    if (language === "en") {
      return {
        menu: "Menu",
        cart: "Cart", 
        orders: "Orders",
        login: "Login User",
        panel: "Panel",
        settings: "Settings",
        language: "Language",
        displayMode: "Display Mode",
        logout: "Logout",
        switchAccount: "Switch Account",
        accountSettings: "Account Settings",
        transactions: "Transactions", 
        advancedSettings: "Advanced Settings"
      };
    }
    return {
      menu: "Menu",
      cart: "Keranjang",
      orders: "Pesanan", 
      login: "Login User",
      panel: "Panel",
      settings: "Setting",
      language: "Bahasa",
      displayMode: "Mode Tampilan",
      logout: "LogOut",
      switchAccount: "Ganti Akun",
      accountSettings: "Pengaturan Akun",
      transactions: "Transaksi",
      advancedSettings: "Pengaturan Lanjutan"
    };
  };

  const text = getLanguageText();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md border-b border-white/20 dark:border-gray-700/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            {/* Settings Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="mr-4 hover:bg-primary/20 dark:hover:bg-primary/30 text-gray-700 dark:text-gray-200">
                  <Menu size={20} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 shadow-xl z-[9999]">
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 text-gray-700 dark:text-gray-200">
                    <Settings size={16} className="mr-2" />
                    {text.settings}
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 shadow-xl z-[9999]">
                    <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 text-gray-700 dark:text-gray-200">
                      <User size={16} className="mr-2" />
                      {text.accountSettings}
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 text-gray-700 dark:text-gray-200">
                      <RotateCcw size={16} className="mr-2" />
                      {text.transactions}
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 text-gray-700 dark:text-gray-200">
                      <Trash2 size={16} className="mr-2" />
                      {text.advancedSettings}
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 text-gray-700 dark:text-gray-200">
                    <Languages size={16} className="mr-2" />
                    {text.language}
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 shadow-xl z-[9999]">
                    <DropdownMenuItem onClick={() => changeLanguage("id")} className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 text-gray-700 dark:text-gray-200">
                      🇮🇩 Indonesia
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => changeLanguage("en")} className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 text-gray-700 dark:text-gray-200">
                      🇺🇸 English
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuItem onClick={toggleDarkMode} className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 text-gray-700 dark:text-gray-200">
                  {isDarkMode ? <Sun size={16} className="mr-2" /> : <Moon size={16} className="mr-2" />}
                  {text.displayMode}
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-600" />

                {isUserLoggedIn && (
                  <DropdownMenuItem onClick={handleUserLogout} className="cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20 focus:bg-red-50 dark:focus:bg-red-900/20 text-red-600 dark:text-red-400">
                    <LogOut size={16} className="mr-2" />
                    {text.logout}
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 text-gray-700 dark:text-gray-200">
                  <UserPlus size={16} className="mr-2" />
                  {text.switchAccount}
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
                className={`hover:text-primary hover:bg-primary/20 transition-colors duration-200 flex items-center gap-2 px-3 py-2 rounded-lg ${
                  activeTab === 'menu' ? 'text-primary bg-primary/20' : 'text-gray-700 dark:text-gray-200'
                }`}
              >
                <Utensils size={18} />
                {text.menu}
              </button>
              <button 
                onClick={() => setActiveTab('cart')}
                className={`hover:text-primary hover:bg-primary/20 transition-colors duration-200 flex items-center gap-2 relative px-3 py-2 rounded-lg ${
                  activeTab === 'cart' ? 'text-primary bg-primary/20' : 'text-gray-700 dark:text-gray-200'
                }`}
              >
                <ShoppingCart size={18} />
                {text.cart}
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-lg">
                    {cartItemCount}
                  </span>
                )}
              </button>
              <button 
                onClick={() => setActiveTab('orders')}
                className={`hover:text-primary hover:bg-primary/20 transition-colors duration-200 flex items-center gap-2 px-3 py-2 rounded-lg ${
                  activeTab === 'orders' ? 'text-primary bg-primary/20' : 'text-gray-700 dark:text-gray-200'
                }`}
              >
                <Clock size={18} />
                {text.orders}
              </button>
              
              {/* Current User Display */}
              {getCurrentUserDisplay() && (
                <div className="flex items-center gap-2 px-3 py-2 bg-primary/20 rounded-lg">
                  <span className="text-sm font-medium text-primary dark:text-primary-foreground">{getCurrentUserDisplay()}</span>
                </div>
              )}
              
              {!isUserLoggedIn && (
                <button 
                  onClick={handleUserLogin}
                  className="hover:text-primary hover:bg-primary/20 transition-colors duration-200 flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-200"
                >
                  <User size={18} />
                  {text.login}
                </button>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 bg-white/90 dark:bg-gray-800/90 hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-primary/20 dark:border-primary/40 hover:border-primary/40 dark:hover:border-primary/60 text-gray-700 dark:text-gray-200">
                    <Shield size={18} />
                    {text.panel}
                    <ChevronDown size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 shadow-xl z-[9999]">
                  <DropdownMenuItem onClick={handleCashierPanel} className="cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-900/20 focus:bg-orange-50 dark:focus:bg-orange-900/20 text-gray-700 dark:text-gray-200">
                    <CreditCard size={16} className="mr-2" />
                    Cashier Panel
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDriverPanel} className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 focus:bg-blue-50 dark:focus:bg-blue-900/20 text-gray-700 dark:text-gray-200">
                    <Truck size={16} className="mr-2" />
                    Driver Panel
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleAdminPanel} className="cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/20 focus:bg-green-50 dark:focus:bg-green-900/20 text-gray-700 dark:text-gray-200">
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
              className="text-gray-700 dark:text-gray-200"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur border-b border-white/20 dark:border-gray-700/20">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <button 
              onClick={() => { setActiveTab('menu'); setIsOpen(false); }}
              className={`block px-3 py-2 hover:text-primary hover:bg-primary/10 transition-colors w-full text-left rounded-lg ${
                activeTab === 'menu' ? 'text-primary bg-primary/10' : 'text-gray-700 dark:text-gray-200'
              }`}
            >
              {text.menu}
            </button>
            <button 
              onClick={() => { setActiveTab('cart'); setIsOpen(false); }}
              className={`block px-3 py-2 hover:text-primary hover:bg-primary/10 transition-colors w-full text-left rounded-lg ${
                activeTab === 'cart' ? 'text-primary bg-primary/10' : 'text-gray-700 dark:text-gray-200'
              }`}
            >
              {text.cart} {cartItemCount > 0 && `(${cartItemCount})`}
            </button>
            <button 
              onClick={() => { setActiveTab('orders'); setIsOpen(false); }}
              className={`block px-3 py-2 hover:text-primary hover:bg-primary/10 transition-colors w-full text-left rounded-lg ${
                activeTab === 'orders' ? 'text-primary bg-primary/10' : 'text-gray-700 dark:text-gray-200'
              }`}
            >
              {text.orders}
            </button>
            
            {getCurrentUserDisplay() && (
              <div className="px-3 py-2">
                <span className="text-sm text-gray-600">{getCurrentUserDisplay()}</span>
              </div>
            )}
            
            {!isUserLoggedIn && (
              <button 
                onClick={() => { handleUserLogin(); setIsOpen(false); }}
                className="block px-3 py-2 hover:text-primary hover:bg-primary/10 transition-colors w-full text-left rounded-lg text-gray-700 dark:text-gray-200"
              >
                {text.login}
              </button>
            )}
            
            <button 
              onClick={() => { handleCashierPanel(); setIsOpen(false); }}
              className="block px-3 py-2 hover:text-orange-600 hover:bg-orange-50 transition-colors w-full text-left rounded-lg text-gray-700 dark:text-gray-200"
            >
              Cashier Panel
            </button>
            
            <button 
              onClick={() => { handleDriverPanel(); setIsOpen(false); }}
              className="block px-3 py-2 hover:text-blue-600 hover:bg-blue-50 transition-colors w-full text-left rounded-lg text-gray-700 dark:text-gray-200"
            >
              Driver Panel
            </button>
            
            <button 
              onClick={() => { handleAdminPanel(); setIsOpen(false); }}
              className="block px-3 py-2 hover:text-primary hover:bg-green-50 transition-colors w-full text-left rounded-lg text-gray-700 dark:text-gray-200"
            >
              Admin Panel
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
