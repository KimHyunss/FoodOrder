
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CreditCard, ArrowLeft, User, MapPin, Trash2, Edit, Plus, ShoppingCart } from "lucide-react";
import { MenuItem, CartItem } from "@/pages/Index";
import { useToast } from "@/hooks/use-toast";

const CashierDashboard = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [newItem, setNewItem] = useState({ name: "", description: "", price: 0, category: "food" as "food" | "drink", image: "" });
  const navigate = useNavigate();
  const { toast } = useToast();
  const currentCashier = localStorage.getItem("currentCashier");

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("cashierLoggedIn");
    if (!isLoggedIn) {
      navigate("/cashier/login");
      return;
    }

    // Load menu items
    const defaultMenuItems: MenuItem[] = [
      { id: 1, name: "Nasi Goreng Spesial", description: "Nasi goreng dengan telur, ayam, dan sayuran segar", price: 25000, category: "food", image: "/placeholder.svg", rating: 4.5, reviews: 120 },
      { id: 2, name: "Mie Ayam Bakso", description: "Mie ayam dengan bakso sapi dan pangsit goreng", price: 20000, category: "food", image: "/placeholder.svg", rating: 4.7, reviews: 89 },
      { id: 3, name: "Es Teh Manis", description: "Teh manis dingin yang menyegarkan", price: 8000, category: "drink", image: "/placeholder.svg", rating: 4.2, reviews: 65 },
      { id: 4, name: "Jus Jeruk Segar", description: "Jus jeruk asli tanpa pengawet", price: 15000, category: "drink", image: "/placeholder.svg", rating: 4.6, reviews: 43 }
    ];

    const savedMenuItems = localStorage.getItem("menuItems");
    if (savedMenuItems) {
      setMenuItems(JSON.parse(savedMenuItems));
    } else {
      setMenuItems(defaultMenuItems);
      localStorage.setItem("menuItems", JSON.stringify(defaultMenuItems));
    }
  }, [navigate]);

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

  const saveMenuItem = () => {
    if (editingItem) {
      const updatedItems = menuItems.map(item =>
        item.id === editingItem.id ? editingItem : item
      );
      setMenuItems(updatedItems);
      localStorage.setItem("menuItems", JSON.stringify(updatedItems));
      setEditingItem(null);
    } else if (newItem.name && newItem.price > 0) {
      const newMenuItem: MenuItem = {
        ...newItem,
        id: Date.now(),
        image: "/placeholder.svg",
        rating: 0,
        reviews: 0
      };
      const updatedItems = [...menuItems, newMenuItem];
      setMenuItems(updatedItems);
      localStorage.setItem("menuItems", JSON.stringify(updatedItems));
      setNewItem({ name: "", description: "", price: 0, category: "food", image: "" });
    }
  };

  const deleteMenuItem = (id: number) => {
    const updatedItems = menuItems.filter(item => item.id !== id);
    setMenuItems(updatedItems);
    localStorage.setItem("menuItems", JSON.stringify(updatedItems));
  };

  const processOrder = () => {
    if (!customerName || !tableNumber || !paymentMethod || cartItems.length === 0) {
      toast({
        title: "Data tidak lengkap",
        description: "Mohon lengkapi semua data pesanan",
        variant: "destructive"
      });
      return;
    }

    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const newOrder = {
      id: Date.now(),
      items: [...cartItems],
      total,
      status: 'preparing',
      orderTime: new Date(),
      customerName,
      customerPhone: "Meja " + tableNumber,
      customerAddress: `Meja ${tableNumber}`,
      paymentMethod,
      orderType: 'dine-in'
    };

    const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    const updatedOrders = [...existingOrders, newOrder];
    localStorage.setItem("orders", JSON.stringify(updatedOrders));

    toast({
      title: "Pesanan berhasil!",
      description: `Pesanan untuk ${customerName} di meja ${tableNumber} telah diproses`,
    });

    // Reset form
    setCartItems([]);
    setCustomerName("");
    setTableNumber("");
    setPaymentMethod("");
  };

  const handleLogout = () => {
    localStorage.removeItem("cashierLoggedIn");
    localStorage.removeItem("currentCashier");
    navigate("/");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
              <CreditCard className="h-8 w-8 text-orange-600 mr-2" />
              <div className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
                Kasir Panel
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">Selamat datang, {currentCashier}</span>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu Management */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Kelola Menu</h2>
              
              {/* Add New Item Form */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Tambah Menu Baru</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Nama Menu</Label>
                      <Input
                        value={newItem.name}
                        onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                        placeholder="Nama menu"
                      />
                    </div>
                    <div>
                      <Label>Harga</Label>
                      <Input
                        type="number"
                        value={newItem.price}
                        onChange={(e) => setNewItem({...newItem, price: Number(e.target.value)})}
                        placeholder="Harga"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Deskripsi</Label>
                    <Input
                      value={newItem.description}
                      onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                      placeholder="Deskripsi menu"
                    />
                  </div>
                  <div>
                    <Label>Kategori</Label>
                    <Select value={newItem.category} onValueChange={(value: "food" | "drink") => setNewItem({...newItem, category: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="food">Makanan</SelectItem>
                        <SelectItem value="drink">Minuman</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={saveMenuItem} className="w-full">
                    <Plus size={16} className="mr-2" />
                    Tambah Menu
                  </Button>
                </CardContent>
              </Card>

              {/* Menu List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {menuItems.map((item) => (
                  <Card key={item.id} className="relative">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{item.name}</h3>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => setEditingItem(item)}>
                            <Edit size={14} />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => deleteMenuItem(item.id)}>
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-primary">{formatPrice(item.price)}</span>
                        <Button size="sm" onClick={() => addToCart(item)}>
                          <ShoppingCart size={14} className="mr-1" />
                          Tambah
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Order Processing */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Proses Pesanan</h2>
            
            <Card>
              <CardContent className="p-6 space-y-4">
                {/* Customer Info */}
                <div>
                  <Label>Nama Pelanggan</Label>
                  <Input
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Masukkan nama pelanggan"
                  />
                </div>

                <div>
                  <Label>Nomor Meja</Label>
                  <Select value={tableNumber} onValueChange={setTableNumber}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih meja" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1,2,3,4,5,6,7,8,9,10].map(num => (
                        <SelectItem key={num} value={num.toString()}>Meja {num}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Metode Pembayaran</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih pembayaran" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="debit">Kartu Debit</SelectItem>
                      <SelectItem value="ovo">OVO</SelectItem>
                      <SelectItem value="dana">DANA</SelectItem>
                      <SelectItem value="gopay">GoPay</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Cart Items */}
                <div>
                  <h3 className="font-semibold mb-2">Pesanan</h3>
                  {cartItems.length === 0 ? (
                    <p className="text-gray-500 text-sm">Belum ada item yang dipilih</p>
                  ) : (
                    <div className="space-y-2">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex justify-between items-center">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-sm text-gray-600">{formatPrice(item.price)} x {item.quantity}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" onClick={() => updateCartQuantity(item.id, item.quantity - 1)}>-</Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button size="sm" variant="outline" onClick={() => updateCartQuantity(item.id, item.quantity + 1)}>+</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {cartItems.length > 0 && (
                  <>
                    <Separator />
                    <div className="flex justify-between items-center font-bold">
                      <span>Total:</span>
                      <span className="text-primary">{formatPrice(total)}</span>
                    </div>
                  </>
                )}

                <Button onClick={processOrder} className="w-full" disabled={cartItems.length === 0}>
                  Proses Pesanan
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Edit Menu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Nama Menu</Label>
                <Input
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                />
              </div>
              <div>
                <Label>Harga</Label>
                <Input
                  type="number"
                  value={editingItem.price}
                  onChange={(e) => setEditingItem({...editingItem, price: Number(e.target.value)})}
                />
              </div>
              <div>
                <Label>Deskripsi</Label>
                <Input
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={saveMenuItem} className="flex-1">Simpan</Button>
                <Button variant="outline" onClick={() => setEditingItem(null)} className="flex-1">Batal</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CashierDashboard;
