
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ShoppingCart, Utensils, Clock, Shield, User, Truck, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type NavigationProps = {
  activeTab: 'menu' | 'cart' | 'orders';
  setActiveTab: (tab: 'menu' | 'cart' | 'orders') => void;
  cartItemCount: number;
};

export const Navigation = ({ activeTab, setActiveTab, cartItemCount }: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const isUserLoggedIn = localStorage.getItem("userLoggedIn");
  const currentUser = localStorage.getItem("currentUser");

  const handleAdminPanel = () => {
    navigate("/admin/login");
  };

  const handleUserLogin = () => {
    navigate("/user/login");
  };

  const handleDriverPanel = () => {
    navigate("/driver/login");
  };

  const handleUserLogout = () => {
    localStorage.removeItem("userLoggedIn");
    localStorage.removeItem("currentUser");
    window.location.reload();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-white/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
            <Utensils className="h-8 w-8 text-primary mr-2" />
            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              FoodOrder
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <button 
                onClick={() => setActiveTab('menu')}
                className={`hover:text-primary transition-colors duration-200 flex items-center gap-2 px-3 py-2 rounded-lg ${
                  activeTab === 'menu' ? 'text-primary bg-white/50' : 'text-gray-700'
                }`}
              >
                <Utensils size={18} />
                Menu
              </button>
              <button 
                onClick={() => setActiveTab('cart')}
                className={`hover:text-primary transition-colors duration-200 flex items-center gap-2 relative px-3 py-2 rounded-lg ${
                  activeTab === 'cart' ? 'text-primary bg-white/50' : 'text-gray-700'
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
                className={`hover:text-primary transition-colors duration-200 flex items-center gap-2 px-3 py-2 rounded-lg ${
                  activeTab === 'orders' ? 'text-primary bg-white/50' : 'text-gray-700'
                }`}
              >
                <Clock size={18} />
                Pesanan
              </button>
              
              {isUserLoggedIn ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">User: {currentUser}</span>
                  <Button variant="outline" size="sm" onClick={handleUserLogout}>
                    Logout
                  </Button>
                </div>
              ) : (
                <button 
                  onClick={handleUserLogin}
                  className="hover:text-primary transition-colors duration-200 flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700"
                >
                  <User size={18} />
                  Login User
                </button>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Shield size={18} />
                    Panel
                    <ChevronDown size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white border shadow-lg">
                  <DropdownMenuItem onClick={handleDriverPanel} className="cursor-pointer">
                    <Truck size={16} className="mr-2" />
                    Driver Panel
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleAdminPanel} className="cursor-pointer">
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
              className={`block px-3 py-2 hover:text-primary transition-colors w-full text-left rounded-lg ${
                activeTab === 'menu' ? 'text-primary bg-white/50' : 'text-gray-700'
              }`}
            >
              Menu
            </button>
            <button 
              onClick={() => { setActiveTab('cart'); setIsOpen(false); }}
              className={`block px-3 py-2 hover:text-primary transition-colors w-full text-left rounded-lg ${
                activeTab === 'cart' ? 'text-primary bg-white/50' : 'text-gray-700'
              }`}
            >
              Keranjang {cartItemCount > 0 && `(${cartItemCount})`}
            </button>
            <button 
              onClick={() => { setActiveTab('orders'); setIsOpen(false); }}
              className={`block px-3 py-2 hover:text-primary transition-colors w-full text-left rounded-lg ${
                activeTab === 'orders' ? 'text-primary bg-white/50' : 'text-gray-700'
              }`}
            >
              Pesanan
            </button>
            
            {isUserLoggedIn ? (
              <div className="px-3 py-2">
                <span className="text-sm text-gray-600 block mb-2">User: {currentUser}</span>
                <Button variant="outline" size="sm" onClick={handleUserLogout} className="w-full">
                  Logout
                </Button>
              </div>
            ) : (
              <button 
                onClick={() => { handleUserLogin(); setIsOpen(false); }}
                className="block px-3 py-2 hover:text-primary transition-colors w-full text-left rounded-lg text-gray-700"
              >
                Login User
              </button>
            )}
            
            <button 
              onClick={() => { handleDriverPanel(); setIsOpen(false); }}
              className="block px-3 py-2 hover:text-blue-600 transition-colors w-full text-left rounded-lg text-gray-700"
            >
              Driver Panel
            </button>
            
            <button 
              onClick={() => { handleAdminPanel(); setIsOpen(false); }}
              className="block px-3 py-2 hover:text-primary transition-colors w-full text-left rounded-lg text-gray-700"
            >
              Admin Panel
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
