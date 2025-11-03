import { Bell, Menu, LogOut, User as UserIcon, Settings } from 'lucide-react';
import { User } from '../App';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback } from './ui/avatar';

type HeaderProps = {
  user: User;
  toggleSidebar: () => void;
  onLogout?: () => void;
};

export function Header({ user, toggleSidebar, onLogout }: HeaderProps) {
  const notifications = [
    { id: 1, message: 'Buổi học mới được lên lịch vào ngày mai', time: '10 phút trước' },
    { id: 2, message: 'Gia sư của bạn đã gửi tin nhắn', time: '1 giờ trước' },
    { id: 3, message: 'Yêu cầu đánh giá buổi học', time: '2 giờ trước' },
  ];

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-gray-900">Chào mừng trở lại, {user.name.split(' ').slice(-1)[0]}!</h1>
            <p className="text-sm text-gray-500">
              {user.faculty}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                  {notifications.length}
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="p-2">
                <div className="mb-2 text-gray-900">Thông báo</div>
                {notifications.map((notif) => (
                  <DropdownMenuItem key={notif.id} className="flex flex-col items-start p-3 cursor-pointer">
                    <div className="text-sm text-gray-900">{notif.message}</div>
                    <div className="text-xs text-gray-500">{notif.time}</div>
                  </DropdownMenuItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                <Avatar>
                  <AvatarFallback className="bg-[#1488D8] text-white">
                    {user.name.split(' ').map((n) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                  <Badge variant="secondary" className="w-fit text-xs">
                    {user.role === 'student' && 'Sinh viên'}
                    {user.role === 'tutor' && 'Gia sư'}
                    {user.role === 'coordinator' && 'Điều phối viên'}
                    {user.role === 'admin' && 'Quản trị viên'}
                  </Badge>
                </div>
              </div>
              <DropdownMenuSeparator />
              {user.role !== 'admin' && (
                <>
                  <DropdownMenuItem>
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Hồ sơ cá nhân</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Cài đặt</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem 
                onClick={onLogout}
                className="text-red-600 focus:text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Đăng xuất</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
