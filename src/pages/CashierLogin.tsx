
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Utensils, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CashierLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username === "Kasir" && password === "kasir123") {
      localStorage.setItem("cashierLoggedIn", "true");
      localStorage.setItem("currentCashier", username);
      
      toast({
        title: "Login berhasil!",
        description: `Selamat datang, ${username}!`,
      });
      
      navigate("/cashier/dashboard");
    } else {
      toast({
        title: "Login gagal",
        description: "Username atau password salah",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/95 dark:bg-gray-800/95 backdrop-blur shadow-xl border border-white/20 dark:border-gray-700/20">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4 cursor-pointer" onClick={() => navigate("/")}>
            <Utensils className="h-8 w-8 text-primary mr-2" />
            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              FoodOrder
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">Login Kasir</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            Masuk untuk mengelola pesanan di resto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-700 dark:text-gray-200">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 dark:text-gray-200">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
            
            <div className="text-center">
              <Button variant="outline" onClick={() => navigate("/")} className="w-full gap-2 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700">
                <ArrowLeft size={16} />
                Kembali ke Home
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CashierLogin;
