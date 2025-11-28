import { useState } from "react";
import {
  Search,
  Star,
  MapPin,
  Calendar,
  Filter,
  Clock,
  Video,
  Users,
  X,
} from "lucide-react";
import { User, Tutor } from "../App";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
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
} from "./ui/dialog";
import { Label } from "./ui/label";
import { toast } from "sonner";

type TutorDirectoryProps = {
  user: User;
};

type ScheduledSession = {
  id: string;
  tutorId: string;
  date: string;
  time: string;
  duration: number;
  subject: string;
  type: "online" | "in-person";
  location?: string;
  maxStudents: number;
  enrolledStudents: number;
  status: "available" | "full";
};

export function TutorDirectory({ user }: TutorDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState("all");
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
  const [showSessions, setShowSessions] = useState(false);

  // Mock data - gia sư đã đăng ký
  const registeredTutorIds = ["1", "3"]; // IDs of tutors student has registered with

  const tutors: Tutor[] = [
    {
      id: "1",
      name: "Dr. Trần Văn Minh",
      email: "minh.tran@hcmut.edu.vn",
      faculty: "Khoa học Máy tính",
      expertise: ["Cấu trúc Dữ liệu", "Thuật toán", "Lập trình"],
      rating: 4.9,
      totalSessions: 156,
      availability: [
        "Thứ 2: 14:00-16:00",
        "Thứ 4: 10:00-12:00",
        "Thứ 6: 15:00-17:00",
      ],
      bio: "Tiến sĩ Khoa học Máy tính với 10 năm kinh nghiệm giảng dạy. Chuyên về thuật toán và cấu trúc dữ liệu.",
    },
    {
      id: "2",
      name: "ThS. Lê Thị Hoa",
      email: "hoa.le@hcmut.edu.vn",
      faculty: "Khoa học Máy tính",
      expertise: ["Hệ quản trị CSDL", "SQL", "Mô hình hóa Dữ liệu"],
      rating: 4.8,
      totalSessions: 98,
      availability: ["Thứ 3: 09:00-11:00", "Thứ 5: 14:00-16:00"],
      bio: "Chuyên gia cơ sở dữ liệu với kinh nghiệm làm việc tại các công ty công nghệ lớn.",
    },
    {
      id: "3",
      name: "TS. Nguyễn Thanh Long",
      email: "long.nguyen@hcmut.edu.vn",
      faculty: "Khoa học Máy tính",
      expertise: ["Học Máy", "Trí tuệ Nhân tạo", "Học Sâu"],
      rating: 4.9,
      totalSessions: 142,
      availability: [
        "Thứ 2: 10:00-12:00",
        "Thứ 4: 14:00-16:00",
        "Thứ 6: 10:00-12:00",
      ],
      bio: "Nhà nghiên cứu AI tập trung vào học sâu và ứng dụng thị giác máy tính.",
    },
    {
      id: "4",
      name: "TS. Phạm Minh Tuấn",
      email: "tuan.pham@hcmut.edu.vn",
      faculty: "Kỹ thuật Điện - Điện tử",
      expertise: ["Thiết kế Mạch điện", "Điện tử", "Xử lý Tín hiệu"],
      rating: 4.7,
      totalSessions: 87,
      availability: ["Thứ 3: 13:00-15:00", "Thứ 5: 10:00-12:00"],
      bio: "Chuyên gia kỹ thuật điện với chuyên môn về thiết kế mạch và hệ thống nhúng.",
    },
    {
      id: "5",
      name: "ThS. Võ Thị Mai",
      email: "mai.vo@hcmut.edu.vn",
      faculty: "Kỹ thuật Cơ khí",
      expertise: ["Nhiệt động lực học", "Cơ học Chất lỏng", "CAD"],
      rating: 4.8,
      totalSessions: 76,
      availability: ["Thứ 2: 13:00-15:00", "Thứ 6: 09:00-11:00"],
      bio: "Chuyên gia kỹ thuật cơ khí với kinh nghiệm trong ngành thiết kế ô tô.",
    },
    {
      id: "6",
      name: "TS. Hoàng Văn Khánh",
      email: "khanh.hoang@hcmut.edu.vn",
      faculty: "Khoa học Máy tính",
      expertise: ["Công nghệ Phần mềm", "Mẫu Thiết kế", "Agile"],
      rating: 4.9,
      totalSessions: 134,
      availability: [
        "Thứ 3: 14:00-16:00",
        "Thứ 4: 10:00-12:00",
        "Thứ 5: 15:00-17:00",
      ],
      bio: "Giảng viên công nghệ phần mềm với kinh nghiệm phong phú về hệ thống quy mô lớn.",
    },
  ];

  // Mock scheduled sessions by tutors
  const scheduledSessions: ScheduledSession[] = [
    {
      id: "s1",
      tutorId: "1",
      date: "2025-11-05",
      time: "14:00",
      duration: 90,
      subject: "Cấu trúc Dữ liệu - Cây nhị phân",
      type: "online",
      maxStudents: 5,
      enrolledStudents: 2,
      status: "available",
    },
    {
      id: "s2",
      tutorId: "1",
      date: "2025-11-07",
      time: "10:00",
      duration: 120,
      subject: "Thuật toán - Sắp xếp và Tìm kiếm",
      type: "in-person",
      location: "Phòng H1-201",
      maxStudents: 10,
      enrolledStudents: 7,
      status: "available",
    },
    {
      id: "s3",
      tutorId: "3",
      date: "2025-11-06",
      time: "14:00",
      duration: 120,
      subject: "Machine Learning - Neural Networks",
      type: "online",
      maxStudents: 8,
      enrolledStudents: 5,
      status: "available",
    },
    {
      id: "s4",
      tutorId: "3",
      date: "2025-11-08",
      time: "10:00",
      duration: 90,
      subject: "Deep Learning - CNN Applications",
      type: "online",
      maxStudents: 6,
      enrolledStudents: 6,
      status: "full",
    },
    {
      id: "s5",
      tutorId: "2",
      date: "2025-11-05",
      time: "09:00",
      duration: 120,
      subject: "SQL Advanced Queries",
      type: "in-person",
      location: "Phòng H2-105",
      maxStudents: 12,
      enrolledStudents: 8,
      status: "available",
    },
  ];

  const registeredTutors = tutors.filter((t) =>
    registeredTutorIds.includes(t.id)
  );
  const unregisteredTutors = tutors.filter(
    (t) => !registeredTutorIds.includes(t.id)
  );

  const filteredTutors = unregisteredTutors.filter((tutor) => {
    const matchesSearch =
      tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutor.expertise.some((exp) =>
        exp.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesFaculty =
      selectedFaculty === "all" || tutor.faculty === selectedFaculty;
    return matchesSearch && matchesFaculty;
  });

  const handleRegisterTutor = (tutor: Tutor) => {
    toast.success(`Đã đăng ký với ${tutor.name}`, {
      description: "Giảng viên đã được thêm vào danh sách gia sư của bạn.",
    });
  };

  const handleUnregisterTutor = (tutorId: string) => {
    const tutor = tutors.find((t) => t.id === tutorId);
    toast.success(`Đã hủy đăng ký với ${tutor?.name}`, {
      description: "Giảng viên đã được xóa khỏi danh sách gia sư của bạn.",
    });
  };

  const handleEnrollSession = (session: ScheduledSession) => {
    const tutor = tutors.find((t) => t.id === session.tutorId);
    toast.success("Đã đăng ký buổi học!", {
      description: `Bạn đã đăng ký buổi học "${session.subject}" với ${tutor?.name}`,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    return `${days[date.getDay()]}, ${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()}`;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl text-gray-900 mb-2">Tìm Giảng viên Hỗ trợ</h2>
        <p className="text-gray-500">
          Kết nối với các giảng viên hỗ trợ chuyên môn từ các khoa khác nhau tại
          ĐHBK
        </p>
      </div>

      {/* Registered Tutors Section */}
      {registeredTutors.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg text-gray-900">Gia sư đã đăng ký</h3>
              <p className="text-sm text-gray-500">
                Bạn đã đăng ký với {registeredTutors.length} giảng viên
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {registeredTutors.map((tutor) => {
              const tutorSessions = scheduledSessions.filter(
                (s) => s.tutorId === tutor.id
              );
              const availableSessions = tutorSessions.filter(
                (s) => s.status === "available"
              );

              return (
                <Card key={tutor.id} className="border-[#1488D8]">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-[#1488D8] text-white">
                          {tutor.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm truncate">{tutor.name}</h4>
                        <p className="text-xs text-gray-500">{tutor.faculty}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs">{tutor.rating}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-red-600"
                        onClick={() => handleUnregisterTutor(tutor.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Buổi học sắp tới</span>
                        <span className="text-[#1488D8]">
                          {availableSessions.length} buổi
                        </span>
                      </div>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => {
                              setSelectedTutor(tutor);
                              setShowSessions(true);
                            }}
                          >
                            <Calendar className="h-3 w-3 mr-2" />
                            Xem buổi học
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Buổi học - {tutor.name}</DialogTitle>
                            <DialogDescription>
                              Đăng ký vào các buổi học có sẵn
                            </DialogDescription>
                          </DialogHeader>

                          <div className="space-y-3 pt-4">
                            {tutorSessions.length === 0 ? (
                              <div className="text-center py-8 text-gray-500">
                                <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                                <p>Chưa có buổi học nào được tạo</p>
                              </div>
                            ) : (
                              tutorSessions.map((session) => (
                                <Card
                                  key={session.id}
                                  className={
                                    session.status === "full"
                                      ? "opacity-60"
                                      : ""
                                  }
                                >
                                  <CardContent className="p-4">
                                    <div className="flex items-start justify-between gap-4">
                                      <div className="flex-1 space-y-2">
                                        <div className="flex items-start justify-between">
                                          <h4 className="text-sm">
                                            {session.subject}
                                          </h4>
                                          <Badge
                                            variant={
                                              session.type === "online"
                                                ? "default"
                                                : "secondary"
                                            }
                                            className="ml-2"
                                          >
                                            {session.type === "online" ? (
                                              <>
                                                <Video className="h-3 w-3 mr-1" />
                                                Online
                                              </>
                                            ) : (
                                              <>
                                                <MapPin className="h-3 w-3 mr-1" />
                                                Trực tiếp
                                              </>
                                            )}
                                          </Badge>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                                          <div className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {formatDate(session.date)}
                                          </div>
                                          <div className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {session.time} ({session.duration}{" "}
                                            phút)
                                          </div>
                                          {session.location && (
                                            <div className="flex items-center gap-1 col-span-2">
                                              <MapPin className="h-3 w-3" />
                                              {session.location}
                                            </div>
                                          )}
                                        </div>

                                        <div className="flex items-center gap-2">
                                          <div className="flex items-center gap-1 text-xs text-gray-500">
                                            <Users className="h-3 w-3" />
                                            {session.enrolledStudents}/
                                            {session.maxStudents} sinh viên
                                          </div>
                                          <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                                            <div
                                              className="bg-[#1488D8] h-1.5 rounded-full"
                                              style={{
                                                width: `${
                                                  (session.enrolledStudents /
                                                    session.maxStudents) *
                                                  100
                                                }%`,
                                              }}
                                            />
                                          </div>
                                        </div>
                                      </div>

                                      <Button
                                        size="sm"
                                        className="bg-[#1488D8] hover:bg-[#1488D8]/90"
                                        disabled={session.status === "full"}
                                        onClick={() =>
                                          handleEnrollSession(session)
                                        }
                                      >
                                        {session.status === "full"
                                          ? "Đã đủ"
                                          : "Đăng ký"}
                                      </Button>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Divider */}
      {registeredTutors.length > 0 && (
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg text-gray-900 mb-4">Tìm thêm giảng viên</h3>
        </div>
      )}

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm theo tên hoặc chuyên môn..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedFaculty} onValueChange={setSelectedFaculty}>
              <SelectTrigger className="w-full md:w-64">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Tất cả Khoa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả Khoa</SelectItem>
                <SelectItem value="Khoa học Máy tính">
                  Khoa học Máy tính
                </SelectItem>
                <SelectItem value="Kỹ thuật Điện - Điện tử">
                  Kỹ thuật Điện - Điện tử
                </SelectItem>
                <SelectItem value="Kỹ thuật Cơ khí">Kỹ thuật Cơ khí</SelectItem>
                <SelectItem value="Kỹ thuật Xây dựng">
                  Kỹ thuật Xây dựng
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="text-sm text-gray-500 mb-4">
        Hiển thị {filteredTutors.length} giảng viên
      </div>

      {/* Tutor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTutors.map((tutor) => (
          <Card key={tutor.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-[#1488D8] text-white text-lg">
                    {tutor.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="text-gray-900 truncate">{tutor.name}</h3>
                  <p className="text-sm text-gray-500">{tutor.faculty}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{tutor.rating}</span>
                    <span className="text-sm text-gray-400">
                      ({tutor.totalSessions})
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="text-xs text-gray-500 mb-2">Chuyên môn</div>
                  <div className="flex flex-wrap gap-2">
                    {tutor.expertise.map((exp, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {exp}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500 mb-2">Lịch trống</div>
                  <div className="space-y-1">
                    {tutor.availability.slice(0, 2).map((slot, index) => (
                      <div
                        key={index}
                        className="text-xs text-gray-600 flex items-center gap-1"
                      >
                        <Calendar className="h-3 w-3" />
                        {slot}
                      </div>
                    ))}
                    {tutor.availability.length > 2 && (
                      <div className="text-xs text-[#1488D8]">
                        +{tutor.availability.length - 2} khung giờ khác
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => setSelectedTutor(tutor)}
                      >
                        Xem hồ sơ
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-4">
                          <Avatar className="h-16 w-16">
                            <AvatarFallback className="bg-[#1488D8] text-white text-lg">
                              {tutor.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div>{tutor.name}</div>
                            <div className="text-sm text-gray-500">
                              {tutor.faculty}
                            </div>
                          </div>
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div>
                          <Label>Giới thiệu</Label>
                          <p className="text-sm text-gray-600 mt-1">
                            {tutor.bio}
                          </p>
                        </div>

                        <div>
                          <Label>Chuyên môn</Label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {tutor.expertise.map((exp, index) => (
                              <Badge key={index} variant="secondary">
                                {exp}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label>Lịch trống</Label>
                          <div className="space-y-2 mt-2">
                            {tutor.availability.map((slot, index) => (
                              <div
                                key={index}
                                className="text-sm text-gray-600 flex items-center gap-2 border border-gray-200 rounded p-2"
                              >
                                <Calendar className="h-4 w-4 text-[#1488D8]" />
                                {slot}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex items-center gap-2">
                            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                            <span className="text-lg">{tutor.rating}</span>
                            <span className="text-sm text-gray-400">
                              ({tutor.totalSessions} buổi học)
                            </span>
                          </div>
                          <Button
                            className="bg-[#1488D8] hover:bg-[#1488D8]/90"
                            onClick={() => handleRegisterTutor(tutor)}
                          >
                            Đăng ký gia sư
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button
                    className="flex-1 bg-[#1488D8] hover:bg-[#1488D8]/90"
                    onClick={() => handleRegisterTutor(tutor)}
                  >
                    Đăng ký
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
