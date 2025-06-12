
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Utensils, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const UserLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = () => {
    if (username === "UserX" && password === "User123") {
      localStorage.setItem("userLoggedIn", "true");
      localStorage.setItem("currentUser", "UserX");
      toast({
        title: "Login Berhasil!",
        description: "Selamat datang di FoodOrder",
      });
      navigate("/");
    } else {
      toast({
        title: "Login Gagal",
        description: "Username atau password salah",
        variant: "destructive"
      });
    }
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md space-y-6 p-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Utensils className="h-10 w-10 text-primary" />
            <div className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              FoodOrder
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Login User</h1>
            <p className="text-gray-600">Masuk untuk melanjutkan pesanan</p>
          </div>
        </div>

        {/* Login Form */}
        <Card className="bg-white/95 backdrop-blur shadow-xl border border-white/20">
          <CardHeader>
            <CardTitle className="text-center text-gray-800">Masuk ke Akun Anda</CardTitle>
            <CardDescription className="text-center text-gray-600">
              Gunakan username dan password untuk masuk
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="username" className="text-gray-700">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-gray-700">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className="mt-1"
              />
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              <p><strong>Demo Login:</strong></p>
              <p>Username: UserX</p>
              <p>Password: User123</p>
            </div>
            <Button onClick={handleLogin} className="w-full gap-2">
              <LogIn size={16} />
              Masuk
            </Button>
            <Button 
              variant="outline" 
              onClick={handleBackToHome} 
              className="w-full gap-2"
            >
              <ArrowLeft size={16} />
              Kembali ke Home
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserLogin;
