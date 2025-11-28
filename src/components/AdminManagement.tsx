import { useState, useMemo } from 'react';
import { UserPlus, Edit, Trash2, Shield, Bell, RefreshCw, Search, Filter, Settings, FileSearch, Download } from 'lucide-react'; 
import { User } from '../App';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "./ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";

type AdminManagementProps = {
  user: User;
};

type SystemUser = {
  id: string;
  name: string;
  email: string;
  role: "student" | "tutor" | "coordinator" | "admin";
  faculty?: string;
  status: "active" | "inactive";
  joinDate: string;
};

export function AdminManagement({ user }: AdminManagementProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [users, setUsers] = useState<SystemUser[]>([
    {
      id: "1810123",
      name: "Nguyễn Văn An",
      email: "an.nguyen@hcmut.edu.vn",
      role: "student",
      faculty: "Khoa Khoa học và Kỹ thuật Máy tính",
      status: "active",
      joinDate: "2023-09-01",
    },
    {
      id: "T001",
      name: "TS. Trần Văn Minh",
      email: "minh.tran@hcmut.edu.vn",
      role: "tutor",
      faculty: "Khoa Khoa học và Kỹ thuật Máy tính",
      status: "active",
      joinDate: "2020-01-15",
    },
    {
      id: "1810456",
      name: "Lê Thị Mai",
      email: "mai.le@hcmut.edu.vn",
      role: "student",
      faculty: "Khoa Điện - Điện tử",
      status: "active",
      joinDate: "2023-09-01",
    },
    {
      id: "T002",
      name: "ThS. Lê Thị Hoa",
      email: "hoa.le@hcmut.edu.vn",
      role: "tutor",
      faculty: "Khoa Khoa học và Kỹ thuật Máy tính",
      status: "active",
      joinDate: "2021-03-20",
    },
    {
      id: 'A001',
      name: 'Trương Đình Khải',
      email: 'khai.truong@hcmut.edu.vn',
      role: 'admin',
      faculty: 'Phòng Đào tạo',
      status: 'active',
      joinDate: '2019-10-01',
    },
    {
      id: 'A001',
      name: 'Trương Đình Khải',
      email: 'khai.truong@hcmut.edu.vn',
      role: 'admin',
      faculty: 'Phòng Đào tạo',
      status: 'active',
      joinDate: '2019-10-01',
    },
  ]);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleAddUser = (userData: Partial<SystemUser>) => {
    const newUser: SystemUser = {
      id: Date.now().toString(),
      name: userData.name || "",
      email: userData.email || "",
      role: userData.role || "student",
      faculty: userData.faculty,
      status: "active",
      joinDate: new Date().toISOString().split("T")[0],
    };
    setUsers([...users, newUser]);
    toast.success("Thêm người dùng thành công", {
      description: `${newUser.name} đã được thêm vào hệ thống`,
    });
  };

  const handleEditUser = (userId: string, updates: Partial<SystemUser>) => {
    const user = users.find(u => u.id === userId);
    
    // Giả lập kiểm tra ràng buộc khi thay đổi vai trò (Mô phỏng Sequence Diagram)
    if (updates.role && user && updates.role !== user.role) {
        // Giả lập lỗi vi phạm ràng buộc (Ví dụ: không thể hạ cấp admin chính)
        if (user.id === 'A001' && updates.role !== 'admin') {
             toast.error('Vi phạm Ràng buộc Phân quyền', {
                description: 'Không thể hạ cấp Quản trị viên cao nhất.',
             });
             return;
        }
    }
    
    setUsers(users.map((u) => (u.id === userId ? { ...u, ...updates } : u)));
    
    // Thông báo sau khi thay đổi
    if (updates.role && user && updates.role !== user.role) {
        toast.success('Phân quyền thành công', {
             description: `Vai trò của ${user.name} đã được cập nhật thành ${updates.role}.`,
             duration: 2500
        });
    } else {
        toast.success('Cập nhật thông tin thành công');
    }
  };

  const handleDeleteUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    setUsers(users.filter((u) => u.id !== userId));
    toast.success("Xóa người dùng thành công", {
      description: `${user?.name} đã được xóa khỏi hệ thống`,
    });
  };

  const handleSyncData = () => {
    toast.info('Đang yêu cầu đồng bộ dữ liệu HCMUT...', {
      description: 'Kiểm tra trạng thái kết nối API...',
      duration: 1500
    });
    setTimeout(() => {
      const isApiError = Math.random() < 0.1; 
      const isViolationError = !isApiError && Math.random() < 0.1;
      
      if (isApiError) {
        toast.error('Lỗi kết nối DATACORE', {
             description: 'Không thể kết nối với HCMUT_DATACORE.',
             duration: 4000
        });
      } else if (isViolationError) {
        toast.error('Lỗi vi phạm đồng bộ', {
             description: 'Dữ liệu đồng bộ vi phạm ràng buộc hệ thống.',
             duration: 4000
        });
      }
      else {
        toast.success('Đồng bộ thành công', {
          description: 'Dữ liệu đã được cập nhật từ HCMUT_DATACORE.',
          duration: 3000
        });
      }
    }, 2500);
  };

  const stats = [
    { label: "Tổng người dùng", value: users.length, color: "text-blue-600" },
    {
      label: "Sinh viên",
      value: users.filter((u) => u.role === "student").length,
      color: "text-green-600",
    },
    {
      label: "Gia sư",
      value: users.filter((u) => u.role === "tutor").length,
      color: "text-purple-600",
    },
    {
      label: "Hoạt động",
      value: users.filter((u) => u.status === "active").length,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-gray-900 mb-2">Quản lý Hệ thống</h2>
          <p className="text-gray-500">
            Quản lý người dùng, phân quyền và đồng bộ dữ liệu
          </p>
        </div>
        
        <Button
          onClick={handleSyncData}
          className="flex items-center gap-2 bg-[#1488D8] hover:bg-[#1488D8]/90 text-white" 
        >
          <RefreshCw className="h-4 w-4" />
          Đồng bộ dữ liệu
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className={`text-3xl mt-2 ${stat.color}`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="account-permission" className="space-y-6">
        <TabsList>
          <TabsTrigger value="account-permission">Quản lý Tài khoản & Phân quyền</TabsTrigger>
          <TabsTrigger value="reports">Báo cáo Tổng hợp</TabsTrigger>
          <TabsTrigger value="config">Cấu hình Hệ thống</TabsTrigger>
        </TabsList>

        <TabsContent value="account-permission" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Danh sách Người dùng</span>
                <AddUserDialog onAdd={handleAddUser} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Search and Filters */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Tìm kiếm theo tên, email hoặc ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Tất cả vai trò" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả vai trò</SelectItem>
                    <SelectItem value="student">Sinh viên</SelectItem>
                    <SelectItem value="tutor">Gia sư</SelectItem>
                    <SelectItem value="admin">Quản trị viên</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Users List */}
              <div className="space-y-3">
                {filteredUsers.map((u) => (
                  <UserCard
                    key={u.id}
                    user={u}
                    onEdit={handleEditUser} 
                    onDelete={handleDeleteUser}
                    showRoleSelect={true}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports">
          <ReportsPanel users={users} />
        </TabsContent>
        
        <TabsContent value="config">
          <SystemConfigPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AddUserDialog({
  onAdd,
}: {
  onAdd: (user: Partial<SystemUser>) => void;
}) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "student" as "student" | "tutor" | "coordinator" | "admin",
    faculty: "",
// Đại diện cho "Quản lý tham số hệ thống/Backup" & "Thực hiện khôi phục"
function SystemConfigPanel() {
  const handleBackup = () => {
    toast.info('Đang tạo bản sao lưu hệ thống...');
    setTimeout(() => {
      toast.success('Sao lưu thành công', { description: 'Tạo bản sao lưu cơ sở dữ liệu và tệp thành công.' });
    }, 1500);
  };

  const handleRestore = () => {
    toast.warning('Đang thực hiện khôi phục dữ liệu...', {
        description: 'Thao tác này sẽ ghi đè dữ liệu hiện tại.',
        duration: 3000
    });
    setTimeout(() => {
      toast.success('Khôi phục thành công', { description: 'Hệ thống đã được khôi phục về trạng thái trước đó.' });
    }, 2500);
  };
    
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-[#1488D8]" />
          Cấu hình Hệ thống & Backup
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
            <h4 className="text-lg font-semibold">Tham số Hệ thống</h4>
            <p className="text-gray-500">Quản lý các tham số cấu hình chung của hệ thống (Ví dụ: Thời gian hết hạn phiên, giới hạn tệp tải lên).</p>
            <Button variant="outline">Chỉnh sửa Tham số</Button>
        </div>

        <div className="space-y-2 border-t pt-4">
            <h4 className="text-lg font-semibold">Quản lý Backup & Khôi phục</h4>
            <p className="text-gray-500">Quản lý các bản sao lưu cơ sở dữ liệu và tệp.</p>
            <div className="flex gap-4">
                <Button onClick={handleBackup} className="bg-green-600 hover:bg-green-700">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Thực hiện Backup
                </Button>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
                            Khôi phục Dữ liệu
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-red-600">Xác nhận Khôi phục</AlertDialogTitle>
                            <AlertDialogDescription>
                                Thao tác này sẽ khôi phục hệ thống về bản sao lưu gần nhất. Dữ liệu hiện tại có thể bị mất. Bạn có chắc chắn muốn tiếp tục?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                            <AlertDialogAction onClick={handleRestore} className="bg-red-600 hover:bg-red-700">
                                Xác nhận Khôi phục
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Đại diện cho "Quản lý báo cáo tổng hợp" & "Tạo báo cáo tổng hợp" 
function ReportsPanel({ users }: { users: SystemUser[] }) {
  // Lấy danh sách Tutor và Admin
  const reportingUsers = users.filter(u => u.role === 'tutor' || u.role === 'admin');

  // Dữ liệu báo cáo giả lập (Báo cáo của từng Tutor/Admin)
  const [reports, setReports] = useState(
    reportingUsers.map((u, index) => ({
      id: `${u.id}-rpt-${index + 1}`,
      reporterName: u.name,
      reporterRole: u.role,
      date: new Date(new Date().setDate(new Date().getDate() - index)).toLocaleDateString('vi-VN'),
      status: index % 3 === 0 ? 'Đã gửi' : 'Đang chờ',
    }))
  );
  
  const [selectedReports, setSelectedReports] = useState<string[]>([]);

  const handleToggleReport = (reportId: string) => {
    setSelectedReports(prev => 
        prev.includes(reportId) 
        ? prev.filter(id => id !== reportId)
        : [...prev, reportId]
    );
  };
    
  const handleCompileAndSend = () => {
    if (selectedReports.length === 0) {
      toast.error('Vui lòng chọn ít nhất một báo cáo để tổng hợp.');
      return;
    }
    
    // LƯU TRỮ giá trị selectedReports hiện tại trước khi xóa state
    const reportsToCompile = selectedReports;
    
    toast.info('Đang tổng hợp báo cáo và chuẩn bị gửi đi...', {
        description: `Tổng hợp ${reportsToCompile.length} báo cáo con.`,
        duration: 3000
    });
    
    // Xóa ngay danh sách báo cáo đã chọn trên giao diện
    setSelectedReports([]); 

    setTimeout(() => {
      // Cập nhật trạng thái các báo cáo con đã chọn thành 'Đã gửi'
      setReports(prev => prev.map(r => reportsToCompile.includes(r.id) ? { ...r, status: 'Đã gửi' } : r));
      
      // SỬ DỤNG biến đã lưu (reportsToCompile)
      toast.success('Gửi Báo cáo Tổng hợp thành công', { 
          description: `Admin đã tổng hợp và gửi đi báo cáo gồm ${reportsToCompile.length} tài liệu.`
      });
    }, 2500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSearch className="h-5 w-5 text-[#1488D8]" />
          Quản lý Báo cáo Tutor & Admin
        </CardTitle>
        <p className="text-sm text-gray-500">Chọn các báo cáo con để tổng hợp và gửi báo cáo cuối cùng.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* THANH TÁC VỤ TỔNG HỢP */}
        <div className="flex justify-between items-center p-3 border rounded-lg bg-gray-50">
            <span className="text-sm text-gray-700">
                Đã chọn: **{selectedReports.length}** báo cáo con
            </span>
            <Button 
                onClick={handleCompileAndSend} 
                disabled={selectedReports.length === 0}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
            >
                <Bell className="h-4 w-4 mr-2" />
                Tổng hợp & Gửi đi
            </Button>
        </div>

        {/* DANH SÁCH BÁO CÁO CON */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {reports.map((r) => (
            <div
              key={r.id}
              className={`flex items-center justify-between p-4 border rounded-lg transition-colors cursor-pointer ${
                selectedReports.includes(r.id) ? 'border-[#1488D8] bg-blue-50' : 'hover:border-gray-400'
              }`}
              onClick={() => handleToggleReport(r.id)}
            >
              <div className="flex items-center gap-3">
                <Input 
                    type="checkbox" 
                    checked={selectedReports.includes(r.id)} 
                    readOnly
                    className="w-4 h-4 text-[#1488D8] focus:ring-[#1488D8]"
                />
                <div>
                  <p className="text-gray-900 font-medium">Báo cáo: {r.reporterName} ({r.reporterRole})</p>
                  <p className="text-sm text-gray-500">Ngày tạo: {r.date}</p>
                </div>
              </div>
              <Badge variant={r.status === 'Đã gửi' ? 'default' : 'secondary'} className={r.status === 'Đã gửi' ? 'bg-green-500 hover:bg-green-600' : ''}>
                {r.status}
              </Badge>
            </div>
          ))}
        </div>
        
      </CardContent>
    </Card>
  );
}


function AddUserDialog({ onAdd }: { onAdd: (user: Partial<SystemUser>) => void }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'student' as 'student' | 'tutor' | 'admin',
    faculty: '',
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.email) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }
    onAdd(formData);
    setOpen(false);
    setFormData({ name: "", email: "", role: "student", faculty: "" });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#1488D8] hover:bg-[#1488D8]/90">
          <UserPlus className="h-4 w-4 mr-2" />
          Thêm người dùng
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm người dùng mới</DialogTitle>
          <DialogDescription>
            Nhập thông tin người dùng mới vào hệ thống
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="name">Họ và tên</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Nguyễn Văn A"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="email@hcmut.edu.vn"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="role">Vai trò</Label>
            <Select
              value={formData.role}
              onValueChange={(value: any) =>
                setFormData({ ...formData, role: value })
              }
            >
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Sinh viên</SelectItem>
                <SelectItem value="tutor">Gia sư</SelectItem>
                <SelectItem value="admin">Quản trị viên</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="faculty">Khoa</Label>
            <Input
              id="faculty"
              value={formData.faculty}
              onChange={(e) =>
                setFormData({ ...formData, faculty: e.target.value })
              }
              placeholder="Khoa Khoa học và Kỹ thuật Máy tính"
              className="mt-2"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-[#1488D8] hover:bg-[#1488D8]/90"
          >
            Thêm người dùng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function UserCard({
  user,
  onEdit,
  onDelete,
  showRoleSelect,
}: {
  user: SystemUser;
  onEdit: (id: string, updates: Partial<SystemUser>) => void;
  onDelete: (id: string) => void;
  showRoleSelect: boolean;
}) {
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState(user);

  const roleLabels = {
    student: "Sinh viên",
    tutor: "Gia sư",
    coordinator: "Điều phối viên",
    admin: "Quản trị viên",
  };

  const roleColors = {
    student: "bg-blue-100 text-blue-700",
    tutor: "bg-purple-100 text-purple-700",
    coordinator: "bg-green-100 text-green-700",
    admin: "bg-red-100 text-red-700",
    student: 'Sinh viên',
    tutor: 'Gia sư',
    admin: 'Quản trị viên',
  };

  const roleColors = {
    student: 'bg-blue-100 text-blue-700',
    tutor: 'bg-purple-100 text-purple-700',
    admin: 'bg-red-100 text-red-700',
  };

  const handleEdit = () => {
    onEdit(user.id, editData);
    setEditOpen(false);
  };
  
  const handleRoleChange = (newRole: SystemUser['role']) => {
    onEdit(user.id, { role: newRole });
  };

  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-[#1488D8] transition-colors">
      <div className="flex items-center gap-4 flex-1">
        <Avatar className="h-12 w-12">
          <AvatarFallback className="bg-[#1488D8] text-white">
            {user.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-gray-900">{user.name}</h3>
            
            {!showRoleSelect && (
                 <Badge className={roleColors[user.role]} variant="secondary">
                    {roleLabels[user.role]}
                 </Badge>
            )}
            {user.status === 'active' && (
              <Badge className="bg-green-100 text-green-700" variant="secondary">
                Hoạt động
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-600">{user.email}</p>
          <p className="text-xs text-gray-500">
            {user.faculty} • ID: {user.id}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        
        {showRoleSelect && (
             <Select
                value={user.role}
                onValueChange={handleRoleChange}
             >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="student">Sinh viên</SelectItem>
                    <SelectItem value="tutor">Gia sư</SelectItem>
                    <SelectItem value="admin">Quản trị viên</SelectItem>
                </SelectContent>
             </Select>
        )}
        
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Sửa thông tin người dùng</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>Họ và tên</Label>
                <Input
                  value={editData.name}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  value={editData.email}
                  onChange={(e) =>
                    setEditData({ ...editData, email: e.target.value })
                  }
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Khoa</Label>
                <Input
                  value={editData.faculty || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, faculty: e.target.value })
                  }
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Trạng thái</Label>
                <Select
                  value={editData.status}
                  onValueChange={(value: any) =>
                    setEditData({ ...editData, status: value })
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Hoạt động</SelectItem>
                    <SelectItem value="inactive">Không hoạt động</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditOpen(false)}>
                Hủy
              </Button>
              <Button
                onClick={handleEdit}
                className="bg-[#1488D8] hover:bg-[#1488D8]/90"
              >
                Lưu thay đổi
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xóa người dùng</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc chắn muốn xóa {user.name}? Hành động này không thể
                hoàn tác.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDelete(user.id)}
                className="bg-red-600 hover:bg-red-700"
              >
                Xóa
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

function NotificationPanel({ users }: { users: SystemUser[] }) {
  const [recipients, setRecipients] = useState("all");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!title || !message) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    const recipientCount =
      recipients === "all"
        ? users.length
        : users.filter((u) => u.role === recipients).length;

    toast.success("Đã gửi thông báo", {
      description: `Thông báo đã được gửi tới ${recipientCount} người dùng`,
    });

    setTitle("");
    setMessage("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-[#1488D8]" />
          Gửi Thông báo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Người nhận</Label>
          <Select value={recipients} onValueChange={setRecipients}>
            <SelectTrigger className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả người dùng</SelectItem>
              <SelectItem value="student">Tất cả sinh viên</SelectItem>
              <SelectItem value="tutor">Tất cả gia sư</SelectItem>
              <SelectItem value="coordinator">Tất cả điều phối viên</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="title">Tiêu đề</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nhập tiêu đề thông báo"
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="message">Nội dung</Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Nhập nội dung thông báo..."
            rows={6}
            className="mt-2"
          />
        </div>
        <Button
          onClick={handleSend}
          className="w-full bg-[#1488D8] hover:bg-[#1488D8]/90"
        >
          <Bell className="h-4 w-4 mr-2" />
          Gửi thông báo
        </Button>
      </CardContent>
    </Card>
  );
}

function PermissionsPanel({
  users,
  onUpdate,
}: {
  users: SystemUser[];
  onUpdate: (id: string, updates: Partial<SystemUser>) => void;
}) {
  const handleRoleChange = (userId: string, newRole: SystemUser["role"]) => {
    onUpdate(userId, { role: newRole });
    toast.success("Đã cập nhật phân quyền");
  };

  const roleLabels = {
    student: "Sinh viên",
    tutor: "Gia sư",
    coordinator: "Điều phối viên",
    admin: "Quản trị viên",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-[#1488D8]" />
          Phân quyền Người dùng
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {users.map((u) => (
            <div
              key={u.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-[#1488D8] text-white text-sm">
                    {u.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-gray-900">{u.name}</p>
                  <p className="text-sm text-gray-500">{u.email}</p>
                </div>
              </div>
              <Select
                value={u.role}
                onValueChange={(value: any) => handleRoleChange(u.id, value)}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Sinh viên</SelectItem>
                  <SelectItem value="tutor">Gia sư</SelectItem>
                  <SelectItem value="coordinator">Điều phối viên</SelectItem>
                  <SelectItem value="admin">Quản trị viên</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
