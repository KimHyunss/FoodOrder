import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Shield, ArrowLeft, User, Mail, Phone, Key, Edit, Trash2, Plus, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MenuItem } from "@/pages/Index";

type Order = {
  id: number;
  items: any[];
  total: number;
  status: string;
  orderTime: Date;
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  paymentMethod?: string;
};

type Account = {
  username: string;
  password: string;
  email: string;
  phone: string;
  role: 'admin' | 'driver' | 'cashier' | 'user';
};

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState<'orders' | 'menu' | 'accounts' | 'settings' | 'comments'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [newItem, setNewItem] = useState({ name: "", description: "", price: 0, category: "food" as "food" | "drink", image: "" });
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [newAccount, setNewAccount] = useState({ username: "", password: "", email: "", phone: "", role: "user" as "admin" | "driver" | "cashier" | "user" });
  const navigate = useNavigate();
  const { toast } = useToast();
  const [allComments, setAllComments] = useState<any[]>([]);
  const [wallpaper, setWallpaper] = useState("");

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminAuth");
    if (!isLoggedIn) {
      navigate("/admin/login");
      return;
    }

    // Load orders
    const savedOrders = localStorage.getItem("orders");
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
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

    // Load accounts with default roles
    const savedAccounts = localStorage.getItem("registeredUsers");
    if (savedAccounts) {
      const accountsData = JSON.parse(savedAccounts);
      const accountsWithRoles = accountsData.map((account: any) => ({
        ...account,
        role: account.role || 'user'
      }));
      setAccounts(accountsWithRoles);
    }
    
    // Load all comments
    const comments = [];
    const menuIds = [1, 2, 3, 4];
    menuIds.forEach(id => {
      const menuComments = JSON.parse(localStorage.getItem(`menu_${id}_comments`) || "[]");
      comments.push(...menuComments.map((comment: any) => ({...comment, menuId: id})));
    });
    setAllComments(comments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));

    // Load wallpaper
    const savedWallpaper = localStorage.getItem("adminWallpaper");
    if (savedWallpaper) {
      setWallpaper(savedWallpaper);
      document.body.style.backgroundImage = `url(${savedWallpaper})`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
    }
  }, [navigate]);

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

  const saveAccount = () => {
    if (editingAccount) {
      const updatedAccounts = accounts.map(account =>
        account.username === editingAccount.username ? editingAccount : account
      );
      setAccounts(updatedAccounts);
      localStorage.setItem("registeredUsers", JSON.stringify(updatedAccounts));
      setEditingAccount(null);
    } else if (newAccount.username && newAccount.password && newAccount.email && newAccount.phone) {
      const updatedAccounts = [...accounts, newAccount];
      setAccounts(updatedAccounts);
      localStorage.setItem("registeredUsers", JSON.stringify(updatedAccounts));
      setNewAccount({ username: "", password: "", email: "", phone: "", role: "user" });
    }
  };

  const deleteAccount = (username: string) => {
    const updatedAccounts = accounts.filter(account => account.username !== username);
    setAccounts(updatedAccounts);
    localStorage.setItem("registeredUsers", JSON.stringify(updatedAccounts));
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    navigate("/");
  };

  const handleChangeOrderStatus = (orderId: number, newStatus: string) => {
    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
  };

  const handleWallpaperChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setWallpaper(result);
        localStorage.setItem("adminWallpaper", result);
        document.body.style.backgroundImage = `url(${result})`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        toast({
          title: "Wallpaper berhasil diubah!",
          description: "Background telah diperbarui.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getRoleDisplay = (role: string) => {
    switch(role) {
      case 'admin': return 'Admin';
      case 'driver': return 'Driver';
      case 'cashier': return 'Kasir';
      case 'user': return 'User';
      default: return 'User';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
      {/* Header */}
      <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-white/20 dark:border-gray-700/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
              <Shield className="h-8 w-8 text-green-600 mr-2" />
              <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
                Admin Panel
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-700 dark:text-gray-200">Selamat datang, Admin</span>
              <Button variant="outline" onClick={() => navigate("/")} className="gap-2 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700">
                <ArrowLeft size={16} />
                Home
              </Button>
              <Button variant="outline" onClick={handleLogout} className="dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-4 mb-6 flex-wrap">
          <Button
            variant={activeSection === 'orders' ? 'default' : 'outline'}
            onClick={() => setActiveSection('orders')}
            className="dark:border-gray-600 dark:text-gray-200"
          >
            Kelola Pesanan
          </Button>
          <Button
            variant={activeSection === 'menu' ? 'default' : 'outline'}
            onClick={() => setActiveSection('menu')}
            className="dark:border-gray-600 dark:text-gray-200"
          >
            Kelola Menu
          </Button>
          <Button
            variant={activeSection === 'accounts' ? 'default' : 'outline'}
            onClick={() => setActiveSection('accounts')}
            className="dark:border-gray-600 dark:text-gray-200"
          >
            Kelola Akun
          </Button>
          <Button
            variant={activeSection === 'settings' ? 'default' : 'outline'}
            onClick={() => setActiveSection('settings')}
            className="dark:border-gray-600 dark:text-gray-200"
          >
            Pengaturan
          </Button>
          <Button
            variant={activeSection === 'comments' ? 'default' : 'outline'}
            onClick={() => setActiveSection('comments')}
            className="dark:border-gray-600 dark:text-gray-200"
          >
            Semua Komentar
          </Button>
        </div>

        {activeSection === 'comments' && (
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-gray-100">Semua Komentar dari User</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {allComments.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400">Belum ada komentar</p>
                ) : (
                  allComments.map((comment, index) => (
                    <div key={index} className="border-b border-gray-200 dark:border-gray-600 pb-3 last:border-b-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < comment.rating ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"}>★</span>
                          ))}
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Menu ID: {comment.menuId}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{new Date(comment.date).toLocaleDateString('id-ID')}</span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-200">{comment.comment}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">- {comment.userName}</p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {activeSection === 'orders' && (
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-gray-100">Kelola Pesanan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pelanggan</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map(order => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{order.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{order.customerName}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{formatPrice(order.total)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{new Date(order.orderTime).toLocaleTimeString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge>{order.status}</Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Select value={order.status} onValueChange={(value) => handleChangeOrderStatus(order.id, value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Ubah Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="preparing">Preparing</SelectItem>
                              <SelectItem value="ready">Ready</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {activeSection === 'menu' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Kelola Menu</CardTitle>
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
                <Button onClick={saveMenuItem}>Tambah Menu</Button>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {menuItems.map(item => (
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
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'accounts' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Kelola Akun</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Username</Label>
                    <Input
                      value={newAccount.username}
                      onChange={(e) => setNewAccount({...newAccount, username: e.target.value})}
                      placeholder="Username"
                      className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                    />
                  </div>
                  <div>
                    <Label>Password</Label>
                    <Input
                      type="password"
                      value={newAccount.password}
                      onChange={(e) => setNewAccount({...newAccount, password: e.target.value})}
                      placeholder="Password"
                      className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                    />
                  </div>
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={newAccount.email}
                    onChange={(e) => setNewAccount({...newAccount, email: e.target.value})}
                    placeholder="Email"
                    className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                  />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    type="tel"
                    value={newAccount.phone}
                    onChange={(e) => setNewAccount({...newAccount, phone: e.target.value})}
                    placeholder="Phone"
                    className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                  />
                </div>
                <div>
                  <Label>Role/Job</Label>
                  <Select value={newAccount.role} onValueChange={(value: "admin" | "driver" | "cashier" | "user") => setNewAccount({...newAccount, role: value})}>
                    <SelectTrigger className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                      <SelectItem value="user" className="dark:text-gray-100 dark:hover:bg-gray-600">User</SelectItem>
                      <SelectItem value="cashier" className="dark:text-gray-100 dark:hover:bg-gray-600">Kasir</SelectItem>
                      <SelectItem value="driver" className="dark:text-gray-100 dark:hover:bg-gray-600">Driver</SelectItem>
                      <SelectItem value="admin" className="dark:text-gray-100 dark:hover:bg-gray-600">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={saveAccount}>Tambah Akun</Button>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {accounts.map(account => (
                <Card key={account.username} className="relative dark:bg-gray-800 dark:border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold dark:text-gray-100">{account.username}</h3>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setEditingAccount(account)} className="dark:border-gray-600 dark:text-gray-200">
                          <Edit size={14} />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => deleteAccount(account.username)} className="dark:border-gray-600 dark:text-gray-200">
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Email: {account.email}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Phone: {account.phone}</p>
                    <Badge variant="outline" className="dark:border-gray-600 dark:text-gray-200">
                      {getRoleDisplay(account.role)}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'settings' && (
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-gray-100">Pengaturan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="dark:text-gray-200">Ubah Wallpaper/Background</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleWallpaperChange}
                  className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Upload gambar untuk mengubah background semua halaman
                </p>
              </div>
              {wallpaper && (
                <div>
                  <Label className="dark:text-gray-200">Preview Wallpaper</Label>
                  <img src={wallpaper} alt="Wallpaper Preview" className="w-32 h-20 object-cover rounded border" />
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-gray-100">Edit Menu</CardTitle>
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

      {/* Edit Account Modal */}
      {editingAccount && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-gray-100">Edit Akun</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="dark:text-gray-200">Username</Label>
                <Input
                  value={editingAccount.username}
                  onChange={(e) => setEditingAccount({...editingAccount, username: e.target.value})}
                  className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                />
              </div>
              <div>
                <Label className="dark:text-gray-200">Email</Label>
                <Input
                  type="email"
                  value={editingAccount.email}
                  onChange={(e) => setEditingAccount({...editingAccount, email: e.target.value})}
                  className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                />
              </div>
              <div>
                <Label className="dark:text-gray-200">Phone</Label>
                <Input
                  type="tel"
                  value={editingAccount.phone}
                  onChange={(e) => setEditingAccount({...editingAccount, phone: e.target.value})}
                  className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                />
              </div>
              <div>
                <Label className="dark:text-gray-200">Role/Job</Label>
                <Select value={editingAccount.role} onValueChange={(value: "admin" | "driver" | "cashier" | "user") => setEditingAccount({...editingAccount, role: value})}>
                  <SelectTrigger className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                    <SelectItem value="user" className="dark:text-gray-100 dark:hover:bg-gray-600">User</SelectItem>
                    <SelectItem value="cashier" className="dark:text-gray-100 dark:hover:bg-gray-600">Kasir</SelectItem>
                    <SelectItem value="driver" className="dark:text-gray-100 dark:hover:bg-gray-600">Driver</SelectItem>
                    <SelectItem value="admin" className="dark:text-gray-100 dark:hover:bg-gray-600">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button onClick={saveAccount} className="flex-1">Simpan</Button>
                <Button variant="outline" onClick={() => setEditingAccount(null)} className="flex-1 dark:border-gray-600 dark:text-gray-200">Batal</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
