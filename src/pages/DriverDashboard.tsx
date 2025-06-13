
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Truck, ArrowLeft, MapPin, Phone, User, CreditCard, CheckCircle, Wallet, DollarSign } from "lucide-react";
import { Order } from "@/pages/Index";

const DriverDashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [driverOrders, setDriverOrders] = useState<any[]>([]);
  const [earnings, setEarnings] = useState(0);
  const [language, setLanguage] = useState("id");
  const navigate = useNavigate();
  const currentDriver = localStorage.getItem("currentDriver");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

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

    // Load driver earnings
    const savedEarnings = localStorage.getItem(`earnings_${currentDriver}`);
    if (savedEarnings) {
      setEarnings(Number(savedEarnings));
    }
  }, [navigate, currentDriver]);

  const getLanguageText = () => {
    if (language === "en") {
      return {
        driverPanel: "Driver Panel",
        driver: "Driver",
        home: "Home",
        logout: "Logout",
        orders: "Orders",
        myOrders: "My Orders",
        wallet: "Wallet",
        availableOrders: "Available Orders",
        order: "Order",
        readyToPickup: "Ready to Pickup",
        takeOrder: "Take Order",
        noAvailableOrders: "No available orders at the moment",
        completed: "Completed",
        inDelivery: "In Delivery",
        takenAt: "Taken at",
        completeDelivery: "Complete Delivery",
        noOrdersTaken: "You haven't taken any orders yet",
        yourBalance: "Your Balance",
        totalEarningsFromDelivery: "Total earnings from delivery",
        commissionPerDelivery: "Commission per Delivery",
        percentOfOrder: "10% of order total",
        deliveriesCompleted: "Deliveries Completed",
        orders2: "orders",
        withdrawBalance: "Withdraw Balance",
        completeDeliveriesToEarn: "Complete deliveries to earn commission",
        total: "Total",
        commission: "Commission"
      };
    }
    return {
      driverPanel: "Panel Driver",
      driver: "Driver",
      home: "Home",
      logout: "Logout",
      orders: "Pesanan",
      myOrders: "Pesanan Saya",
      wallet: "Wallet",
      availableOrders: "Pesanan Tersedia",
      order: "Pesanan",
      readyToPickup: "Siap Diambil",
      takeOrder: "Ambil Pesanan",
      noAvailableOrders: "Tidak ada pesanan yang tersedia saat ini",
      completed: "Selesai",
      inDelivery: "Dalam Perjalanan",
      takenAt: "Diambil",
      completeDelivery: "Selesaikan Pengiriman",
      noOrdersTaken: "Anda belum mengambil pesanan apapun",
      yourBalance: "Saldo Anda",
      totalEarningsFromDelivery: "Total pendapatan dari pengiriman",
      commissionPerDelivery: "Komisi per Pengiriman",
      percentOfOrder: "10% dari total pesanan",
      deliveriesCompleted: "Pengiriman Selesai",
      orders2: "pesanan",
      withdrawBalance: "Tarik Saldo",
      completeDeliveriesToEarn: "Selesaikan pengiriman untuk mendapat komisi",
      total: "Total",
      commission: "Komisi"
    };
  };

  const text = getLanguageText();

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

    // Update order status to 'preparing' (Dalam Perjalanan)
    const updatedOrders = orders.map(o => 
      o.id === order.id ? { ...o, status: 'preparing' as const } : o
    );
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
  };

  const completeDelivery = (orderId: number) => {
    const order = driverOrders.find(o => o.id === orderId);
    if (order) {
      // Calculate earnings (10% of order total)
      const commission = order.total * 0.1;
      const newEarnings = earnings + commission;
      setEarnings(newEarnings);
      localStorage.setItem(`earnings_${currentDriver}`, newEarnings.toString());
    }

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

  const withdrawEarnings = () => {
    if (earnings === 0) return;
    
    // Here you would implement withdrawal logic
    alert(`${language === "en" ? "Withdrawal" : "Penarikan"} ${formatPrice(earnings)} ${language === "en" ? "successful! Funds will be transferred to your account." : "berhasil! Dana akan ditransfer ke rekening Anda."}`);
    
    // Reset earnings
    setEarnings(0);
    localStorage.setItem(`earnings_${currentDriver}`, "0");
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-blue-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <nav className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-b border-white/20 dark:border-gray-700/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
              <Truck className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-2" />
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                {text.driverPanel}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-700 dark:text-gray-300">{text.driver}: {currentDriver}</span>
              <Button variant="outline" onClick={() => navigate("/")} className="gap-2 dark:border-gray-600 dark:text-gray-300">
                <ArrowLeft size={16} />
                {text.home}
              </Button>
              <Button variant="outline" onClick={handleLogout} className="dark:border-gray-600 dark:text-gray-300">
                {text.logout}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-lg bg-white/90 dark:bg-gray-800/90">
            <TabsTrigger value="orders" className="dark:text-gray-300">{text.orders}</TabsTrigger>
            <TabsTrigger value="myorders" className="dark:text-gray-300">{text.myOrders}</TabsTrigger>
            <TabsTrigger value="wallet" className="dark:text-gray-300">{text.wallet}</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">{text.availableOrders}</h2>
            <div className="space-y-4">
              {availableOrders.map((order) => (
                <Card key={order.id} className="bg-white/95 dark:bg-gray-800/95 backdrop-blur">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-gray-900 dark:text-gray-100">{text.order} #{order.id}</CardTitle>
                      <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">{text.readyToPickup}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-gray-500 dark:text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">{order.customerName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-gray-500 dark:text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">{order.customerPhone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-gray-500 dark:text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">{order.customerAddress || (language === "en" ? "Address not complete" : "Alamat belum lengkap")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard size={16} className="text-gray-500 dark:text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">{order.paymentMethod || (language === "en" ? "Payment method not selected" : "Metode pembayaran belum dipilih")}</span>
                    </div>
                    <div className="text-lg font-bold text-primary dark:text-primary-foreground">
                      {text.total}: {formatPrice(order.total)}
                    </div>
                    <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                      {text.commission}: {formatPrice(order.total * 0.1)} (10%)
                    </div>
                    <Button 
                      onClick={() => takeOrder(order)} 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      {text.takeOrder}
                    </Button>
                  </CardContent>
                </Card>
              ))}
              {availableOrders.length === 0 && (
                <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur">
                  <CardContent className="py-8 text-center text-gray-600 dark:text-gray-400">
                    {text.noAvailableOrders}
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="myorders" className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">{text.myOrders}</h2>
            <div className="space-y-4">
              {myOrders.map((order) => (
                <Card key={order.id} className="bg-white/95 dark:bg-gray-800/95 backdrop-blur">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-gray-900 dark:text-gray-100">{text.order} #{order.id}</CardTitle>
                      <Badge variant={order.status === 'delivered' ? 'secondary' : 'default'}>
                        {order.status === 'delivered' ? text.completed : text.inDelivery}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-gray-500 dark:text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">{order.customerName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-gray-500 dark:text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">{order.customerPhone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-gray-500 dark:text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">{order.customerAddress || (language === "en" ? "Address not complete" : "Alamat belum lengkap")}</span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {text.takenAt}: {formatTime(order.takenAt)}
                    </div>
                    <div className="text-lg font-bold text-primary dark:text-primary-foreground">
                      {text.total}: {formatPrice(order.total)}
                    </div>
                    {order.status !== 'delivered' && (
                      <Button 
                        onClick={() => completeDelivery(order.id)} 
                        className="w-full gap-2 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle size={16} />
                        {text.completeDelivery}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
              {myOrders.length === 0 && (
                <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur">
                  <CardContent className="py-8 text-center text-gray-600 dark:text-gray-400">
                    {text.noOrdersTaken}
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="wallet" className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">{text.wallet} {text.driver}</h2>
            <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 dark:text-gray-100">
                  <Wallet size={20} />
                  {text.yourBalance}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                    {formatPrice(earnings)}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">{text.totalEarningsFromDelivery}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign size={16} className="text-blue-600 dark:text-blue-400" />
                      <span className="font-medium dark:text-gray-200">{text.commissionPerDelivery}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{text.percentOfOrder}</p>
                  </div>
                  
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle size={16} className="text-green-600 dark:text-green-400" />
                      <span className="font-medium dark:text-gray-200">{text.deliveriesCompleted}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {myOrders.filter(order => order.status === 'delivered').length} {text.orders2}
                    </p>
                  </div>
                </div>

                <Button 
                  onClick={withdrawEarnings}
                  disabled={earnings === 0}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50"
                >
                  <Wallet size={16} className="mr-2" />
                  {text.withdrawBalance}
                </Button>

                {earnings === 0 && (
                  <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
                    {text.completeDeliveriesToEarn}
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DriverDashboard;
