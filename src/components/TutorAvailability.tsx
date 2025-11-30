import { useState, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  X,
  Save,
  Loader2,
  UserPlus,
  Trash2,
} from "lucide-react";
import { User } from "../App";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
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
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { toast } from "sonner";
import { tutorApi } from "../api/tutorApi";
import { sessionApi } from "../api/sessionApi";

type TutorAvailabilityProps = {
  user: User;
};

type TimeSlot = {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
};

type BookedSession = {
  id: string;
  studentId: string;
  date: string;
  time: string;
  duration: number;
  subject: string;
  status: string;
};

export function TutorAvailability({ user }: TutorAvailabilityProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [showAddSlotDialog, setShowAddSlotDialog] = useState(false);
  const [showCreateSessionDialog, setShowCreateSessionDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  // Trạng thái để ngăn chặn việc submit nhiều lần (Double-click bug)
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [bookedSessions, setBookedSessions] = useState<BookedSession[]>([]);

  useEffect(() => {
    if (user.id) {
      fetchData();
    }
  }, [user.id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Availability Slots
      const tutorData = await tutorApi.getTutorById(user.id).catch(() => null);

      const slots: TimeSlot[] = [];
      // (Giữ nguyên logic parse slots nếu có)
      setTimeSlots(slots);

      // 2. Fetch Confirmed Sessions
      const sessions = await sessionApi.getUpcomingSessions(user.id, "tutor");
      const mappedSessions = sessions.map((s: any) => ({
        id: s.id,
        studentId: s.student_id,
        date: new Date(s.date_time).toLocaleDateString("vi-VN"),
        time: new Date(s.date_time).toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        duration: s.duration,
        subject: s.topic,
        status: s.status,
      }));
      setBookedSessions(mappedSessions);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Không thể tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTimeSlot = async (
    day: string,
    startTime: string,
    endTime: string
  ) => {
    try {
      await tutorApi.addAvailabilitySlot(user.id, {
        day,
        startTime,
        endTime,
      });

      const newSlot: TimeSlot = {
        id: Date.now().toString(),
        day,
        startTime,
        endTime,
        isBooked: false,
      };

      setTimeSlots([...timeSlots, newSlot]);
      setShowAddSlotDialog(false);
      toast.success("Đã thêm khung giờ");
    } catch (error) {
      toast.error("Lỗi khi thêm khung giờ.");
    }
  };

  const handleRemoveTimeSlot = async (slotId: string) => {
    try {
      await tutorApi.removeAvailabilitySlot(user.id, slotId);
      setTimeSlots(timeSlots.filter((slot) => slot.id !== slotId));
      toast.success("Đã xóa khung giờ");
    } catch (error) {
      toast.error("Không thể xóa khung giờ.");
    }
  };

  // ADDED: Logic hủy buổi học
  const handleCancelSession = async (sessionId: string) => {
    try {
      await sessionApi.cancelSession(sessionId, "Giảng viên hủy lịch");
      toast.success("Đã hủy buổi học thành công");
      // Cập nhật lại danh sách ngay lập tức
      setBookedSessions((prev) => prev.filter((s) => s.id !== sessionId));
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi hủy buổi học.");
    }
  };

  const handleCreateSession = async (data: any) => {
    if (isSubmitting) return; // Ngăn chặn ấn nút nhiều lần
    setIsSubmitting(true);

    try {
      await sessionApi.createSession({
        tutorId: user.id,
        studentId: "", // FIX: Pass empty string to satisfy TS if api file isn't updated immediately
        date: data.date,
        time: data.time,
        duration: parseInt(data.duration),
        subject: data.subject,
        location: data.location,
        notes: data.description,
      });

      toast.success("Đã tạo lớp học thành công", {
        description: "Lớp học đã được mở cho sinh viên đăng ký.",
      });
      setShowCreateSessionDialog(false);
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi tạo lớp học.");
    } finally {
      setIsSubmitting(false); // Mở lại nút bấm
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-gray-900 mb-2">Quản Lý Lịch Trình</h2>
          <p className="text-gray-500">
            Thiết lập thời gian rảnh và xem lịch dạy sắp tới
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Availability Slots Management */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-[#1488D8]" />
                Khung Giờ Rảnh (Tuần)
              </span>
              <Dialog
                open={showAddSlotDialog}
                onOpenChange={setShowAddSlotDialog}
              >
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    className="bg-[#1488D8] hover:bg-[#1488D8]/90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Thêm Khung Giờ</DialogTitle>
                    <DialogDescription>
                      Thêm thời gian bạn có thể nhận lớp.
                    </DialogDescription>
                  </DialogHeader>
                  <AddTimeSlotForm onSubmit={handleAddTimeSlot} />
                </DialogContent>
              </Dialog>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {loading ? (
                <div className="flex justify-center p-4">
                  <Loader2 className="animate-spin" />
                </div>
              ) : timeSlots.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>Chưa có khung giờ rảnh nào.</p>
                </div>
              ) : (
                timeSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          slot.isBooked ? "bg-red-500" : "bg-green-500"
                        }`}
                      />
                      <div>
                        <div className="font-medium text-gray-900">
                          {slot.day}
                        </div>
                        <div className="text-sm text-gray-500">
                          {slot.startTime} - {slot.endTime}
                        </div>
                      </div>
                    </div>
                    {!slot.isBooked && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveTimeSlot(slot.id)}
                      >
                        <X className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Confirmed Schedule View */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-[#1488D8]" />
                Lịch Dạy Đã Chốt
              </span>
              <Dialog
                open={showCreateSessionDialog}
                onOpenChange={setShowCreateSessionDialog}
              >
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-blue-200 text-blue-700 hover:bg-blue-50"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Tạo Lớp
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Tạo Buổi Học Mới</DialogTitle>
                    <DialogDescription>
                      Tạo buổi học hoặc lớp học mở.
                    </DialogDescription>
                  </DialogHeader>
                  {/* Pass isSubmitting state down */}
                  <CreateSessionForm
                    onSubmit={handleCreateSession}
                    isSubmitting={isSubmitting}
                  />
                </DialogContent>
              </Dialog>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bookedSessions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Không có lớp học sắp tới.
                </div>
              ) : (
                bookedSessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-3 bg-blue-50 rounded-lg border border-blue-100 flex justify-between items-center group"
                  >
                    <div>
                      <h4 className="font-medium text-blue-900">
                        {session.subject || "Buổi học"}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-blue-700">
                        <span>
                          {session.date} • {session.time}
                        </span>
                        <Badge
                          variant="outline"
                          className="text-xs h-5 px-1 bg-white border-blue-200"
                        >
                          {session.duration}p
                        </Badge>
                      </div>
                      {session.studentId !== "0" && (
                        <p className="text-xs text-gray-500 mt-1">
                          Student ID: {session.studentId}
                        </p>
                      )}
                    </div>

                    {/* ADDED: Cancel Button with Confirmation */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Hủy buổi học"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Hủy buổi học?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Bạn có chắc muốn hủy buổi học "{session.subject}"
                            vào ngày {session.date} không?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Quay lại</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700"
                            onClick={() => handleCancelSession(session.id)}
                          >
                            Xác nhận hủy
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                ))
              )}
            </div>
            <div className="mt-6 border-t pt-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border mx-auto"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AddTimeSlotForm({
  onSubmit,
}: {
  onSubmit: (day: string, start: string, end: string) => void;
}) {
  const [day, setDay] = useState("Thứ Hai");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(day, startTime, endTime);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* ... (Same as before) ... */}
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
          <Label>Bắt đầu</Label>
          <Input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="mt-2"
          />
        </div>
        <div>
          <Label>Kết thúc</Label>
          <Input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="mt-2"
          />
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" className="bg-[#1488D8]">
          Lưu
        </Button>
      </DialogFooter>
    </form>
  );
}

function CreateSessionForm({
  onSubmit,
  isSubmitting,
}: {
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}) {
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    date: "",
    time: "09:00",
    duration: "60",
    maxStudents: "20",
    location: "",
    description: "",
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }}
      className="space-y-4"
    >
      <div>
        <Label>Tiêu Đề Buổi Học</Label>
        <Input
          required
          placeholder="VD: Giới Thiệu Cấu Trúc Dữ Liệu"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="mt-1"
        />
      </div>

      <div>
        <Label>Môn học / Chủ đề</Label>
        <Input
          required
          placeholder="VD: Cấu trúc dữ liệu"
          value={formData.subject}
          onChange={(e) =>
            setFormData({ ...formData, subject: e.target.value })
          }
          className="mt-1"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Ngày</Label>
          <Input
            required
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="mt-1"
          />
        </div>
        <div>
          <Label>Số Sinh Viên Tối Đa</Label>
          <Input
            type="number"
            value={formData.maxStudents}
            onChange={(e) =>
              setFormData({ ...formData, maxStudents: e.target.value })
            }
            className="mt-1"
            min="1"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Giờ Bắt Đầu</Label>
          <Input
            required
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            className="mt-1"
          />
        </div>
        <div>
          <Label>Thời lượng (phút)</Label>
          <Input
            type="number"
            value={formData.duration}
            onChange={(e) =>
              setFormData({ ...formData, duration: e.target.value })
            }
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label>Địa điểm / Link</Label>
        <Input
          placeholder="Phòng học hoặc link Meet"
          value={formData.location}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
          className="mt-1"
        />
      </div>

      <div>
        <Label>Mô Tả</Label>
        <Textarea
          placeholder="Mô tả nội dung sẽ được giảng dạy..."
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="mt-1"
          rows={3}
        />
      </div>

      <DialogFooter>
        <Button type="submit" className="bg-[#1488D8]" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang tạo...
            </>
          ) : (
            "Tạo Lớp"
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}
