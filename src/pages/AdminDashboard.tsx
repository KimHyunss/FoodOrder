
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { LogOut, Package, MessageCircle, Users, DollarSign, Home, Settings, Utensils, Palette, Phone, MapPin, CreditCard, User } from "lucide-react";
import { Order } from "@/pages/Index";
import { AdminChat } from "@/components/AdminChat";
import { MenuManagement } from "@/components/MenuManagement";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [backgroundImage, setBackgroundImage] = useState("");
  const [registeredUsers, setRegisteredUsers] = useState<any[]>([]);

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

    // Load background image
    const savedBackground = localStorage.getItem("backgroundImage");
    if (savedBackground) {
      setBackgroundImage(savedBackground);
    }

    // Load registered users
    const savedUsers = localStorage.getItem("registeredUsers");
    if (savedUsers) {
      setRegisteredUsers(JSON.parse(savedUsers));
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

  // Apply background image to body
  useEffect(() => {
    if (backgroundImage) {
      document.body.style.backgroundImage = `url(${backgroundImage})`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
      document.body.style.backgroundRepeat = 'no-repeat';
      document.body.style.backgroundAttachment = 'fixed';
    } else {
      document.body.style.backgroundImage = '';
    }

    return () => {
      document.body.style.backgroundImage = '';
    };
  }, [backgroundImage]);

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

  const handleBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setBackgroundImage(result);
        localStorage.setItem("backgroundImage", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeBackground = () => {
    setBackgroundImage("");
    localStorage.removeItem("backgroundImage");
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative">
      {/* Background overlay for better readability */}
      {backgroundImage && (
        <div className="fixed inset-0 bg-black/20 z-0"></div>
      )}
      
      <div className="relative z-10">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4 cursor-pointer" onClick={handleGoHome}>
                <Utensils className="h-8 w-8 text-primary" />
                <div className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  FoodOrder
                </div>
                <span className="text-gray-400">|</span>
                <h1 className="text-xl font-bold text-gray-800">Dashboard Admin</h1>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">Admin Panel</span>
                <Button variant="outline" onClick={handleLogout} className="gap-2">
                  <LogOut size={16} />
                  Logout
                </Button>
              </div>
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
            <TabsList className="grid w-full grid-cols-5 max-w-2xl bg-white/90">
              <TabsTrigger value="orders">Kelola Pesanan</TabsTrigger>
              <TabsTrigger value="chat">Chat Customer</TabsTrigger>
              <TabsTrigger value="menu">Kelola Menu</TabsTrigger>
              <TabsTrigger value="users">Akun User</TabsTrigger>
              <TabsTrigger value="settings">Pengaturan</TabsTrigger>
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
                            {order.status === 'preparing' && 'Dalam Perjalanan'}
                            {order.status === 'ready' && 'Siap Diambil'}
                            {order.status === 'delivered' && 'Selesai'}
                          </Badge>
                        </div>
                        <CardDescription>
                          <p>Waktu: {formatTime(order.orderTime)}</p>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {/* Customer Info */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <User size={16} className="text-gray-500" />
                                <span className="font-medium">Nama:</span>
                                <span>{order.customerName}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone size={16} className="text-gray-500" />
                                <span className="font-medium">Telepon:</span>
                                <span>{order.customerPhone}</span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <MapPin size={16} className="text-gray-500" />
                                <span className="font-medium">Alamat:</span>
                                <span>{order.customerAddress || 'Belum diisi'}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <CreditCard size={16} className="text-gray-500" />
                                <span className="font-medium">Pembayaran:</span>
                                <span>{order.paymentMethod || 'Belum dipilih'}</span>
                              </div>
                            </div>
                          </div>

                          {/* Order Items */}
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

            <TabsContent value="users" className="space-y-4">
              <Card className="bg-white/95 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users size={20} />
                    Akun Terdaftar ({registeredUsers.length})
                  </CardTitle>
                  <CardDescription>
                    Daftar semua user yang telah mendaftar
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {registeredUsers.length === 0 ? (
                    <div className="text-center py-8 text-gray-600">
                      Belum ada user yang mendaftar
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {registeredUsers.map((user, index) => (
                        <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                          {user.profileImage && (
                            <img 
                              src={user.profileImage} 
                              alt={user.username}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          )}
                          <div className="flex-1 space-y-1">
                            <div className="font-medium">{user.username}</div>
                            <div className="text-sm text-gray-600">{user.email}</div>
                            <div className="text-sm text-gray-600">{user.phone}</div>
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(user.signUpDate).toLocaleDateString('id-ID')}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card className="bg-white/95 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette size={20} />
                    Pengaturan Wallpaper
                  </CardTitle>
                  <CardDescription>
                    Ubah background untuk seluruh aplikasi
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="background">Upload Wallpaper Baru</Label>
                    <Input
                      id="background"
                      type="file"
                      accept="image/*"
                      onChange={handleBackgroundChange}
                    />
                  </div>
                  {backgroundImage && (
                    <div className="space-y-2">
                      <Label>Preview Wallpaper Saat Ini</Label>
                      <div className="w-full h-32 border rounded-lg overflow-hidden">
                        <img 
                          src={backgroundImage} 
                          alt="Background Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Button 
                        variant="destructive" 
                        onClick={removeBackground}
                        className="w-full"
                      >
                        Hapus Wallpaper
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
