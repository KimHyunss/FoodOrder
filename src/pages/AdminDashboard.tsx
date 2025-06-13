import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Shield, User, Phone, MapPin, CreditCard, Edit, Trash2, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'accounts' | 'comments' | 'footer'>('orders');
  const [orders, setOrders] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [editingAccount, setEditingAccount] = useState<any | null>(null);
  const [footerInfo, setFooterInfo] = useState({
    companyName: "FoodOrder",
    description: "",
    phone: "+62 812-3456-7890",
    email: "info@foodorder.com",
    address: "Jakarta, Indonesia",
    operationalHours: {
      weekdays: "08:00 - 22:00",
      weekend: "10:00 - 23:00"
    }
  });
  const [language, setLanguage] = useState("id");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminAuth");
    if (!isLoggedIn) {
      navigate("/admin/login");
      return;
    }
    loadData();
  }, [navigate]);

  const getLanguageText = () => {
    if (language === "en") {
      return {
        adminPanel: "Admin Panel",
        welcome: "Welcome",
        home: "Home",
        logout: "Logout",
        manageOrders: "Manage Orders",
        manageMenu: "Manage Menu",
        manageAccounts: "Manage Accounts",
        settings: "Settings",
        allComments: "All Comments",
        footerInformation: "Footer Information",
        noComments: "No comments available",
        orderNumber: "Order #",
        customer: "Customer",
        phone: "Phone",
        address: "Address",
        payment: "Payment",
        status: "Status",
        total: "Total",
        updateStatus: "Update Status",
        noOrders: "No orders available",
        pending: "Pending",
        preparing: "Preparing",
        ready: "Ready",
        delivered: "Delivered",
        menuName: "Menu Name",
        description: "Description",
        price: "Price",
        category: "Category",
        food: "Food",
        drink: "Drink",
        save: "Save",
        username: "Username",
        password: "Password",
        email: "Email",
        phone2: "Phone",
        role: "Role",
        admin: "Admin",
        driver: "Driver",
        cashier: "Cashier",
        user: "User",
        addAccount: "Add Account",
        edit: "Edit",
        delete: "Delete",
        editAccount: "Edit Account",
        cancel: "Cancel",
        companyName: "Company Name",
        companyDescription: "Company Description",
        contactPhone: "Contact Phone",
        contactEmail: "Contact Email",
        companyAddress: "Company Address",
        weekdayHours: "Weekday Hours (Mon-Fri)",
        weekendHours: "Weekend Hours (Sat-Sun)",
        saveFooterInfo: "Save Footer Information",
        footerInfoSaved: "Footer Information Saved!",
        footerInfoUpdated: "Footer information has been updated successfully."
      };
    }
    return {
      adminPanel: "Panel Admin",
      welcome: "Selamat datang",
      home: "Home",
      logout: "Logout",
      manageOrders: "Kelola Pesanan",
      manageMenu: "Kelola Menu",
      manageAccounts: "Kelola Akun",
      settings: "Pengaturan",
      allComments: "Semua Komentar",
      footerInformation: "Informasi Footer",
      noComments: "Tidak ada komentar tersedia",
      orderNumber: "Pesanan #",
      customer: "Pelanggan",
      phone: "Telepon",
      address: "Alamat",
      payment: "Pembayaran",
      status: "Status",
      total: "Total",
      updateStatus: "Update Status",
      noOrders: "Tidak ada pesanan tersedia",
      pending: "Menunggu",
      preparing: "Diproses",
      ready: "Siap",
      delivered: "Dikirim",
      menuName: "Nama Menu",
      description: "Deskripsi",
      price: "Harga",
      category: "Kategori",
      food: "Makanan",
      drink: "Minuman",
      save: "Simpan",
      username: "Username",
      password: "Password",
      email: "Email",
      phone2: "Telepon",
      role: "Role/Job",
      admin: "Admin",
      driver: "Driver",
      cashier: "Kasir",
      user: "User",
      addAccount: "Tambah Akun",
      edit: "Edit",
      delete: "Hapus",
      editAccount: "Edit Akun",
      cancel: "Batal",
      companyName: "Nama Perusahaan",
      companyDescription: "Deskripsi Perusahaan", 
      contactPhone: "Telepon Kontak",
      contactEmail: "Email Kontak",
      companyAddress: "Alamat Perusahaan",
      weekdayHours: "Jam Kerja (Sen-Jum)",
      weekendHours: "Jam Weekend (Sab-Min)",
      saveFooterInfo: "Simpan Info Footer",
      footerInfoSaved: "Info Footer Tersimpan!",
      footerInfoUpdated: "Informasi footer berhasil diperbarui."
    };
  };

  const text = getLanguageText();

  const loadData = () => {
    const savedOrders = localStorage.getItem("orders");
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    } else {
      setOrders([]);
    }

    const savedMenuItems = localStorage.getItem("menuItems");
    if (savedMenuItems) {
      setMenuItems(JSON.parse(savedMenuItems));
    } else {
      setMenuItems([]);
    }

    const savedAccounts = localStorage.getItem("accounts");
    if (savedAccounts) {
      setAccounts(JSON.parse(savedAccounts));
    } else {
      setAccounts([]);
    }

    const savedComments = localStorage.getItem("comments");
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    } else {
      setComments([]);
    }

    const savedFooterInfo = localStorage.getItem("footerInfo");
    if (savedFooterInfo) {
      setFooterInfo(JSON.parse(savedFooterInfo));
    }
  };

  const saveOrderStatus = (orderId: number, status: string) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    toast({
      title: text.updateStatus,
      description: `${text.orderNumber} ${orderId} ${text.status} ${status}`,
    });
  };

  const saveMenuItem = (updatedItem: any) => {
    const updatedMenu = menuItems.map(item =>
      item.id === updatedItem.id ? updatedItem : item
    );
    setMenuItems(updatedMenu);
    localStorage.setItem("menuItems", JSON.stringify(updatedMenu));
    toast({
      title: text.save,
      description: `${text.menuName} ${updatedItem.name} saved.`,
    });
  };

  const deleteMenuItem = (id: number) => {
    const updatedMenu = menuItems.filter(item => item.id !== id);
    setMenuItems(updatedMenu);
    localStorage.setItem("menuItems", JSON.stringify(updatedMenu));
    toast({
      title: text.delete,
      description: `${text.menuName} deleted.`,
    });
  };

  const saveAccount = () => {
    if (!editingAccount) return;
    const updatedAccounts = accounts.map(acc =>
      acc.id === editingAccount.id ? editingAccount : acc
    );
    setAccounts(updatedAccounts);
    localStorage.setItem("accounts", JSON.stringify(updatedAccounts));
    setEditingAccount(null);
    toast({
      title: text.save,
      description: `${text.editAccount} saved.`,
    });
  };

  const deleteAccount = (id: number) => {
    const updatedAccounts = accounts.filter(acc => acc.id !== id);
    setAccounts(updatedAccounts);
    localStorage.setItem("accounts", JSON.stringify(updatedAccounts));
    toast({
      title: text.delete,
      description: `${text.editAccount} deleted.`,
    });
  };

  const saveFooterInfo = () => {
    localStorage.setItem("footerInfo", JSON.stringify(footerInfo));
    toast({
      title: text.footerInfoSaved,
      description: text.footerInfoUpdated,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-green-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <nav className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-b border-white/20 dark:border-gray-700/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
              <Shield className="h-8 w-8 text-green-600 dark:text-green-400 mr-2" />
              <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
                {text.adminPanel}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-700 dark:text-gray-300">{text.welcome}, Admin</span>
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
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 max-w-2xl bg-white/90 dark:bg-gray-800/90">
            <TabsTrigger value="orders" className="dark:text-gray-300">{text.manageOrders}</TabsTrigger>
            <TabsTrigger value="menu" className="dark:text-gray-300">{text.manageMenu}</TabsTrigger>
            <TabsTrigger value="accounts" className="dark:text-gray-300">{text.manageAccounts}</TabsTrigger>
            <TabsTrigger value="comments" className="dark:text-gray-300">{text.allComments}</TabsTrigger>
            <TabsTrigger value="footer" className="dark:text-gray-300">{text.footerInformation}</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">{text.manageOrders}</h2>
            {orders.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400">{text.noOrders}</p>
            ) : (
              orders.map(order => (
                <Card key={order.id} className="bg-white/95 dark:bg-gray-800/95 backdrop-blur">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-gray-900 dark:text-gray-100">{text.orderNumber} {order.id}</CardTitle>
                      <Badge variant={
                        order.status === 'pending' ? 'destructive' :
                        order.status === 'preparing' ? 'default' :
                        order.status === 'ready' ? 'default' : 'secondary'
                      }>
                        {order.status === 'pending' ? text.pending :
                         order.status === 'preparing' ? text.preparing :
                         order.status === 'ready' ? text.ready : text.delivered}
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
                    <div className="flex items-center gap-2">
                      <CreditCard size={16} className="text-gray-500 dark:text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">{order.paymentMethod || (language === "en" ? "Payment method not selected" : "Metode pembayaran belum dipilih")}</span>
                    </div>
                    <div className="text-lg font-bold text-primary dark:text-primary-foreground">
                      {text.total}: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(order.total)}
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => saveOrderStatus(order.id, 'pending')} variant="outline" size="sm">{text.pending}</Button>
                      <Button onClick={() => saveOrderStatus(order.id, 'preparing')} variant="outline" size="sm">{text.preparing}</Button>
                      <Button onClick={() => saveOrderStatus(order.id, 'ready')} variant="outline" size="sm">{text.ready}</Button>
                      <Button onClick={() => saveOrderStatus(order.id, 'delivered')} variant="outline" size="sm">{text.delivered}</Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="menu" className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">{text.manageMenu}</h2>
            {menuItems.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400">{text.noComments}</p>
            ) : (
              menuItems.map(item => (
                <Card key={item.id} className="bg-white/95 dark:bg-gray-800/95 backdrop-blur">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-gray-900 dark:text-gray-100">{item.name}</CardTitle>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => {
                          const updatedName = prompt(text.menuName, item.name);
                          if (updatedName !== null) {
                            saveMenuItem({ ...item, name: updatedName });
                          }
                        }}>{text.edit}</Button>
                        <Button size="sm" variant="outline" onClick={() => deleteMenuItem(item.id)}>{text.delete}</Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300">{text.description}: {item.description}</p>
                    <p className="text-gray-700 dark:text-gray-300">{text.price}: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(item.price)}</p>
                    <p className="text-gray-700 dark:text-gray-300">{text.category}: {item.category === 'food' ? text.food : text.drink}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="accounts" className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">{text.manageAccounts}</h2>
            {accounts.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400">{text.noComments}</p>
            ) : (
              accounts.map(acc => (
                <Card key={acc.id} className="bg-white/95 dark:bg-gray-800/95 backdrop-blur">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-gray-900 dark:text-gray-100">{acc.username}</CardTitle>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setEditingAccount(acc)}>{text.edit}</Button>
                        <Button size="sm" variant="outline" onClick={() => deleteAccount(acc.id)}>{text.delete}</Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300">{text.email}: {acc.email}</p>
                    <p className="text-gray-700 dark:text-gray-300">{text.phone2}: {acc.phone}</p>
                    <p className="text-gray-700 dark:text-gray-300">{text.role}: {acc.role}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="comments" className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">{text.allComments}</h2>
            {comments.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400">{text.noComments}</p>
            ) : (
              comments.map(comment => (
                <Card key={comment.id} className="bg-white/95 dark:bg-gray-800/95 backdrop-blur">
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300">{comment.message}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">- {comment.userName}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="footer" className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">{text.footerInformation}</h2>
            <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur">
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="dark:text-gray-300">{text.companyName}</Label>
                    <Input
                      value={footerInfo.companyName}
                      onChange={(e) => setFooterInfo({...footerInfo, companyName: e.target.value})}
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    />
                  </div>
                  <div>
                    <Label className="dark:text-gray-300">{text.contactPhone}</Label>
                    <Input
                      value={footerInfo.phone}
                      onChange={(e) => setFooterInfo({...footerInfo, phone: e.target.value})}
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    />
                  </div>
                </div>
                
                <div>
                  <Label className="dark:text-gray-300">{text.companyDescription}</Label>
                  <Input
                    value={footerInfo.description}
                    onChange={(e) => setFooterInfo({...footerInfo, description: e.target.value})}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="dark:text-gray-300">{text.contactEmail}</Label>
                    <Input
                      value={footerInfo.email}
                      onChange={(e) => setFooterInfo({...footerInfo, email: e.target.value})}
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    />
                  </div>
                  <div>
                    <Label className="dark:text-gray-300">{text.companyAddress}</Label>
                    <Input
                      value={footerInfo.address}
                      onChange={(e) => setFooterInfo({...footerInfo, address: e.target.value})}
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="dark:text-gray-300">{text.weekdayHours}</Label>
                    <Input
                      value={footerInfo.operationalHours.weekdays}
                      onChange={(e) => setFooterInfo({
                        ...footerInfo, 
                        operationalHours: {
                          ...footerInfo.operationalHours,
                          weekdays: e.target.value
                        }
                      })}
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    />
                  </div>
                  <div>
                    <Label className="dark:text-gray-300">{text.weekendHours}</Label>
                    <Input
                      value={footerInfo.operationalHours.weekend}
                      onChange={(e) => setFooterInfo({
                        ...footerInfo,
                        operationalHours: {
                          ...footerInfo.operationalHours,
                          weekend: e.target.value
                        }
                      })}
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    />
                  </div>
                </div>

                <Button onClick={saveFooterInfo} className="w-full">
                  {text.saveFooterInfo}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Account Modal */}
      {editingAccount && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="dark:text-gray-200">{text.editAccount}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="dark:text-gray-300">{text.username}</Label>
                <Input
                  value={editingAccount.username}
                  onChange={(e) => setEditingAccount({...editingAccount, username: e.target.value})}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                />
              </div>
              <div>
                <Label className="dark:text-gray-300">{text.password}</Label>
                <Input
                  value={editingAccount.password}
                  onChange={(e) => setEditingAccount({...editingAccount, password: e.target.value})}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                />
              </div>
              <div>
                <Label className="dark:text-gray-300">{text.email}</Label>
                <Input
                  value={editingAccount.email}
                  onChange={(e) => setEditingAccount({...editingAccount, email: e.target.value})}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                />
              </div>
              <div>
                <Label className="dark:text-gray-300">{text.phone2}</Label>
                <Input
                  value={editingAccount.phone}
                  onChange={(e) => setEditingAccount({...editingAccount, phone: e.target.value})}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                />
              </div>
              <div>
                <Label className="dark:text-gray-300">{text.role}</Label>
                <Select 
                  value={editingAccount.role} 
                  onValueChange={(value: "admin" | "driver" | "cashier" | "user") => setEditingAccount({...editingAccount, role: value})}
                >
                  <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                    <SelectItem value="admin" className="dark:text-gray-200">{text.admin}</SelectItem>
                    <SelectItem value="driver" className="dark:text-gray-200">{text.driver}</SelectItem>
                    <SelectItem value="cashier" className="dark:text-gray-200">{text.cashier}</SelectItem>
                    <SelectItem value="user" className="dark:text-gray-200">{text.user}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button onClick={saveAccount} className="flex-1">{text.save}</Button>
                <Button variant="outline" onClick={() => setEditingAccount(null)} className="flex-1 dark:border-gray-600 dark:text-gray-300">{text.cancel}</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
