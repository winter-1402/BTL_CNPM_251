import { useState } from 'react';
import { UserPlus, Edit, Trash2, Shield, Bell, RefreshCw, Search, Filter } from 'lucide-react';
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
} from './ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from './ui/dialog';
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
} from './ui/alert-dialog';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner@2.0.3';

type AdminManagementProps = {
  user: User;
};

type SystemUser = {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'tutor' | 'coordinator' | 'admin';
  faculty?: string;
  status: 'active' | 'inactive';
  joinDate: string;
};

export function AdminManagement({ user }: AdminManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [users, setUsers] = useState<SystemUser[]>([
    {
      id: '1810123',
      name: 'Nguyễn Văn An',
      email: 'an.nguyen@hcmut.edu.vn',
      role: 'student',
      faculty: 'Khoa Khoa học và Kỹ thuật Máy tính',
      status: 'active',
      joinDate: '2023-09-01',
    },
    {
      id: 'T001',
      name: 'TS. Trần Văn Minh',
      email: 'minh.tran@hcmut.edu.vn',
      role: 'tutor',
      faculty: 'Khoa Khoa học và Kỹ thuật Máy tính',
      status: 'active',
      joinDate: '2020-01-15',
    },
    {
      id: '1810456',
      name: 'Lê Thị Mai',
      email: 'mai.le@hcmut.edu.vn',
      role: 'student',
      faculty: 'Khoa Điện - Điện tử',
      status: 'active',
      joinDate: '2023-09-01',
    },
    {
      id: 'T002',
      name: 'ThS. Lê Thị Hoa',
      email: 'hoa.le@hcmut.edu.vn',
      role: 'tutor',
      faculty: 'Khoa Khoa học và Kỹ thuật Máy tính',
      status: 'active',
      joinDate: '2021-03-20',
    },
  ]);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleAddUser = (userData: Partial<SystemUser>) => {
    const newUser: SystemUser = {
      id: Date.now().toString(),
      name: userData.name || '',
      email: userData.email || '',
      role: userData.role || 'student',
      faculty: userData.faculty,
      status: 'active',
      joinDate: new Date().toISOString().split('T')[0],
    };
    setUsers([...users, newUser]);
    toast.success('Thêm người dùng thành công', {
      description: `${newUser.name} đã được thêm vào hệ thống`,
    });
  };

  const handleEditUser = (userId: string, updates: Partial<SystemUser>) => {
    setUsers(users.map((u) => (u.id === userId ? { ...u, ...updates } : u)));
    toast.success('Cập nhật thông tin thành công');
  };

  const handleDeleteUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    setUsers(users.filter((u) => u.id !== userId));
    toast.success('Xóa người dùng thành công', {
      description: `${user?.name} đã được xóa khỏi hệ thống`,
    });
  };

  const handleSyncData = () => {
    toast.info('Đang đồng bộ dữ liệu...', {
      description: 'Đồng bộ với HCMUT_DATACORE',
    });
    setTimeout(() => {
      toast.success('Đồng bộ dữ liệu thành công', {
        description: 'Dữ liệu đã được cập nhật từ HCMUT_DATACORE',
      });
    }, 2000);
  };

  const stats = [
    { label: 'Tổng người dùng', value: users.length, color: 'text-blue-600' },
    { label: 'Sinh viên', value: users.filter((u) => u.role === 'student').length, color: 'text-green-600' },
    { label: 'Gia sư', value: users.filter((u) => u.role === 'tutor').length, color: 'text-purple-600' },
    { label: 'Hoạt động', value: users.filter((u) => u.status === 'active').length, color: 'text-orange-600' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-gray-900 mb-2">Quản lý Hệ thống</h2>
          <p className="text-gray-500">Quản lý người dùng, phân quyền và đồng bộ dữ liệu</p>
        </div>
        <Button
          onClick={handleSyncData}
          variant="outline"
          className="flex items-center gap-2"
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

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users">Quản lý Người dùng</TabsTrigger>
          <TabsTrigger value="notifications">Gửi Thông báo</TabsTrigger>
          <TabsTrigger value="permissions">Phân Quyền</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
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
                    <SelectItem value="coordinator">Điều phối viên</SelectItem>
                    <SelectItem value="admin">Quản trị viên</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Users Table */}
              <div className="space-y-3">
                {filteredUsers.map((u) => (
                  <UserCard
                    key={u.id}
                    user={u}
                    onEdit={handleEditUser}
                    onDelete={handleDeleteUser}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationPanel users={users} />
        </TabsContent>

        <TabsContent value="permissions">
          <PermissionsPanel users={users} onUpdate={handleEditUser} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AddUserDialog({ onAdd }: { onAdd: (user: Partial<SystemUser>) => void }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'student' as 'student' | 'tutor' | 'coordinator' | 'admin',
    faculty: '',
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.email) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }
    onAdd(formData);
    setOpen(false);
    setFormData({ name: '', email: '', role: 'student', faculty: '' });
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
          <DialogDescription>Nhập thông tin người dùng mới vào hệ thống</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="name">Họ và tên</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="email@hcmut.edu.vn"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="role">Vai trò</Label>
            <Select value={formData.role} onValueChange={(value: any) => setFormData({ ...formData, role: value })}>
              <SelectTrigger className="mt-2">
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
          <div>
            <Label htmlFor="faculty">Khoa</Label>
            <Input
              id="faculty"
              value={formData.faculty}
              onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
              placeholder="Khoa Khoa học và Kỹ thuật Máy tính"
              className="mt-2"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} className="bg-[#1488D8] hover:bg-[#1488D8]/90">
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
}: {
  user: SystemUser;
  onEdit: (id: string, updates: Partial<SystemUser>) => void;
  onDelete: (id: string) => void;
}) {
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState(user);

  const roleLabels = {
    student: 'Sinh viên',
    tutor: 'Gia sư',
    coordinator: 'Điều phối viên',
    admin: 'Quản trị viên',
  };

  const roleColors = {
    student: 'bg-blue-100 text-blue-700',
    tutor: 'bg-purple-100 text-purple-700',
    coordinator: 'bg-green-100 text-green-700',
    admin: 'bg-red-100 text-red-700',
  };

  const handleEdit = () => {
    onEdit(user.id, editData);
    setEditOpen(false);
  };

  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-[#1488D8] transition-colors">
      <div className="flex items-center gap-4 flex-1">
        <Avatar className="h-12 w-12">
          <AvatarFallback className="bg-[#1488D8] text-white">
            {user.name.split(' ').map((n) => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-gray-900">{user.name}</h3>
            <Badge className={roleColors[user.role]} variant="secondary">
              {roleLabels[user.role]}
            </Badge>
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
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  value={editData.email}
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Khoa</Label>
                <Input
                  value={editData.faculty || ''}
                  onChange={(e) => setEditData({ ...editData, faculty: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Trạng thái</Label>
                <Select
                  value={editData.status}
                  onValueChange={(value: any) => setEditData({ ...editData, status: value })}
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
              <Button onClick={handleEdit} className="bg-[#1488D8] hover:bg-[#1488D8]/90">
                Lưu thay đổi
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xóa người dùng</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc chắn muốn xóa {user.name}? Hành động này không thể hoàn tác.
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
  const [recipients, setRecipients] = useState('all');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!title || !message) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    const recipientCount =
      recipients === 'all'
        ? users.length
        : users.filter((u) => u.role === recipients).length;

    toast.success('Đã gửi thông báo', {
      description: `Thông báo đã được gửi tới ${recipientCount} người dùng`,
    });

    setTitle('');
    setMessage('');
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
        <Button onClick={handleSend} className="w-full bg-[#1488D8] hover:bg-[#1488D8]/90">
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
  const handleRoleChange = (userId: string, newRole: SystemUser['role']) => {
    onUpdate(userId, { role: newRole });
    toast.success('Đã cập nhật phân quyền');
  };

  const roleLabels = {
    student: 'Sinh viên',
    tutor: 'Gia sư',
    coordinator: 'Điều phối viên',
    admin: 'Quản trị viên',
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
                    {u.name.split(' ').map((n) => n[0]).join('')}
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
