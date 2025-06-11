import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Menu } from "@/components/Menu";
import { Cart } from "@/components/Cart";
import { OrderHistory } from "@/components/OrderHistory";
import { Footer } from "@/components/Footer";

export type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: 'food' | 'drink';
  image: string;
};

export type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

export type Order = {
  id: number;
  items: CartItem[];
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered';
  orderTime: Date;
  customerName: string;
  customerPhone: string;
};

const Index = () => {
  const [activeTab, setActiveTab] = useState<'menu' | 'cart' | 'orders'>('menu');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const addToCart = (item: MenuItem) => {
    setCartItems(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, quantity: 1 }];
    });
  };

  const updateCartQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      setCartItems(prev => prev.filter(item => item.id !== id));
    } else {
      setCartItems(prev =>
        prev.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const placeOrder = (customerName: string, customerPhone: string) => {
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const newOrder: Order = {
      id: Date.now(),
      items: [...cartItems],
      total,
      status: 'pending',
      orderTime: new Date(),
      customerName,
      customerPhone
    };
    setOrders(prev => [...prev, newOrder]);
    clearCart();
    setActiveTab('orders');
  };

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900">
      <Navigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        cartItemCount={cartItemCount}
      />
      
      <main className="pt-20 pb-8">
        {activeTab === 'menu' && (
          <Menu onAddToCart={addToCart} />
        )}
        
        {activeTab === 'cart' && (
          <Cart 
            items={cartItems}
            onUpdateQuantity={updateCartQuantity}
            onClearCart={clearCart}
            onPlaceOrder={placeOrder}
          />
        )}
        
        {activeTab === 'orders' && (
          <OrderHistory orders={orders} />
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
