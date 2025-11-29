import { useState } from "react";
import { LogIn, User, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import logoImage from "../assets/LogoBK.png";
import { useAuth } from "../AuthContext"; // Import useAuth hook

type LoginPageProps = {
  // Cập nhật: onLogin bây giờ chủ yếu dùng để trigger chuyển view trong App.tsx
  // sau khi AuthContext đã cập nhật state user.
  onLogin: (
    email: string,
    role: "student" | "tutor" | "coordinator" | "admin"
  ) => void;
};

export function LoginPage({ onLogin }: LoginPageProps) {
  const { login } = useAuth(); // Lấy hàm login từ Context
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Dữ liệu mẫu chỉ dùng để điền nhanh form (Quick Fill)
  // Mật khẩu ở đây cần khớp với database backend của bạn
  const demoAccounts = {
    student: {
      email: "an.nguyen@hcmut.edu.vn",
      password: "student123", // Đảm bảo password này đúng với DB
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
      // Gọi API Login thông qua AuthContext
      const result = await login(email, password);

      if (result.success) {
        // Nếu thành công, AuthContext đã lưu user.
        // Ta gọi onLogin để App.tsx biết và ẩn Homepage/chuyển view.
        // Lưu ý: Cần lấy role thực tế từ user trong context,
        // nhưng ở đây ta có thể lấy tạm từ demoAccounts hoặc để App tự xử lý user hiện tại.
        // Để tương thích với prop onLogin cũ, ta truyền email và role (nếu có).

        // Trong thực tế, App.tsx nên check user từ context,
        // nhưng ta vẫn gọi callback này để giữ luồng UI cũ.

        // Cố gắng xác định role từ danh sách demo hoặc mặc định là student để UI chuyển hướng đúng
        let detectedRole: "student" | "tutor" | "coordinator" | "admin" =
          "student";

        // Logic phụ để đoán role nếu API không trả về trực tiếp ở đây (tùy implementation của login hook)
        // Tuy nhiên, AuthContext của bạn update user state async.
        // Cách an toàn nhất là gọi onLogin, và App.tsx sẽ render lại dựa trên isAuthenticated.

        // Giả lập lấy role từ input email để khớp logic cũ (nếu cần)
        if (email.includes("admin")) detectedRole = "admin";
        else if (email.includes("tutor") || email.includes("minh"))
          detectedRole = "tutor";

        onLogin(email, detectedRole);
      } else {
        // Hiển thị lỗi từ API
        setError(
          result.error ||
            "Đăng nhập thất bại. Vui lòng kiểm tra email và mật khẩu."
        );
      }
    } catch (err) {
      setError("Đã xảy ra lỗi kết nối. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (accountType: "student" | "tutor" | "admin") => {
    const account = demoAccounts[accountType];
    setEmail(account.email);
    setPassword(account.password);
    setError("");
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

          {/* Demo Accounts Section */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-4 text-center">
              Tài khoản Demo (Nhấn để điền form):
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
                      {demoAccounts.student.email}
                    </div>
                    <div>
                      <span className="text-gray-600">Mật khẩu:</span>{" "}
                      {demoAccounts.student.password}
                    </div>
                  </div>
                  <Button
                    onClick={() => handleQuickLogin("student")}
                    variant="outline"
                    size="sm"
                    className="w-full mt-2"
                  >
                    Điền TK Sinh viên
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
                      {demoAccounts.tutor.email}
                    </div>
                    <div>
                      <span className="text-gray-600">Mật khẩu:</span>{" "}
                      {demoAccounts.tutor.password}
                    </div>
                  </div>
                  <Button
                    onClick={() => handleQuickLogin("tutor")}
                    variant="outline"
                    size="sm"
                    className="w-full mt-2"
                  >
                    Điền TK Giảng viên
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
                      {demoAccounts.admin.email}
                    </div>
                    <div>
                      <span className="text-gray-600">Mật khẩu:</span>{" "}
                      {demoAccounts.admin.password}
                    </div>
                  </div>
                  <Button
                    onClick={() => handleQuickLogin("admin")}
                    variant="outline"
                    size="sm"
                    className="w-full mt-2"
                  >
                    Điền TK Quản trị
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
