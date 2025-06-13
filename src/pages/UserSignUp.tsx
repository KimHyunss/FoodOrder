
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Utensils, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const UserSignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [profileImage, setProfileImage] = useState<string>("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Password dan konfirmasi password tidak cocok",
        variant: "destructive"
      });
      return;
    }

    if (!formData.username || !formData.password || !formData.email || !formData.phone) {
      toast({
        title: "Error",
        description: "Semua field harus diisi",
        variant: "destructive"
      });
      return;
    }

    // Save user data to localStorage
    const userData = {
      ...formData,
      profileImage,
      signUpDate: new Date()
    };

    const existingUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    
    // Check if username already exists
    if (existingUsers.some((user: any) => user.username === formData.username)) {
      toast({
        title: "Error",
        description: "Username sudah digunakan",
        variant: "destructive"
      });
      return;
    }

    existingUsers.push(userData);
    localStorage.setItem("registeredUsers", JSON.stringify(existingUsers));

    toast({
      title: "Berhasil!",
      description: "Akun berhasil dibuat. Silakan login."
    });

    navigate("/user/login");
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
          <CardTitle className="text-2xl font-bold text-gray-800">Daftar Akun Baru</CardTitle>
          <CardDescription className="text-gray-600">
            Buat akun untuk mulai memesan makanan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Profile Image Upload */}
            <div className="flex flex-col items-center space-y-2">
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <Upload className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <Label htmlFor="profile-image" className="cursor-pointer text-sm text-primary hover:underline">
                Upload Foto Profil
              </Label>
              <Input
                id="profile-image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-semibold text-gray-700">1. Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Masukkan username"
                className="border-2 border-gray-300 focus:border-primary"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">2. Nomor Telepon</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Masukkan nomor telepon"
                className="border-2 border-gray-300 focus:border-primary"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-gray-700">3. Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Masukkan email"
                className="border-2 border-gray-300 focus:border-primary"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-gray-700">4. Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Masukkan password"
                className="border-2 border-gray-300 focus:border-primary"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700">5. Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Konfirmasi password"
                className="border-2 border-gray-300 focus:border-primary"
                required
              />
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
              Daftar
            </Button>

            <div className="text-center">
              <span className="text-gray-600">Sudah punya akun? </span>
              <Button variant="link" onClick={() => navigate("/user/login")} className="p-0 text-primary">
                Login di sini
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserSignUp;
