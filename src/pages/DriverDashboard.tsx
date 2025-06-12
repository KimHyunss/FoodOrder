
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Truck, ArrowLeft, MapPin, Phone, User, CreditCard, CheckCircle } from "lucide-react";
import { Order } from "@/pages/Index";

const DriverDashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [driverOrders, setDriverOrders] = useState<any[]>([]);
  const navigate = useNavigate();
  const currentDriver = localStorage.getItem("currentDriver");

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("driverLoggedIn");
    if (!isLoggedIn) {
      navigate("/driver/login");
      return;
    }

    // Load orders
    const savedOrders = localStorage.getItem("orders");
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }

    // Load driver's taken orders
    const savedDriverOrders = localStorage.getItem("driverOrders");
    if (savedDriverOrders) {
      setDriverOrders(JSON.parse(savedDriverOrders));
    }
  }, [navigate]);

  const takeOrder = (order: Order) => {
    const driverOrder = {
      ...order,
      driverId: currentDriver,
      takenAt: new Date(),
      status: 'picked_up'
    };

    const updatedDriverOrders = [...driverOrders, driverOrder];
    setDriverOrders(updatedDriverOrders);
    localStorage.setItem("driverOrders", JSON.stringify(updatedDriverOrders));

    // Update order status
    const updatedOrders = orders.map(o => 
      o.id === order.id ? { ...o, status: 'preparing' as const } : o
    );
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
  };

  const completeDelivery = (orderId: number) => {
    const updatedDriverOrders = driverOrders.map(order =>
      order.id === orderId ? { ...order, status: 'delivered' } : order
    );
    setDriverOrders(updatedDriverOrders);
    localStorage.setItem("driverOrders", JSON.stringify(updatedDriverOrders));

    // Update main orders
    const updatedOrders = orders.map(o => 
      o.id === orderId ? { ...o, status: 'delivered' as const } : o
    );
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
  };

  const handleLogout = () => {
    localStorage.removeItem("driverLoggedIn");
    localStorage.removeItem("currentDriver");
    navigate("/");
  };

  const availableOrders = orders.filter(order => 
    order.status === 'ready' && !driverOrders.some(driverOrder => driverOrder.id === order.id)
  );

  const myOrders = driverOrders.filter(order => order.driverId === currentDriver);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Header */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
              <Truck className="h-8 w-8 text-blue-600 mr-2" />
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                Driver Panel
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">Driver: {currentDriver}</span>
              <Button variant="outline" onClick={() => navigate("/")} className="gap-2">
                <ArrowLeft size={16} />
                Home
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Available Orders */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Pesanan Tersedia</h2>
            <div className="space-y-4">
              {availableOrders.map((order) => (
                <Card key={order.id} className="bg-white/95 backdrop-blur">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-gray-900">Pesanan #{order.id}</CardTitle>
                      <Badge className="bg-green-100 text-green-800">Siap Diambil</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-gray-500" />
                      <span className="text-gray-700">{order.customerName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-gray-500" />
                      <span className="text-gray-700">{order.customerPhone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-gray-500" />
                      <span className="text-gray-700">{order.customerAddress || 'Alamat belum lengkap'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard size={16} className="text-gray-500" />
                      <span className="text-gray-700">{order.paymentMethod || 'Metode pembayaran belum dipilih'}</span>
                    </div>
                    <div className="text-lg font-bold text-primary">
                      Total: {formatPrice(order.total)}
                    </div>
                    <Button 
                      onClick={() => takeOrder(order)} 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      Ambil Pesanan
                    </Button>
                  </CardContent>
                </Card>
              ))}
              {availableOrders.length === 0 && (
                <Card className="bg-white/95 backdrop-blur">
                  <CardContent className="py-8 text-center text-gray-600">
                    Tidak ada pesanan yang tersedia saat ini
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* My Orders */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Pesanan Saya</h2>
            <div className="space-y-4">
              {myOrders.map((order) => (
                <Card key={order.id} className="bg-white/95 backdrop-blur">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-gray-900">Pesanan #{order.id}</CardTitle>
                      <Badge variant={order.status === 'delivered' ? 'secondary' : 'default'}>
                        {order.status === 'delivered' ? 'Selesai' : 'Dalam Perjalanan'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-gray-500" />
                      <span className="text-gray-700">{order.customerName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-gray-500" />
                      <span className="text-gray-700">{order.customerPhone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-gray-500" />
                      <span className="text-gray-700">{order.customerAddress || 'Alamat belum lengkap'}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Diambil: {formatTime(order.takenAt)}
                    </div>
                    <div className="text-lg font-bold text-primary">
                      Total: {formatPrice(order.total)}
                    </div>
                    {order.status !== 'delivered' && (
                      <Button 
                        onClick={() => completeDelivery(order.id)} 
                        className="w-full gap-2 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle size={16} />
                        Selesaikan Pengiriman
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
              {myOrders.length === 0 && (
                <Card className="bg-white/95 backdrop-blur">
                  <CardContent className="py-8 text-center text-gray-600">
                    Anda belum mengambil pesanan apapun
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
