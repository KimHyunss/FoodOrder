
import { useState, useEffect } from "react";
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
  const [language, setLanguage] = useState("id");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const getLanguageText = () => {
    if (language === "en") {
      return {
        driverPanel: "Driver Panel",
        driverLogin: "Driver Login",
        loginToTakeOrders: "Login to take orders",
        loginToDriverPanel: "Login to Driver Panel",
        useDriverCredentials: "Use driver username and password",
        username: "Username",
        enterUsername: "Enter username",
        password: "Password",
        enterPassword: "Enter password",
        demoLogin: "Demo Login:",
        login: "Login",
        backToHome: "Back to Home",
        loginSuccess: "Login Successful!",
        welcomeToDriverPanel: "Welcome to Driver Panel",
        loginFailed: "Login Failed",
        wrongCredentials: "Wrong username or password"
      };
    }
    return {
      driverPanel: "Panel Driver",
      driverLogin: "Login Driver",
      loginToTakeOrders: "Masuk untuk mengambil pesanan",
      loginToDriverPanel: "Masuk ke Driver Panel",
      useDriverCredentials: "Gunakan username dan password driver",
      username: "Username",
      enterUsername: "Masukkan username",
      password: "Password",
      enterPassword: "Masukkan password",
      demoLogin: "Demo Login:",
      login: "Masuk",
      backToHome: "Kembali ke Home",
      loginSuccess: "Login Berhasil!",
      welcomeToDriverPanel: "Selamat datang di Driver Panel",
      loginFailed: "Login Gagal",
      wrongCredentials: "Username atau password salah"
    };
  };

  const text = getLanguageText();

  const handleLogin = () => {
    if (username === "Asep" && password === "asep123") {
      localStorage.setItem("driverLoggedIn", "true");
      localStorage.setItem("currentDriver", "Asep");
      toast({
        title: text.loginSuccess,
        description: text.welcomeToDriverPanel,
      });
      navigate("/driver/dashboard");
    } else {
      toast({
        title: text.loginFailed,
        description: text.wrongCredentials,
        variant: "destructive"
      });
    }
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-blue-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
      <div className="w-full max-w-md space-y-6 p-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Truck className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              {text.driverPanel}
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{text.driverLogin}</h1>
            <p className="text-gray-600 dark:text-gray-400">{text.loginToTakeOrders}</p>
          </div>
        </div>

        {/* Login Form */}
        <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur shadow-xl border border-white/20 dark:border-gray-700/20">
          <CardHeader>
            <CardTitle className="text-center text-gray-800 dark:text-gray-200">{text.loginToDriverPanel}</CardTitle>
            <CardDescription className="text-center text-gray-600 dark:text-gray-400">
              {text.useDriverCredentials}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="username" className="text-gray-700 dark:text-gray-300">{text.username}</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={text.enterUsername}
                className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">{text.password}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={text.enterPassword}
                className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              />
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <p><strong>{text.demoLogin}</strong></p>
              <p>Username: Asep</p>
              <p>Password: asep123</p>
            </div>
            <Button onClick={handleLogin} className="w-full gap-2 bg-blue-600 hover:bg-blue-700">
              <LogIn size={16} />
              {text.login}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleBackToHome} 
              className="w-full gap-2 dark:border-gray-600 dark:text-gray-300"
            >
              <ArrowLeft size={16} />
              {text.backToHome}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DriverLogin;
