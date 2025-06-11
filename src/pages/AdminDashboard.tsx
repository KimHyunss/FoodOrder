
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { LogOut, Package, MessageCircle, Users, DollarSign, Home, Settings } from "lucide-react";
import { Order } from "@/pages/Index";
import { AdminChat } from "@/components/AdminChat";
import { MenuManagement } from "@/components/MenuManagement";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const adminAuth = localStorage.getItem("adminAuth");
    if (!adminAuth) {
      navigate("/admin/login");
      return;
    }

    // Load orders from localStorage
    const savedOrders = localStorage.getItem("orders");
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }

    // Check for new orders every 2 seconds
    const interval = setInterval(() => {
      const currentOrders = localStorage.getItem("orders");
      if (currentOrders) {
        setOrders(JSON.parse(currentOrders));
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    navigate("/admin/login");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const updateOrderStatus = (orderId: number, newStatus: Order['status']) => {
    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const getStatusVariant = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'preparing': return 'default';
      case 'ready': return 'default';
      case 'delivered': return 'secondary';
      default: return 'secondary';
    }
  };

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter(order => order.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={handleGoHome} 
                className="text-xl font-bold text-primary hover:text-primary/80 gap-2"
              >
                <Home size={20} />
                FoodOrder
              </Button>
              <span className="text-gray-400">|</span>
              <h1 className="text-xl font-bold text-gray-800">Dashboard Admin</h1>
            </div>
            <Button variant="outline" onClick={handleLogout} className="gap-2">
              <LogOut size={16} />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/95 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Pesanan</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">{orders.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pesanan Pending</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">{pendingOrders}</div>
              {pendingOrders > 0 && (
                <Badge className="mt-2 bg-red-100 text-red-700">Perlu Perhatian!</Badge>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Pendapatan</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">{formatPrice(totalRevenue)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="orders" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 max-w-lg">
            <TabsTrigger value="orders">Kelola Pesanan</TabsTrigger>
            <TabsTrigger value="chat">Chat Customer</TabsTrigger>
            <TabsTrigger value="menu">Kelola Menu</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4">
            {orders.length === 0 ? (
              <Card className="bg-white/95 backdrop-blur">
                <CardContent className="py-16 text-center">
                  <Package size={64} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Belum Ada Pesanan</h3>
                  <p className="text-gray-600">Pesanan dari customer akan muncul di sini</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id} className="bg-white/95 backdrop-blur">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-gray-800">
                          Pesanan #{order.id}
                        </CardTitle>
                        <Badge variant={getStatusVariant(order.status)}>
                          {order.status === 'pending' && 'Menunggu Konfirmasi'}
                          {order.status === 'preparing' && 'Sedang Diproses'}
                          {order.status === 'ready' && 'Siap Diambil'}
                          {order.status === 'delivered' && 'Selesai'}
                        </Badge>
                      </div>
                      <CardDescription>
                        <p>Waktu: {formatTime(order.orderTime)}</p>
                        <p>Customer: {order.customerName} - {order.customerPhone}</p>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                            <div>
                              <span className="font-medium text-gray-800">{item.name}</span>
                              <span className="text-gray-600 ml-2">x{item.quantity}</span>
                            </div>
                            <span className="font-semibold text-gray-800">{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        ))}
                        <div className="flex justify-between items-center pt-3 text-lg font-bold border-t">
                          <span className="text-gray-800">Total:</span>
                          <span className="text-primary">{formatPrice(order.total)}</span>
                        </div>
                        <div className="flex gap-2 pt-4">
                          {order.status === 'pending' && (
                            <Button 
                              onClick={() => updateOrderStatus(order.id, 'preparing')}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              Terima Pesanan
                            </Button>
                          )}
                          {order.status === 'preparing' && (
                            <Button 
                              onClick={() => updateOrderStatus(order.id, 'ready')}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Siap Diambil
                            </Button>
                          )}
                          {order.status === 'ready' && (
                            <Button 
                              onClick={() => updateOrderStatus(order.id, 'delivered')}
                              className="bg-gray-600 hover:bg-gray-700"
                            >
                              Selesai
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="chat">
            <AdminChat />
          </TabsContent>

          <TabsContent value="menu">
            <MenuManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
