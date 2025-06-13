
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, User, Phone, Mail, Key, Camera, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState<'account' | 'transactions' | 'advanced'>('account');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePicture: ""
  });

  const language = localStorage.getItem("language") || "id";

  const getText = () => {
    if (language === "en") {
      return {
        settings: "Settings",
        accountSettings: "Account Settings",
        transactions: "Transactions",
        advancedSettings: "Advanced Settings",
        backToHome: "Back to Home",
        username: "Username",
        phone: "Phone Number",
        email: "Email",
        password: "Password",
        confirmPassword: "Confirm Password",
        profilePicture: "Profile Picture",
        save: "Save",
        deleteAccount: "Delete Account",
        confirmDelete: "Are you sure you want to delete this account?",
        cancel: "Cancel",
        delete: "Delete",
        noTransactions: "No transactions found",
        saveSuccess: "Profile updated successfully!",
        deleteSuccess: "Account deleted successfully",
        passwordMismatch: "Passwords do not match"
      };
    }
    return {
      settings: "Pengaturan",
      accountSettings: "Pengaturan Akun",
      transactions: "Transaksi",
      advancedSettings: "Pengaturan Lanjutan",
      backToHome: "Kembali ke Home",
      username: "Username",
      phone: "Nomor Telepon",
      email: "Email",
      password: "Password",
      confirmPassword: "Konfirmasi Password",
      profilePicture: "Foto Profil",
      save: "Simpan",
      deleteAccount: "Hapus Akun",
      confirmDelete: "Apakah Anda yakin ingin menghapus akun ini?",
      cancel: "Batal",
      delete: "Hapus",
      noTransactions: "Tidak ada transaksi",
      saveSuccess: "Profil berhasil diperbarui!",
      deleteSuccess: "Akun berhasil dihapus",
      passwordMismatch: "Password tidak cocok"
    };
  };

  const text = getText();

  useEffect(() => {
    const userData = localStorage.getItem("currentUserData");
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUser(user);
      setFormData({
        username: user.username || "",
        phone: user.phone || "",
        email: user.email || "",
        password: "",
        confirmPassword: "",
        profilePicture: user.profilePicture || ""
      });
    }
  }, []);

  const handleSave = () => {
    if (formData.password && formData.password !== formData.confirmPassword) {
      toast({
        title: text.passwordMismatch,
        variant: "destructive"
      });
      return;
    }

    const updatedUser = {
      ...currentUser,
      username: formData.username,
      phone: formData.phone,
      email: formData.email,
      profilePicture: formData.profilePicture
    };

    if (formData.password) {
      updatedUser.password = formData.password;
    }

    localStorage.setItem("currentUserData", JSON.stringify(updatedUser));
    localStorage.setItem("currentUser", formData.username);

    // Update in registered users
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    const updatedUsers = registeredUsers.map((user: any) => 
      user.username === currentUser.username ? updatedUser : user
    );
    localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers));

    setCurrentUser(updatedUser);
    toast({
      title: text.saveSuccess
    });
  };

  const handleDeleteAccount = () => {
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    const updatedUsers = registeredUsers.filter((user: any) => user.username !== currentUser.username);
    localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers));

    localStorage.removeItem("userLoggedIn");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("currentUserData");

    toast({
      title: text.deleteSuccess
    });

    navigate("/");
    setIsDeleteConfirmOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setFormData(prev => ({ ...prev, profilePicture: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
      <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-white/20 dark:border-gray-700/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{text.settings}</h1>
            </div>
            <Button variant="outline" onClick={() => navigate("/")} className="gap-2 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700">
              <ArrowLeft size={16} />
              {text.backToHome}
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-4 mb-6 flex-wrap">
          <Button
            variant={activeSection === 'account' ? 'default' : 'outline'}
            onClick={() => setActiveSection('account')}
            className="dark:border-gray-600 dark:text-gray-200"
          >
            {text.accountSettings}
          </Button>
          <Button
            variant={activeSection === 'transactions' ? 'default' : 'outline'}
            onClick={() => setActiveSection('transactions')}
            className="dark:border-gray-600 dark:text-gray-200"
          >
            {text.transactions}
          </Button>
          <Button
            variant={activeSection === 'advanced' ? 'default' : 'outline'}
            onClick={() => setActiveSection('advanced')}
            className="dark:border-gray-600 dark:text-gray-200"
          >
            {text.advancedSettings}
          </Button>
        </div>

        {activeSection === 'account' && (
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-gray-100">{text.accountSettings}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="dark:text-gray-200">{text.profilePicture}</Label>
                <div className="flex items-center gap-4 mt-2">
                  {formData.profilePicture && (
                    <img src={formData.profilePicture} alt="Profile" className="w-20 h-20 rounded-full object-cover" />
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                  />
                </div>
              </div>
              <div>
                <Label className="dark:text-gray-200">{text.username}</Label>
                <Input
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                />
              </div>
              <div>
                <Label className="dark:text-gray-200">{text.phone}</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                />
              </div>
              <div>
                <Label className="dark:text-gray-200">{text.email}</Label>
                <Input
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                />
              </div>
              <div>
                <Label className="dark:text-gray-200">{text.password}</Label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Kosongkan jika tidak ingin mengubah"
                  className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                />
              </div>
              <div>
                <Label className="dark:text-gray-200">{text.confirmPassword}</Label>
                <Input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                />
              </div>
              <Button onClick={handleSave} className="w-full">
                {text.save}
              </Button>
            </CardContent>
          </Card>
        )}

        {activeSection === 'transactions' && (
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-gray-100">{text.transactions}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 dark:text-gray-400">{text.noTransactions}</p>
            </CardContent>
          </Card>
        )}

        {activeSection === 'advanced' && (
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-gray-100">{text.advancedSettings}</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                variant="destructive" 
                onClick={() => setIsDeleteConfirmOpen(true)}
                className="gap-2"
              >
                <Trash2 size={16} />
                {text.deleteAccount}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-gray-100">{text.confirmDelete}</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)} className="flex-1 dark:border-gray-600 dark:text-gray-200">
                {text.cancel}
              </Button>
              <Button variant="destructive" onClick={handleDeleteAccount} className="flex-1">
                {text.delete}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Settings;
