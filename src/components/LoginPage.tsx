// ============================================
// src/components/LoginPage.tsx - FIXED VERSION
// ============================================
import { useState } from "react";
import { LogIn, User, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import logoImage from "../assets/LogoBK.png";
import { useAuth } from "../AuthContext"; // IMPORTANT: Import useAuth
import { UserRole } from "../App";

type LoginPageProps = {
  onLogin: (email: string, role: UserRole) => void;
};

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Use the auth context
  const { login } = useAuth();

  // Example accounts
  const accounts = {
    student: {
      email: "an.nguyen@hcmut.edu.vn",
      password: "student123",
      role: "student" as const,
    },
    tutor: {
      email: "minh.tran@hcmut.edu.vn",
      password: "tutor123",
      role: "tutor" as const,
    },
    admin: {
      email: "admin@hcmut.edu.vn",
      password: "admin123",
      role: "admin" as const,
    },
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Use API login from AuthContext
      const result = await login(email, password);

      if (result.success) {
        // Find the role from accounts
        const account = Object.values(accounts).find(
          (acc) => acc.email === email
        );
        
        if (account) {
          onLogin(email, account.role); // Call the parent onLogin
        }
      } else {
        setError(result.error || "Email hoặc mật khẩu không đúng. Vui lòng thử lại.");
      }
    } catch (err: any) {
      setError("Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (accountType: "student" | "tutor" | "admin") => {
    const account = accounts[accountType];
    setEmail(account.email);
    setPassword(account.password);
    setError("");
    
    // Auto-login after setting credentials
    setLoading(true);
    
    try {
      const result = await login(account.email, account.password);

      if (result.success) {
        onLogin(account.email, account.role);
      } else {
        setError(result.error || "Đăng nhập thất bại");
      }
    } catch (err) {
      setError("Đã xảy ra lỗi khi đăng nhập");
      console.error("Quick login error:", err);
    } finally {
      setLoading(false);
    }
  };
return (
    <div className="min-h-screen bg-gradient-to-br from-[#030391] via-[#1488D8] to-[#030391] flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <img
              src={logoImage}
              alt="HCMUT Logo"
              className="h-16 w-16 object-contain"
            />
          </div>
          <CardTitle className="text-2xl text-[#030391]">Đăng nhập</CardTitle>
          <p className="text-sm text-gray-500">
            Hệ thống Hỗ trợ Học tập - ĐHBK TP.HCM
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Địa chỉ Email</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="email.cua.ban@hcmut.edu.vn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Nhập mật khẩu của bạn"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full bg-[#1488D8] hover:bg-[#1488D8]/90"
              disabled={loading}
            >
              <LogIn className="h-4 w-4 mr-2" />
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>

            <div className="text-center">
              <a href="#" className="text-sm text-[#1488D8] hover:underline">
                Quên mật khẩu?
              </a>
            </div>
          </form>

          {/* Example Accounts */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-4 text-center">
              Tài khoản Demo - Nhấn để sử dụng:
            </p>

            <Tabs defaultValue="student" className="w-full">
<TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="student">Sinh viên</TabsTrigger>
                <TabsTrigger value="tutor">Giảng viên</TabsTrigger>
                <TabsTrigger value="admin">Quản trị</TabsTrigger>
              </TabsList>

              <TabsContent value="student" className="space-y-3">
                <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-8 w-8 rounded-full bg-[#1488D8] flex items-center justify-center text-white text-sm">
                      S
                    </div>
                    <div>
                      <div className="text-sm">Tài khoản Sinh viên</div>
                      <div className="text-xs text-gray-500">Nguyễn Văn An</div>
                    </div>
                  </div>
                  <div className="text-xs space-y-1">
                    <div>
                      <span className="text-gray-600">Email:</span>{" "}
                      {accounts.student.email}
                    </div>
                    <div>
                      <span className="text-gray-600">Mật khẩu:</span>{" "}
                      {accounts.student.password}
                    </div>
                  </div>
                  <Button
                    onClick={() => handleQuickLogin("student")}
                    variant="outline"
                    size="sm"
                    className="w-full mt-2"
                    disabled={loading}
                  >
                    {loading ? "Đang đăng nhập..." : "Dùng TK Sinh viên"}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="tutor" className="space-y-3">
                <div className="bg-green-50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center text-white text-sm">
                      T
                    </div>
                    <div>
                      <div className="text-sm">Tài khoản Giảng viên</div>
                      <div className="text-xs text-gray-500">
                        TS. Trần Văn Minh
                      </div>
                    </div>
                  </div>
                  <div className="text-xs space-y-1">
                    <div>
                      <span className="text-gray-600">Email:</span>{" "}
                      {accounts.tutor.email}
                    </div>
                    <div>
                      <span className="text-gray-600">Mật khẩu:</span>{" "}
                      {accounts.tutor.password}
                    </div>
                  </div>
                  <Button
                    onClick={() => handleQuickLogin("tutor")}
                    variant="outline"
size="sm"
                    className="w-full mt-2"
                    disabled={loading}
                  >
                    {loading ? "Đang đăng nhập..." : "Dùng TK Giảng viên"}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="admin" className="space-y-3">
                <div className="bg-purple-50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm">
                      A
                    </div>
                    <div>
                      <div className="text-sm">Tài khoản Quản trị</div>
                      <div className="text-xs text-gray-500">
                        Quản trị viên Hệ thống
                      </div>
                    </div>
                  </div>
                  <div className="text-xs space-y-1">
                    <div>
                      <span className="text-gray-600">Email:</span>{" "}
                      {accounts.admin.email}
                    </div>
                    <div>
                      <span className="text-gray-600">Mật khẩu:</span>{" "}
                      {accounts.admin.password}
                    </div>
                  </div>
                  <Button
                    onClick={() => handleQuickLogin("admin")}
                    variant="outline"
                    size="sm"
                    className="w-full mt-2"
                    disabled={loading}
                  >
                    {loading ? "Đang đăng nhập..." : "Dùng TK Quản trị"}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm">
        <p className="text-blue-100">
          © 2025 Đại học Bách Khoa TP. Hồ Chí Minh - ĐHQG-HCM
        </p>
      </div>
    </div>
  );
}
