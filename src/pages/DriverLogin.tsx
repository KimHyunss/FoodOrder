
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Truck, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DriverLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = () => {
    if (username === "Asep" && password === "asep123") {
      localStorage.setItem("driverLoggedIn", "true");
      localStorage.setItem("currentDriver", "Asep");
      toast({
        title: "Login Berhasil!",
        description: "Selamat datang di Driver Panel",
      });
      navigate("/driver/dashboard");
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">
      <div className="w-full max-w-md space-y-6 p-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Truck className="h-10 w-10 text-blue-600" />
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Driver Panel
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Login Driver</h1>
            <p className="text-gray-600">Masuk untuk mengambil pesanan</p>
          </div>
        </div>

        {/* Login Form */}
        <Card className="bg-white/95 backdrop-blur shadow-xl border border-white/20">
          <CardHeader>
            <CardTitle className="text-center text-gray-800">Masuk ke Driver Panel</CardTitle>
            <CardDescription className="text-center text-gray-600">
              Gunakan username dan password driver
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
            <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
              <p><strong>Demo Login:</strong></p>
              <p>Username: Asep</p>
              <p>Password: asep123</p>
            </div>
            <Button onClick={handleLogin} className="w-full gap-2 bg-blue-600 hover:bg-blue-700">
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

export default DriverLogin;
