
import { useState, useEffect } from "react";
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
        userLogin: "User Login",
        loginToStartOrdering: "Login to start ordering food",
        username: "Username",
        enterUsername: "Enter username",
        password: "Password", 
        enterPassword: "Enter password",
        login: "Login",
        dontHaveAccount: "Don't have an account?",
        registerHere: "Register here",
        backToHome: "Back to Home",
        loginSuccess: "Login successful!",
        welcome: "Welcome",
        loginFailed: "Login failed",
        wrongCredentials: "Wrong username or password"
      };
    }
    return {
      userLogin: "Login User",
      loginToStartOrdering: "Masuk untuk mulai memesan makanan",
      username: "Username",
      enterUsername: "Masukkan username",
      password: "Password",
      enterPassword: "Masukkan password", 
      login: "Login",
      dontHaveAccount: "Belum punya akun?",
      registerHere: "Daftar di sini",
      backToHome: "Kembali ke Home",
      loginSuccess: "Login berhasil!",
      welcome: "Selamat datang",
      loginFailed: "Login gagal",
      wrongCredentials: "Username atau password salah"
    };
  };

  const text = getLanguageText();

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
        title: text.loginSuccess,
        description: `${text.welcome}, ${username}!`,
      });
      
      navigate("/");
      return;
    }

    // Fallback to default user
    if (username === "UserX" && password === "User123") {
      const defaultUserData = {
        username: "UserX",
        phone: "",
        email: "",
        address: ""
      };
      
      localStorage.setItem("userLoggedIn", "true");
      localStorage.setItem("currentUser", username);
      localStorage.setItem("currentUserData", JSON.stringify(defaultUserData));
      
      toast({
        title: text.loginSuccess,
        description: `${text.welcome}, ${username}!`,
      });
      
      navigate("/");
    } else {
      toast({
        title: text.loginFailed,
        description: text.wrongCredentials,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/95 dark:bg-gray-800/95 backdrop-blur shadow-xl border border-white/20 dark:border-gray-700/20">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4 cursor-pointer" onClick={() => navigate("/")}>
            <Utensils className="h-8 w-8 text-primary mr-2" />
            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              FoodOrder
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-200">{text.userLogin}</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            {text.loginToStartOrdering}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="dark:text-gray-300">{text.username}</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={text.enterUsername}
                required
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="dark:text-gray-300">{text.password}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={text.enterPassword}
                required
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              />
            </div>
            <Button type="submit" className="w-full">
              {text.login}
            </Button>
            
            <div className="text-center space-y-2">
              <div>
                <span className="text-gray-600 dark:text-gray-400">{text.dontHaveAccount} </span>
                <Button variant="link" onClick={() => navigate("/user/signup")} className="p-0">
                  {text.registerHere}
                </Button>
              </div>
              <Button variant="outline" onClick={() => navigate("/")} className="w-full gap-2 dark:border-gray-600 dark:text-gray-300">
                <ArrowLeft size={16} />
                {text.backToHome}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserLogin;
