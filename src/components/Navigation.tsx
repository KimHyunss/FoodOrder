
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ShoppingCart, Utensils, Clock } from "lucide-react";

type NavigationProps = {
  activeTab: 'menu' | 'cart' | 'orders';
  setActiveTab: (tab: 'menu' | 'cart' | 'orders') => void;
  cartItemCount: number;
};

export const Navigation = ({ activeTab, setActiveTab, cartItemCount }: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Utensils className="h-8 w-8 text-primary mr-2" />
            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              FoodOrder
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <button 
                onClick={() => setActiveTab('menu')}
                className={`hover:text-primary transition-colors duration-200 flex items-center gap-2 ${
                  activeTab === 'menu' ? 'text-primary' : ''
                }`}
              >
                <Utensils size={18} />
                Menu
              </button>
              <button 
                onClick={() => setActiveTab('cart')}
                className={`hover:text-primary transition-colors duration-200 flex items-center gap-2 relative ${
                  activeTab === 'cart' ? 'text-primary' : ''
                }`}
              >
                <ShoppingCart size={18} />
                Keranjang
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
              <button 
                onClick={() => setActiveTab('orders')}
                className={`hover:text-primary transition-colors duration-200 flex items-center gap-2 ${
                  activeTab === 'orders' ? 'text-primary' : ''
                }`}
              >
                <Clock size={18} />
                Pesanan
              </button>
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
        <div className="md:hidden bg-background border-b border-border">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <button 
              onClick={() => { setActiveTab('menu'); setIsOpen(false); }}
              className={`block px-3 py-2 hover:text-primary transition-colors w-full text-left ${
                activeTab === 'menu' ? 'text-primary' : ''
              }`}
            >
              Menu
            </button>
            <button 
              onClick={() => { setActiveTab('cart'); setIsOpen(false); }}
              className={`block px-3 py-2 hover:text-primary transition-colors w-full text-left ${
                activeTab === 'cart' ? 'text-primary' : ''
              }`}
            >
              Keranjang {cartItemCount > 0 && `(${cartItemCount})`}
            </button>
            <button 
              onClick={() => { setActiveTab('orders'); setIsOpen(false); }}
              className={`block px-3 py-2 hover:text-primary transition-colors w-full text-left ${
                activeTab === 'orders' ? 'text-primary' : ''
              }`}
            >
              Pesanan
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
