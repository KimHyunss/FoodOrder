
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Utensils, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const UserLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check registered users first
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    const user = registeredUsers.find((u: any) => u.username === username && u.password === password);
    
    if (user) {
      localStorage.setItem("userLoggedIn", "true");
      localStorage.setItem("currentUser", username);
      localStorage.setItem("currentUserData", JSON.stringify(user));
      
      toast({
        title: "Login berhasil!",
        description: `Selamat datang, ${username}!`,
      });
      
      navigate("/");
      return;
    }

    // Fallback to default user
    if (username === "UserX" && password === "User123") {
      localStorage.setItem("userLoggedIn", "true");
      localStorage.setItem("currentUser", username);
      
      toast({
        title: "Login berhasil!",
        description: `Selamat datang, ${username}!`,
      });
      
      navigate("/");
    } else {
      toast({
        title: "Login gagal",
        description: "Username atau password salah",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur shadow-xl border border-white/20">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4 cursor-pointer" onClick={() => navigate("/")}>
            <Utensils className="h-8 w-8 text-primary mr-2" />
            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              FoodOrder
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">Login User</CardTitle>
          <CardDescription className="text-gray-600">
            Masuk untuk mulai memesan makanan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
            
            <div className="text-center space-y-2">
              <div>
                <span className="text-gray-600">Belum punya akun? </span>
                <Button variant="link" onClick={() => navigate("/user/signup")} className="p-0">
                  Daftar di sini
                </Button>
              </div>
              <Button variant="outline" onClick={() => navigate("/")} className="w-full gap-2">
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

export default UserLogin;
