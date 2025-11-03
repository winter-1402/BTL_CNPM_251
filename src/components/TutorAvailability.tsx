import { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Plus, X, Save, Users } from 'lucide-react';
import { User } from '../App';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback } from './ui/avatar';
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

type TutorAvailabilityProps = {
  user: User;
};

type TimeSlot = {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
};

type GroupSession = {
  id: string;
  title: string;
  subject: string;
  date: string;
  startTime: string;
  endTime: string;
  maxStudents: number;
  registeredStudents: string[];
  location?: string;
  meetingLink?: string;
  description: string;
  status: 'upcoming' | 'completed' | 'cancelled';
};

export function TutorAvailability({ user }: TutorAvailabilityProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [showAddSlotDialog, setShowAddSlotDialog] = useState(false);
  const [showCreateSessionDialog, setShowCreateSessionDialog] = useState(false);

  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    { id: '1', day: 'Thứ Hai', startTime: '14:00', endTime: '16:00', isAvailable: true },
    { id: '2', day: 'Thứ Tư', startTime: '10:00', endTime: '12:00', isAvailable: true },
    { id: '3', day: 'Thứ Sáu', startTime: '15:00', endTime: '17:00', isAvailable: true },
  ]);

  const [groupSessions, setGroupSessions] = useState<GroupSession[]>([
    {
      id: '1',
      title: 'Giới Thiệu Cấu Trúc Dữ Liệu',
      subject: 'Cấu Trúc Dữ Liệu',
      date: '2025-10-28',
      startTime: '14:00',
      endTime: '16:00',
      maxStudents: 20,
      registeredStudents: ['Nguyễn Văn An', 'Lê Thị Mai', 'Trần Văn Đức'],
      meetingLink: 'https://meet.google.com/abc-defg-hij',
      description: 'Giới thiệu các cấu trúc dữ liệu cơ bản bao gồm mảng, danh sách liên kết và ngăn xếp.',
      status: 'upcoming',
    },
    {
      id: '2',
      title: 'Workshop Thuật Toán Nâng Cao',
      subject: 'Thuật Toán',
      date: '2025-10-30',
      startTime: '10:00',
      endTime: '12:00',
      maxStudents: 15,
      registeredStudents: ['Phạm Thị Hoa', 'Hoàng Văn Khánh'],
      location: 'Tòa A1, Phòng 302',
      description: 'Tìm hiểu sâu về thuật toán sắp xếp và tìm kiếm với bài tập thực hành.',
      status: 'upcoming',
    },
    {
      id: '3',
      title: 'Cấu Trúc Dữ Liệu Cây',
      subject: 'Cấu Trúc Dữ Liệu',
      date: '2025-10-25',
      startTime: '15:00',
      endTime: '17:00',
      maxStudents: 20,
      registeredStudents: ['Nguyễn Văn An', 'Lê Thị Mai', 'Võ Thị Lan', 'Trần Văn Đức'],
      meetingLink: 'https://meet.google.com/xyz-abcd-efg',
      description: 'Cây nhị phân, BST, cây AVL và các ứng dụng của chúng.',
      status: 'completed',
    },
  ]);

  const handleAddTimeSlot = (day: string, startTime: string, endTime: string) => {
    const newSlot: TimeSlot = {
      id: Date.now().toString(),
      day,
      startTime,
      endTime,
      isAvailable: true,
    };
    setTimeSlots([...timeSlots, newSlot]);
    setShowAddSlotDialog(false);
    toast.success('Đã thêm khung giờ', {
      description: `${day} ${startTime} - ${endTime}`,
    });
  };

  const handleRemoveTimeSlot = (id: string) => {
    setTimeSlots(timeSlots.filter((slot) => slot.id !== id));
    toast.success('Đã xóa khung giờ');
  };

  const handleCreateGroupSession = (sessionData: Partial<GroupSession>) => {
    const newSession: GroupSession = {
      id: Date.now().toString(),
      title: sessionData.title || '',
      subject: sessionData.subject || '',
      date: sessionData.date || '',
      startTime: sessionData.startTime || '',
      endTime: sessionData.endTime || '',
      maxStudents: sessionData.maxStudents || 20,
      registeredStudents: [],
      location: sessionData.location,
      meetingLink: sessionData.meetingLink,
      description: sessionData.description || '',
      status: 'upcoming',
    };
    setGroupSessions([...groupSessions, newSession]);
    setShowCreateSessionDialog(false);
    toast.success('Đã tạo buổi học nhóm', {
      description: `${sessionData.title} vào ngày ${sessionData.date}`,
    });
  };

  const handleCancelSession = (sessionId: string) => {
    const session = groupSessions.find((s) => s.id === sessionId);
    if (session) {
      setGroupSessions(
        groupSessions.map((s) =>
          s.id === sessionId ? { ...s, status: 'cancelled' as const } : s
        )
      );
      
      // Notify all registered students
      session.registeredStudents.forEach((student) => {
        toast.info('Đã gửi thông báo hủy', {
          description: `${student} đã được thông báo về việc hủy buổi "${session.title}"`,
        });
      });

      toast.success('Đã hủy buổi học', {
        description: `Tất cả ${session.registeredStudents.length} sinh viên đã đăng ký đã được thông báo.`,
      });
    }
  };

  const upcomingSessions = groupSessions.filter((s) => s.status === 'upcoming');
  const completedSessions = groupSessions.filter((s) => s.status === 'completed');
  const cancelledSessions = groupSessions.filter((s) => s.status === 'cancelled');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-gray-900 mb-2">Lịch Rảnh & Buổi Học</h2>
          <p className="text-gray-500">
            Quản lý lịch rảnh và tạo buổi học nhóm cho sinh viên
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Availability */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-[#1488D8]" />
                Lịch Rảnh Hàng Tuần
              </span>
              <Dialog open={showAddSlotDialog} onOpenChange={setShowAddSlotDialog}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-[#1488D8] hover:bg-[#1488D8]/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm Khung Giờ
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Thêm Khung Giờ</DialogTitle>
                    <DialogDescription>
                      Đặt thời gian rảnh cho buổi học với sinh viên
                    </DialogDescription>
                  </DialogHeader>
                  <AddTimeSlotForm onSubmit={handleAddTimeSlot} />
                </DialogContent>
              </Dialog>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {timeSlots.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p>Chưa có khung giờ rảnh</p>
                  <p className="text-sm mt-1">Thêm khung giờ để sinh viên biết khi nào bạn rảnh</p>
                </div>
              ) : (
                timeSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-[#1488D8] text-white flex items-center justify-center text-sm">
                        {slot.day.substring(0, 2)}
                      </div>
                      <div>
                        <div className="text-gray-900">{slot.day}</div>
                        <div className="text-sm text-gray-500">
                          {slot.startTime} - {slot.endTime}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveTimeSlot(slot.id)}
                    >
                      <X className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Calendar Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-[#1488D8]" />
              Lịch
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
      </div>

      {/* Group Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Users className="h-5 w-5 text-[#1488D8]" />
              Buổi Học Nhóm
            </span>
            <Dialog open={showCreateSessionDialog} onOpenChange={setShowCreateSessionDialog}>
              <DialogTrigger asChild>
                <Button className="bg-[#1488D8] hover:bg-[#1488D8]/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Tạo Buổi Học
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Tạo Buổi Học Nhóm</DialogTitle>
                  <DialogDescription>
                    Tạo buổi học nhóm mà sinh viên có thể tham gia
                  </DialogDescription>
                </DialogHeader>
                <CreateSessionForm onSubmit={handleCreateGroupSession} />
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upcoming">
            <TabsList>
              <TabsTrigger value="upcoming">Sắp Tới ({upcomingSessions.length})</TabsTrigger>
              <TabsTrigger value="completed">Đã Hoàn Thành ({completedSessions.length})</TabsTrigger>
              <TabsTrigger value="cancelled">Đã Hủy ({cancelledSessions.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-4 mt-4">
              {upcomingSessions.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  onCancel={handleCancelSession}
                />
              ))}
              {upcomingSessions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p>Không có buổi học sắp tới</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4 mt-4">
              {completedSessions.map((session) => (
                <SessionCard key={session.id} session={session} />
              ))}
              {completedSessions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>Không có buổi học đã hoàn thành</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="cancelled" className="space-y-4 mt-4">
              {cancelledSessions.map((session) => (
                <SessionCard key={session.id} session={session} />
              ))}
              {cancelledSessions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>Không có buổi học đã hủy</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function AddTimeSlotForm({ onSubmit }: { onSubmit: (day: string, start: string, end: string) => void }) {
  const [day, setDay] = useState('Thứ Hai');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(day, startTime, endTime);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Ngày Trong Tuần</Label>
        <Select value={day} onValueChange={setDay}>
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Thứ Hai">Thứ Hai</SelectItem>
            <SelectItem value="Thứ Ba">Thứ Ba</SelectItem>
            <SelectItem value="Thứ Tư">Thứ Tư</SelectItem>
            <SelectItem value="Thứ Năm">Thứ Năm</SelectItem>
            <SelectItem value="Thứ Sáu">Thứ Sáu</SelectItem>
            <SelectItem value="Thứ Bảy">Thứ Bảy</SelectItem>
            <SelectItem value="Chủ Nhật">Chủ Nhật</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Giờ Bắt Đầu</Label>
          <Input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="mt-2"
          />
        </div>
        <div>
          <Label>Giờ Kết Thúc</Label>
          <Input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="mt-2"
          />
        </div>
      </div>

      <DialogFooter>
        <Button type="submit" className="bg-[#1488D8] hover:bg-[#1488D8]/90">
          <Save className="h-4 w-4 mr-2" />
          Lưu Khung Giờ
        </Button>
      </DialogFooter>
    </form>
  );
}

function CreateSessionForm({ onSubmit }: { onSubmit: (data: Partial<GroupSession>) => void }) {
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    date: '',
    startTime: '10:00',
    endTime: '12:00',
    maxStudents: '20',
    location: '',
    meetingLink: '',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      maxStudents: parseInt(formData.maxStudents),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Tiêu Đề Buổi Học</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="VD: Giới Thiệu Cấu Trúc Dữ Liệu"
          className="mt-2"
          required
        />
      </div>

      <div>
        <Label htmlFor="subject">Môn Học</Label>
        <Select value={formData.subject} onValueChange={(value) => setFormData({ ...formData, subject: value })}>
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Chọn môn học" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Cấu Trúc Dữ Liệu">Cấu Trúc Dữ Liệu</SelectItem>
            <SelectItem value="Thuật Toán">Thuật Toán</SelectItem>
            <SelectItem value="Hệ Quản Trị Cơ Sở Dữ Liệu">Hệ Quản Trị Cơ Sở Dữ Liệu</SelectItem>
            <SelectItem value="Học Máy">Học Máy</SelectItem>
            <SelectItem value="Công Nghệ Phần Mềm">Công Nghệ Phần Mềm</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="date">Ngày</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="mt-2"
            required
          />
        </div>
        <div>
          <Label htmlFor="maxStudents">Số Sinh Viên Tối Đa</Label>
          <Input
            id="maxStudents"
            type="number"
            value={formData.maxStudents}
            onChange={(e) => setFormData({ ...formData, maxStudents: e.target.value })}
            className="mt-2"
            min="1"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startTime">Giờ Bắt Đầu</Label>
          <Input
            id="startTime"
            type="time"
            value={formData.startTime}
            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
            className="mt-2"
            required
          />
        </div>
        <div>
          <Label htmlFor="endTime">Giờ Kết Thúc</Label>
          <Input
            id="endTime"
            type="time"
            value={formData.endTime}
            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
            className="mt-2"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="location">Địa Điểm (Tùy Chọn)</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          placeholder="VD: Tòa A1, Phòng 302"
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="meetingLink">Link Họp (Tùy Chọn)</Label>
        <Input
          id="meetingLink"
          value={formData.meetingLink}
          onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
          placeholder="https://meet.google.com/..."
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="description">Mô Tả</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Mô tả nội dung sẽ được giảng dạy trong buổi học này..."
          className="mt-2"
          rows={3}
          required
        />
      </div>

      <DialogFooter>
        <Button type="submit" className="bg-[#1488D8] hover:bg-[#1488D8]/90">
          <Plus className="h-4 w-4 mr-2" />
          Tạo Buổi Học
        </Button>
      </DialogFooter>
    </form>
  );
}

function SessionCard({ session, onCancel }: { session: GroupSession; onCancel?: (id: string) => void }) {
  const statusColors = {
    upcoming: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  const statusLabels = {
    upcoming: 'sắp tới',
    completed: 'đã hoàn thành',
    cancelled: 'đã hủy',
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-gray-900 mb-1">{session.title}</h3>
            <p className="text-sm text-gray-500">{session.subject}</p>
          </div>
          <Badge className={statusColors[session.status]} variant="secondary">
            {statusLabels[session.status]}
          </Badge>
        </div>

        <p className="text-sm text-gray-600 mb-4">{session.description}</p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <CalendarIcon className="h-4 w-4" />
              <span>{new Date(session.date).toLocaleDateString('vi-VN', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="h-4 w-4" />
              <span>{session.startTime} - {session.endTime}</span>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="h-4 w-4" />
              <span>{session.registeredStudents.length} / {session.maxStudents} sinh viên</span>
            </div>
            {session.location && (
              <div className="text-gray-600">📍 {session.location}</div>
            )}
            {session.meetingLink && (
              <div className="text-gray-600">🔗 Buổi học trực tuyến</div>
            )}
          </div>
        </div>

        {session.registeredStudents.length > 0 && (
          <div className="mb-4">
            <Label className="text-xs text-gray-500 mb-2">Sinh Viên Đã Đăng Ký</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {session.registeredStudents.slice(0, 3).map((student, index) => (
                <div key={index} className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="bg-[#1488D8] text-white text-xs">
                      {student.split(' ').map((n) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-gray-700">{student}</span>
                </div>
              ))}
              {session.registeredStudents.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{session.registeredStudents.length - 3} người khác
                </Badge>
              )}
            </div>
          </div>
        )}

        {session.status === 'upcoming' && onCancel && (
          <div className="flex gap-2 pt-4 border-t border-gray-200">
            {session.meetingLink && (
              <Button
                className="flex-1 bg-[#1488D8] hover:bg-[#1488D8]/90"
                onClick={() => window.open(session.meetingLink, '_blank')}
              >
                Tham Gia Họp
              </Button>
            )}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="flex-1">
                  <X className="h-4 w-4 mr-2" />
                  Hủy Buổi Học
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Hủy Buổi Học</AlertDialogTitle>
                  <AlertDialogDescription>
                    Bạn có chắc muốn hủy buổi học này không? Tất cả {session.registeredStudents.length} sinh viên đã đăng ký sẽ được thông báo qua email và thông báo trong ứng dụng.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Giữ Buổi Học</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onCancel(session.id)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Hủy Buổi Học
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
