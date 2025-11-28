import { Button } from "./ui/button";
import {
  GraduationCap,
  BookOpen,
  Calendar,
  Users,
  Phone,
  MapPin,
  Mail,
  ArrowRight,
} from "lucide-react";
import logoImage from "../assets/LogoBK.png";

type HomepageProps = {
  onNavigateToLogin: () => void;
};

export function Homepage({ onNavigateToLogin }: HomepageProps) {
  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-[#030391] via-[#1488D8] to-[#030391]">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img
              src={logoImage}
              alt="HCMUT Logo"
              className="h-14 w-14 object-contain"
            />
            <div>
              <h1 className="text-[#030391]">Hệ thống Hỗ trợ Học tập</h1>
              <p className="text-sm text-gray-600">Đại học Bách Khoa TP.HCM</p>
            </div>
          </div>
          <Button
            onClick={onNavigateToLogin}
            className="bg-[#1488D8] hover:bg-[#1488D8]/90"
          >
            Đăng nhập
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Column */}
            <div className="text-white space-y-6">
              <h1 className="text-5xl">
                Kết nối Sinh viên
                <br />
                và Giảng viên
              </h1>
              <p className="text-xl text-blue-100">
                Nền tảng hỗ trợ học tập chuyên môn, quản lý buổi học và theo dõi
                tiến độ cho sinh viên ĐHBK TP.HCM
              </p>

              {/* Stats */}
              <div className="flex gap-8 pt-4">
                <div>
                  <div className="text-3xl">500+</div>
                  <div className="text-sm text-blue-100">Sinh viên</div>
                </div>
                <div>
                  <div className="text-3xl">50+</div>
                  <div className="text-sm text-blue-100">Giảng viên</div>
                </div>
                <div>
                  <div className="text-3xl">1000+</div>
                  <div className="text-sm text-blue-100">Buổi học</div>
                </div>
              </div>

              <Button
                onClick={onNavigateToLogin}
                size="lg"
                className="bg-white text-[#030391] hover:bg-gray-100 mt-6"
              >
                Bắt đầu ngay
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>

            {/* Right Column - Features */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 hover:shadow-xl transition-shadow">
                <div className="h-12 w-12 bg-[#1488D8]/10 rounded-lg flex items-center justify-center mb-3">
                  <Users className="h-6 w-6 text-[#1488D8]" />
                </div>
                <h3 className="text-[#030391] mb-2">Tìm Giảng viên</h3>
                <p className="text-sm text-gray-600">
                  Kết nối với giảng viên phù hợp từ nhiều khoa
                </p>
              </div>

              <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 hover:shadow-xl transition-shadow">
                <div className="h-12 w-12 bg-[#1488D8]/10 rounded-lg flex items-center justify-center mb-3">
                  <Calendar className="h-6 w-6 text-[#1488D8]" />
                </div>
                <h3 className="text-[#030391] mb-2">Đặt lịch học</h3>
                <p className="text-sm text-gray-600">
                  Đặt lịch trực tuyến hoặc trực tiếp dễ dàng
                </p>
              </div>

              <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 hover:shadow-xl transition-shadow">
                <div className="h-12 w-12 bg-[#1488D8]/10 rounded-lg flex items-center justify-center mb-3">
                  <BookOpen className="h-6 w-6 text-[#1488D8]" />
                </div>
                <h3 className="text-[#030391] mb-2">Thư viện</h3>
                <p className="text-sm text-gray-600">
                  Truy cập tài liệu học tập và tài nguyên
                </p>
              </div>

              <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 hover:shadow-xl transition-shadow">
                <div className="h-12 w-12 bg-[#1488D8]/10 rounded-lg flex items-center justify-center mb-3">
                  <GraduationCap className="h-6 w-6 text-[#1488D8]" />
                </div>
                <h3 className="text-[#030391] mb-2">Theo dõi</h3>
                <p className="text-sm text-gray-600">
                  Theo dõi giờ học và tiến độ học tập
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/5 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-wrap justify-between items-center gap-4 text-white/90">
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>268 Lý Thường Kiệt, Q.10, TP.HCM</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>(028) 3865 4242</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>info@hcmut.edu.vn</span>
              </div>
            </div>
            <p className="text-sm text-white/70">
              © 2025 ĐHBK TP.HCM - ĐHQG-HCM
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
