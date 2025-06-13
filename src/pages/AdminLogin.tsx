
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Shield, User, Lock, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const language = localStorage.getItem("language") || "id";

  const getText = () => {
    if (language === "en") {
      return {
        adminLogin: "Admin Login",
        loginToAdmin: "Login to Admin Dashboard",
        username: "Username",
        password: "Password",
        enterUsername: "Enter username",
        enterPassword: "Enter password",
        login: "Login",
        processing: "Processing...",
        backToHome: "Back to Home",
        loginSuccess: "Login Successful",
        welcomeAdmin: "Welcome to Admin Dashboard",
        loginFailed: "Login Failed",
        wrongCredentials: "Wrong username or password",
        adminCredentials: "Admin Credentials:"
      };
    }
    return {
      adminLogin: "Login Admin",
      loginToAdmin: "Masuk ke Dashboard Admin",
      username: "Username",
      password: "Password",
      enterUsername: "Masukkan username",
      enterPassword: "Masukkan password",
      login: "Login",
      processing: "Memproses...",
      backToHome: "Kembali ke Home",
      loginSuccess: "Login Berhasil",
      welcomeAdmin: "Selamat datang di Dashboard Admin",
      loginFailed: "Login Gagal",
      wrongCredentials: "Username atau password salah",
      adminCredentials: "Kredensial Admin:"
    };
  };

  const text = getText();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      // Check registered users for admin role
      const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
      const adminUser = registeredUsers.find((user: any) => 
        user.username === username && user.password === password && user.role === 'admin'
      );

      if (adminUser || (username === "Admin" && password === "admin123")) {
        localStorage.setItem("adminAuth", "true");
        toast({
          title: text.loginSuccess,
          description: text.welcomeAdmin,
        });
        navigate("/admin/dashboard");
      } else {
        toast({
          title: text.loginFailed,
          description: text.wrongCredentials,
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleBackHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-white/95 dark:bg-gray-800/95 backdrop-blur shadow-xl border border-gray-200 dark:border-gray-700">
        <CardHeader className="text-center">
          <div className="flex items-center justify-between mb-4">
            <Button 
              variant="outline" 
              onClick={handleBackHome} 
              className="gap-2 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <Home size={16} />
              {text.backToHome}
            </Button>
            <div className="p-3 bg-primary/10 rounded-full">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">{text.adminLogin}</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            {text.loginToAdmin}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">{text.username}</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
                <Input
                  type="text"
                  placeholder={text.enterUsername}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">{text.password}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
                <Input
                  type="password"
                  placeholder={text.enterPassword}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                  required
                />
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? text.processing : text.login}
            </Button>
          </form>
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
              <strong>{text.adminCredentials}</strong><br />
              {text.username}: Admin<br />
              {text.password}: admin123
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
