import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, ArrowLeft, User, MapPin, Trash2, Edit, Plus, ShoppingCart, Search, Upload } from "lucide-react";
import { MenuItem, CartItem } from "@/pages/Index";
import { useToast } from "@/hooks/use-toast";

const CashierDashboard = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredMenuItems, setFilteredMenuItems] = useState<MenuItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<'all' | 'food' | 'drink'>('all');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [newItem, setNewItem] = useState({ 
    name: "", 
    description: "", 
    price: 0, 
    category: "food" as "food" | "drink", 
    image: "",
    imageFile: null as File | null
  });
  const [language, setLanguage] = useState("id");
  const navigate = useNavigate();
  const { toast } = useToast();
  const currentCashier = localStorage.getItem("currentCashier");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

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

  useEffect(() => {
    // Filter menu items based on search and category
    let filtered = menuItems.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (activeCategory !== 'all') {
      filtered = filtered.filter(item => item.category === activeCategory);
    }

    setFilteredMenuItems(filtered);
  }, [menuItems, searchTerm, activeCategory]);

  const getLanguageText = () => {
    if (language === "en") {
      return {
        cashierPanel: "Cashier Panel",
        welcome: "Welcome",
        home: "Home",
        logout: "Logout",
        manageMenu: "Manage Menu",
        addNewMenu: "Add New Menu",
        menuName: "Menu Name",
        price: "Price",
        description: "Description",
        category: "Category",
        food: "Food",
        drinks: "Drinks",
        addMenu: "Add Menu",
        edit: "Edit",
        delete: "Delete",
        add: "Add",
        processOrder: "Process Order",
        customerName: "Customer Name",
        enterCustomerName: "Enter customer name",
        tableNumber: "Table Number",
        selectTable: "Select table",
        table: "Table",
        paymentMethod: "Payment Method",
        selectPayment: "Select payment",
        cash: "Cash",
        debitCard: "Debit Card",
        order: "Order",
        noItemsSelected: "No items selected yet",
        total: "Total",
        processOrderBtn: "Process Order",
        incompleteData: "Incomplete Data",
        completeAllOrderData: "Please complete all order data",
        orderSuccess: "Order Successful!",
        orderProcessed: "Order for",
        atTable: "at table",
        hasBeenProcessed: "has been processed",
        editMenu: "Edit Menu",
        save: "Save",
        cancel: "Cancel"
      };
    }
    return {
      cashierPanel: "Panel Kasir",
      welcome: "Selamat datang",
      home: "Home",
      logout: "Logout",
      manageMenu: "Kelola Menu",
      addNewMenu: "Tambah Menu Baru",
      menuName: "Nama Menu",
      price: "Harga",
      description: "Deskripsi",
      category: "Kategori",
      food: "Makanan",
      drinks: "Minuman",
      addMenu: "Tambah Menu",
      edit: "Edit",
      delete: "Delete",
      add: "Tambah",
      processOrder: "Proses Pesanan",
      customerName: "Nama Pelanggan",
      enterCustomerName: "Masukkan nama pelanggan",
      tableNumber: "Nomor Meja",
      selectTable: "Pilih meja",
      table: "Meja",
      paymentMethod: "Metode Pembayaran",
      selectPayment: "Pilih pembayaran",
      cash: "Cash",
      debitCard: "Kartu Debit",
      order: "Pesanan",
      noItemsSelected: "Belum ada item yang dipilih",
      total: "Total",
      processOrderBtn: "Proses Pesanan",
      incompleteData: "Data tidak lengkap",
      completeAllOrderData: "Mohon lengkapi semua data pesanan",
      orderSuccess: "Pesanan berhasil!",
      orderProcessed: "Pesanan untuk",
      atTable: "di meja",
      hasBeenProcessed: "telah diproses",
      editMenu: "Edit Menu",
      save: "Simpan",
      cancel: "Batal"
    };
  };

  const text = getLanguageText();

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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewItem({...newItem, image: e.target?.result as string, imageFile: file});
      };
      reader.readAsDataURL(file);
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
        image: newItem.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
        rating: 0,
        reviews: 0
      };
      const updatedItems = [...menuItems, newMenuItem];
      setMenuItems(updatedItems);
      localStorage.setItem("menuItems", JSON.stringify(updatedItems));
      setNewItem({ name: "", description: "", price: 0, category: "food", image: "", imageFile: null });
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
        title: text.incompleteData,
        description: text.completeAllOrderData,
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
      customerPhone: text.table + " " + tableNumber,
      customerAddress: `${text.table} ${tableNumber}`,
      paymentMethod,
      orderType: 'dine-in'
    };

    const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    const updatedOrders = [...existingOrders, newOrder];
    localStorage.setItem("orders", JSON.stringify(updatedOrders));

    toast({
      title: text.orderSuccess,
      description: `${text.orderProcessed} ${customerName} ${text.atTable} ${tableNumber} ${text.hasBeenProcessed}`,
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-orange-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-white/20 dark:border-gray-700/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
              <CreditCard className="h-8 w-8 text-orange-600 dark:text-orange-400 mr-2" />
              <div className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
                {text.cashierPanel}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-700 dark:text-gray-300">{text.welcome}, {currentCashier}</span>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu Management */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">{text.manageMenu}</h2>
              
              {/* Add New Item Form */}
              <Card className="mb-6 dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="dark:text-gray-200">{text.addNewMenu}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="dark:text-gray-300">{text.menuName}</Label>
                      <Input
                        value={newItem.name}
                        onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                        placeholder={text.menuName}
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                      />
                    </div>
                    <div>
                      <Label className="dark:text-gray-300">{text.price}</Label>
                      <Input
                        type="number"
                        value={newItem.price}
                        onChange={(e) => setNewItem({...newItem, price: Number(e.target.value)})}
                        placeholder={text.price}
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="dark:text-gray-300">{text.description}</Label>
                    <Textarea
                      value={newItem.description}
                      onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                      placeholder={text.description}
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    />
                  </div>
                  <div>
                    <Label className="dark:text-gray-300">{text.category}</Label>
                    <Select value={newItem.category} onValueChange={(value: "food" | "drink") => setNewItem({...newItem, category: value})}>
                      <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                        <SelectItem value="food" className="dark:text-gray-200">{text.food}</SelectItem>
                        <SelectItem value="drink" className="dark:text-gray-200">{text.drinks}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="dark:text-gray-300">Foto Menu</Label>
                    <div className="space-y-2">
                      <Input
                        value={newItem.image}
                        onChange={(e) => setNewItem({...newItem, image: e.target.value})}
                        placeholder="URL Gambar"
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">atau</span>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <Upload size={16} />
                          <span className="text-sm">Upload File</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                  <Button onClick={saveMenuItem} className="w-full">
                    <Plus size={16} className="mr-2" />
                    {text.addMenu}
                  </Button>
                </CardContent>
              </Card>

              {/* Search and Filter */}
              <Card className="mb-6 dark:bg-gray-800">
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <Input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Cari menu..."
                        className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                      />
                    </div>
                    <Tabs value={activeCategory} onValueChange={(value) => setActiveCategory(value as 'all' | 'food' | 'drink')}>
                      <TabsList className="grid w-full grid-cols-3 dark:bg-gray-700">
                        <TabsTrigger value="all" className="dark:text-gray-300">Semua Menu</TabsTrigger>
                        <TabsTrigger value="food" className="dark:text-gray-300">Makanan</TabsTrigger>
                        <TabsTrigger value="drink" className="dark:text-gray-300">Minuman</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </CardContent>
              </Card>

              {/* Menu List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredMenuItems.map((item) => (
                  <Card key={item.id} className="relative dark:bg-gray-800">
                    <div className="aspect-video bg-muted overflow-hidden rounded-t-lg">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold dark:text-gray-200">{item.name}</h3>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => setEditingItem(item)} className="dark:border-gray-600 dark:text-gray-300">
                            <Edit size={14} />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => deleteMenuItem(item.id)} className="dark:border-gray-600 dark:text-gray-300">
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{item.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-primary dark:text-primary-foreground">{formatPrice(item.price)}</span>
                        <Button size="sm" onClick={() => addToCart(item)}>
                          <ShoppingCart size={14} className="mr-1" />
                          {text.add}
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
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">{text.processOrder}</h2>
            
            <Card className="dark:bg-gray-800">
              <CardContent className="p-6 space-y-4">
                {/* Customer Info */}
                <div>
                  <Label className="dark:text-gray-300">{text.customerName}</Label>
                  <Input
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={text.enterCustomerName}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                  />
                </div>

                <div>
                  <Label className="dark:text-gray-300">{text.tableNumber}</Label>
                  <Select value={tableNumber} onValueChange={setTableNumber}>
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
                      <SelectValue placeholder={text.selectTable} />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                      {[1,2,3,4,5,6,7,8,9,10].map(num => (
                        <SelectItem key={num} value={num.toString()} className="dark:text-gray-200">{text.table} {num}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="dark:text-gray-300">{text.paymentMethod}</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
                      <SelectValue placeholder={text.selectPayment} />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                      <SelectItem value="cash" className="dark:text-gray-200">{text.cash}</SelectItem>
                      <SelectItem value="debit" className="dark:text-gray-200">{text.debitCard}</SelectItem>
                      <SelectItem value="ovo" className="dark:text-gray-200">OVO</SelectItem>
                      <SelectItem value="dana" className="dark:text-gray-200">DANA</SelectItem>
                      <SelectItem value="gopay" className="dark:text-gray-200">GoPay</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator className="dark:border-gray-600" />

                {/* Cart Items */}
                <div>
                  <h3 className="font-semibold mb-2 dark:text-gray-200">{text.order}</h3>
                  {cartItems.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{text.noItemsSelected}</p>
                  ) : (
                    <div className="space-y-2">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex justify-between items-center">
                          <div className="flex-1">
                            <p className="font-medium text-sm dark:text-gray-200">{item.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{formatPrice(item.price)} x {item.quantity}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" onClick={() => updateCartQuantity(item.id, item.quantity - 1)} className="dark:border-gray-600 dark:text-gray-300">-</Button>
                            <span className="w-8 text-center dark:text-gray-200">{item.quantity}</span>
                            <Button size="sm" variant="outline" onClick={() => updateCartQuantity(item.id, item.quantity + 1)} className="dark:border-gray-600 dark:text-gray-300">+</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {cartItems.length > 0 && (
                  <>
                    <Separator className="dark:border-gray-600" />
                    <div className="flex justify-between items-center font-bold">
                      <span className="dark:text-gray-200">{text.total}:</span>
                      <span className="text-primary dark:text-primary-foreground">{formatPrice(total)}</span>
                    </div>
                  </>
                )}

                <Button onClick={processOrder} className="w-full" disabled={cartItems.length === 0}>
                  {text.processOrderBtn}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="dark:text-gray-200">{text.editMenu}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="dark:text-gray-300">{text.menuName}</Label>
                <Input
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                />
              </div>
              <div>
                <Label className="dark:text-gray-300">{text.price}</Label>
                <Input
                  type="number"
                  value={editingItem.price}
                  onChange={(e) => setEditingItem({...editingItem, price: Number(e.target.value)})}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                />
              </div>
              <div>
                <Label className="dark:text-gray-300">{text.description}</Label>
                <Input
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={saveMenuItem} className="flex-1">{text.save}</Button>
                <Button variant="outline" onClick={() => setEditingItem(null)} className="flex-1 dark:border-gray-600 dark:text-gray-300">{text.cancel}</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CashierDashboard;
