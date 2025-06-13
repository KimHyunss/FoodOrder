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

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState<'orders' | 'menu' | 'accounts' | 'settings'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [newItem, setNewItem] = useState({ name: "", description: "", price: 0, category: "food" as "food" | "drink", image: "" });
  const [editingAccount, setEditingAccount] = useState<any | null>(null);
  const [newAccount, setNewAccount] = useState({ username: "", password: "", email: "", phone: "" });
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showComments, setShowComments] = useState(false);
  const [allComments, setAllComments] = useState<any[]>([]);

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

    // Load accounts
    const savedAccounts = localStorage.getItem("registeredUsers");
    if (savedAccounts) {
      setAccounts(JSON.parse(savedAccounts));
    }
    
    // Load all comments
    const comments = [];
    const menuIds = [1, 2, 3, 4]; // Add more as needed
    menuIds.forEach(id => {
      const menuComments = JSON.parse(localStorage.getItem(`menu_${id}_comments`) || "[]");
      comments.push(...menuComments.map((comment: any) => ({...comment, menuId: id})));
    });
    setAllComments(comments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
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
      setNewAccount({ username: "", password: "", email: "", phone: "" });
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
              <Shield className="h-8 w-8 text-green-600 mr-2" />
              <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
                Admin Panel
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">Selamat datang, Admin</span>
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
        <div className="flex gap-4 mb-6">
          <Button
            variant={activeSection === 'orders' ? 'default' : 'outline'}
            onClick={() => setActiveSection('orders')}
          >
            Kelola Pesanan
          </Button>
          <Button
            variant={activeSection === 'menu' ? 'default' : 'outline'}
            onClick={() => setActiveSection('menu')}
          >
            Kelola Menu
          </Button>
          <Button
            variant={activeSection === 'accounts' ? 'default' : 'outline'}
            onClick={() => setActiveSection('accounts')}
          >
            Kelola Akun
          </Button>
          <Button
            variant={activeSection === 'settings' ? 'default' : 'outline'}
            onClick={() => setActiveSection('settings')}
          >
            Pengaturan
          </Button>
          <Button
            variant={showComments ? 'default' : 'outline'}
            onClick={() => setShowComments(!showComments)}
          >
            Semua Komentar
          </Button>
        </div>

        {showComments && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Semua Komentar dari User</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {allComments.length === 0 ? (
                  <p className="text-gray-500">Belum ada komentar</p>
                ) : (
                  allComments.map((comment, index) => (
                    <div key={index} className="border-b pb-3 last:border-b-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < comment.rating ? "text-yellow-400" : "text-gray-300"}>★</span>
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">Menu ID: {comment.menuId}</span>
                        <span className="text-sm text-gray-500">{new Date(comment.date).toLocaleDateString('id-ID')}</span>
                      </div>
                      <p className="text-gray-700">{comment.comment}</p>
                      <p className="text-sm text-gray-500 mt-1">- {comment.userName}</p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {activeSection === 'orders' && (
          <Card>
            <CardHeader>
              <CardTitle>Kelola Pesanan</CardTitle>
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
                    />
                  </div>
                  <div>
                    <Label>Password</Label>
                    <Input
                      type="password"
                      value={newAccount.password}
                      onChange={(e) => setNewAccount({...newAccount, password: e.target.value})}
                      placeholder="Password"
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
                  />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    type="tel"
                    value={newAccount.phone}
                    onChange={(e) => setNewAccount({...newAccount, phone: e.target.value})}
                    placeholder="Phone"
                  />
                </div>
                <Button onClick={saveAccount}>Tambah Akun</Button>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {accounts.map(account => (
                <Card key={account.username} className="relative">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{account.username}</h3>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setEditingAccount(account)}>
                          <Edit size={14} />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => deleteAccount(account.username)}>
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Email: {account.email}</p>
                    <p className="text-sm text-gray-600">Phone: {account.phone}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'settings' && (
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Pengaturan akan ditambahkan nanti</p>
            </CardContent>
          </Card>
        )}
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

      {/* Edit Account Modal */}
      {editingAccount && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Edit Akun</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Username</Label>
                <Input
                  value={editingAccount.username}
                  onChange={(e) => setEditingAccount({...editingAccount, username: e.target.value})}
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={editingAccount.email}
                  onChange={(e) => setEditingAccount({...editingAccount, email: e.target.value})}
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  type="tel"
                  value={editingAccount.phone}
                  onChange={(e) => setEditingAccount({...editingAccount, phone: e.target.value})}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={saveAccount} className="flex-1">Simpan</Button>
                <Button variant="outline" onClick={() => setEditingAccount(null)} className="flex-1">Batal</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
