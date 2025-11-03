import { Home, Users, Calendar, Clock, FileText, User, Menu, X, BookOpen, MessageSquare, LogOut } from 'lucide-react';
import { User as UserType } from '../App';
import { Button } from './ui/button';

type SidebarProps = {
  currentView: string;
  setCurrentView: (view: string) => void;
  user: UserType;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  logoImage: string;
  onLogout?: () => void;
};

export function Sidebar({ currentView, setCurrentView, user, isOpen, setIsOpen, logoImage, onLogout }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Tổng quan', icon: Home, roles: ['student', 'tutor', 'coordinator', 'admin'] },
    { id: 'tutors', label: 'Tìm gia sư', icon: Users, roles: ['student'] },
    { id: 'sessions', label: 'Buổi học của tôi', icon: Calendar, roles: ['student', 'tutor'] },
    { id: 'feedback', label: 'Đánh giá buổi học', icon: MessageSquare, roles: ['student'] },
    { id: 'availability', label: 'Lịch dạy & Buổi học', icon: Clock, roles: ['tutor'] },
    { id: 'library', label: 'Thư viện tài liệu', icon: BookOpen, roles: ['student', 'tutor'] },
    { id: 'reports', label: 'Báo cáo & Phân tích', icon: FileText, roles: ['coordinator'] },
    { id: 'profile', label: 'Hồ sơ cá nhân', icon: User, roles: ['student', 'tutor', 'coordinator'] },
  ];

  const filteredMenuItems = menuItems.filter((item) => item.roles.includes(user.role));

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed lg:relative lg:translate-x-0 z-30 w-64 bg-[#030391] text-white flex flex-col transition-transform duration-300 ease-in-out`}
      >
        {/* Logo and close button */}
        <div className="p-4 border-b border-blue-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoImage} alt="HCMUT Logo" className="h-12 w-12 object-contain" />
            <div>
              <div className="text-sm opacity-90">HCMUT</div>
              <div className="text-xs opacity-75">Tutor System</div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-white hover:bg-blue-800"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id);
                  if (window.innerWidth < 1024) {
                    setIsOpen(false);
                  }
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-[#1488D8] text-white'
                    : 'text-blue-100 hover:bg-blue-800'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User info and Logout */}
        <div className="p-4 border-t border-blue-800 space-y-3">
          <div>
            <div className="text-xs opacity-75 mb-1">Đăng nhập với</div>
            <div className="text-sm">{user.name}</div>
            <div className="text-xs opacity-75 capitalize">
              {user.role === 'student' && 'Sinh viên'}
              {user.role === 'tutor' && 'Gia sư'}
              {user.role === 'coordinator' && 'Điều phối viên'}
              {user.role === 'admin' && 'Quản trị viên'}
            </div>
          </div>
          <Button
            onClick={onLogout}
            variant="ghost"
            className="w-full justify-start text-red-300 hover:text-red-100 hover:bg-red-900/20"
          >
            <LogOut className="h-4 w-4 mr-3" />
            Đăng xuất
          </Button>
        </div>
      </div>
    </>
  );
}
