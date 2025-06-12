
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Menu } from "@/components/Menu";
import { Cart } from "@/components/Cart";
import { OrderHistory } from "@/components/OrderHistory";
import { Footer } from "@/components/Footer";
import { UserChat } from "@/components/UserChat";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: 'food' | 'drink';
  image: string;
  rating?: number;
  reviews?: number;
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
  customerAddress?: string;
  paymentMethod?: string;
};

const Index = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'menu' | 'cart' | 'orders'>('menu');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if user is logged in for cart/orders access
  const isUserLoggedIn = localStorage.getItem("userLoggedIn");

  // Check URL parameters for tab
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'cart' || tab === 'orders') {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Load cart items from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cartItems");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart items to localStorage whenever cartItems changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Check for new notifications
  useEffect(() => {
    const checkNotifications = () => {
      const userNotifications = JSON.parse(localStorage.getItem("userNotifications") || "[]");
      const unreadNotifications = userNotifications.filter((notif: any) => !notif.read);
      setNotifications(unreadNotifications);
      
      if (unreadNotifications.length > 0) {
        setHasNewMessages(true);
      }
    };

    checkNotifications();
    const interval = setInterval(checkNotifications, 2000);
    return () => clearInterval(interval);
  }, []);

  // Show toast for new notifications
  useEffect(() => {
    if (notifications.length > 0) {
      const latestNotification = notifications[notifications.length - 1];
      toast({
        title: "Pesan Baru dari Admin",
        description: latestNotification.message,
      });
    }
  }, [notifications.length, toast]);

  const addToCart = (item: MenuItem) => {
    if (!isUserLoggedIn) {
      toast({
        title: "Login Diperlukan",
        description: "Anda harus login terlebih dahulu untuk menambahkan item ke keranjang",
        variant: "destructive"
      });
      navigate("/user/login");
      return;
    }

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

  const placeOrder = (customerName: string, customerPhone: string, customerAddress: string, paymentMethod: string) => {
    if (!isUserLoggedIn) {
      toast({
        title: "Login Diperlukan",
        description: "Anda harus login terlebih dahulu untuk memesan",
        variant: "destructive"
      });
      navigate("/user/login");
      return;
    }

    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const newOrder: Order = {
      id: Date.now(),
      items: [...cartItems],
      total,
      status: 'pending',
      orderTime: new Date(),
      customerName,
      customerPhone,
      customerAddress,
      paymentMethod
    };
    
    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    
    // Save to localStorage for admin dashboard
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    
    clearCart();
    setActiveTab('orders');
  };

  const handleTabChange = (tab: 'menu' | 'cart' | 'orders') => {
    if ((tab === 'cart' || tab === 'orders') && !isUserLoggedIn) {
      toast({
        title: "Login Diperlukan",
        description: "Anda harus login terlebih dahulu untuk mengakses fitur ini",
        variant: "destructive"
      });
      navigate("/user/login");
      return;
    }
    setActiveTab(tab);
  };

  const handleChatOpen = () => {
    setIsChatOpen(true);
    setHasNewMessages(false);
    
    // Mark notifications as read
    const userNotifications = JSON.parse(localStorage.getItem("userNotifications") || "[]");
    const updatedNotifications = userNotifications.map((notif: any) => ({ ...notif, read: true }));
    localStorage.setItem("userNotifications", JSON.stringify(updatedNotifications));
    setNotifications([]);
  };

  const handleNewMessage = () => {
    // This will be called when user sends a message
  };

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900">
      <Navigation 
        activeTab={activeTab} 
        setActiveTab={handleTabChange}
        cartItemCount={cartItemCount}
      />
      
      <main className="pt-20 pb-8">
        {activeTab === 'menu' && (
          <Menu onAddToCart={addToCart} />
        )}
        
        {activeTab === 'cart' && isUserLoggedIn && (
          <Cart 
            items={cartItems}
            onUpdateQuantity={updateCartQuantity}
            onClearCart={clearCart}
            onPlaceOrder={placeOrder}
          />
        )}
        
        {activeTab === 'orders' && isUserLoggedIn && (
          <OrderHistory orders={orders} />
        )}
      </main>

      {/* Chat Button */}
      <div className="fixed bottom-4 left-4 z-50">
        <Button
          onClick={handleChatOpen}
          className="bg-primary hover:bg-primary/90 text-white shadow-lg rounded-full w-12 h-12 p-0 relative"
        >
          <MessageCircle size={20} />
          {hasNewMessages && (
            <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full p-0 flex items-center justify-center">
              !
            </Badge>
          )}
        </Button>
      </div>

      {/* Notification Badge */}
      {notifications.length > 0 && (
        <div className="fixed top-20 right-4 z-50">
          <div className="bg-red-500 text-white px-3 py-2 rounded-lg shadow-lg flex items-center gap-2">
            <Bell size={16} />
            <span className="text-sm">{notifications.length} pesan baru</span>
          </div>
        </div>
      )}
      
      <UserChat 
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onNewMessage={handleNewMessage}
      />
      
      <Footer />
    </div>
  );
};

export default Index;
