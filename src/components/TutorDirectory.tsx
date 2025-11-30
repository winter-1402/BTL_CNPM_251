import { useState, useEffect } from "react";
import { Search, Star, Filter, Calendar, X, User, Clock } from "lucide-react";
import { User as AppUser, Tutor } from "../App";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { tutorApi } from "../api/tutorApi";
import { sessionApi } from "../api/sessionApi";

type TutorDirectoryProps = {
  user: AppUser;
};

export function TutorDirectory({ user }: TutorDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState("all");
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);

  useEffect(() => {
    fetchTutors();
  }, []);

  const fetchTutors = async () => {
    try {
      setLoading(true);
      const data = await tutorApi.getAllTutors();
      const sanitizedData = data.map((t: any) => ({
        ...t,
        availability: Array.isArray(t.availability)
          ? t.availability.map((slot: string) => {
              // 1. Fix lỗi hiển thị tiếng Việt "Th?" -> "Thứ"
              let cleanSlot = slot
                .replace(/Th\?\s?/g, "Thứ ")
                .replace(/Th\?/g, "Thứ");
              // 2. Định dạng lại chuỗi thời gian dài
              if (cleanSlot.includes(" - ") && cleanSlot.includes("1970")) {
                const parts = cleanSlot.split(" - ");
                const startTimePart = parts[0];
                const endTimeRaw = parts[1];
                const dateObj = new Date(endTimeRaw);

             if (!isNaN(dateObj.getTime())) {
              const hours = dateObj.getUTCHours().toString().padStart(2, '0');
              const minutes = dateObj.getUTCMinutes().toString().padStart(2, '0');

           return `${startTimePart} - ${hours}:${minutes}`;
             }
              }
              return cleanSlot;
            })
          : [],
      }));

      setTutors(sanitizedData);
    } catch (error) {
      console.error("Error fetching tutors:", error);
      toast.error("Không thể tải danh sách giảng viên");
    } finally {
      setLoading(false);
    }
  };

  const filteredTutors = tutors.filter((tutor) => {
    const matchesSearch =
      tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tutor.expertise &&
        tutor.expertise.some((exp) =>
          exp.toLowerCase().includes(searchQuery.toLowerCase())
        ));
    const matchesFaculty =
      selectedFaculty === "all" || tutor.faculty === selectedFaculty;
    return matchesSearch && matchesFaculty;
  });

  const handleBookSession = async (tutor: Tutor) => {
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      await sessionApi.createSession({
        tutorId: tutor.id,
        studentId: user.id,
        date: tomorrow.toISOString().split("T")[0],
        time: "14:00",
        duration: 60,
        subject: "Yêu cầu buổi học mới",
        meetingLink: "https://meet.google.com/new",
      });

      toast.success("Đã gửi yêu cầu!", {
        description: `Yêu cầu học với ${tutor.name} đang chờ duyệt.`,
      });
    } catch (error) {
      console.error("Error booking session:", error);
      toast.error("Không thể gửi yêu cầu. Vui lòng thử lại.");
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#1488D8]"></div>
          <p className="mt-4 text-gray-600">Đang tải danh sách giảng viên...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl text-gray-900 mb-2">Danh Sách Giảng Viên</h2>
        <p className="text-gray-500">
          Tìm kiếm và kết nối với các giảng viên hàng đầu
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm tên giảng viên hoặc chuyên môn..."
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
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="text-sm text-gray-500 mb-4">
        Tìm thấy {filteredTutors.length} kết quả
      </div>

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
                  <h3 className="text-gray-900 font-semibold truncate">
                    {tutor.name}
                  </h3>
                  <p className="text-sm text-gray-500">{tutor.faculty}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{tutor.rating}</span>
                    <span className="text-sm text-gray-400">
                      ({tutor.totalSessions || 0})
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {/* Expertise Badges */}
                <div>
                  <div className="text-xs text-gray-500 mb-2">Chuyên môn</div>
                  <div className="flex flex-wrap gap-2">
                    {tutor.expertise && tutor.expertise.length > 0 ? (
                      tutor.expertise.slice(0, 3).map((exp, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {exp}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-gray-400">
                        Chưa cập nhật
                      </span>
                    )}
                  </div>
                </div>

                {/* Availability Section */}
                <div>
                  <div className="text-xs text-gray-500 mb-2">Lịch trống</div>
                  <div className="space-y-1">
                    {tutor.availability && tutor.availability.length > 0 ? (
                      tutor.availability.slice(0, 2).map((slot, index) => (
                        <div
                          key={index}
                          className="text-xs text-gray-600 flex items-center gap-1"
                        >
                          <Clock className="h-3 w-3 text-green-600" />
                          {slot}
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-gray-400 italic">
                        Chưa có lịch trống
                      </div>
                    )}
                    {tutor.availability && tutor.availability.length > 2 && (
                      <div className="text-xs text-[#1488D8]">
                        +{tutor.availability.length - 2} khung giờ khác
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  {/* View Profile Dialog */}
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
                    <DialogContent className="max-w-xl">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-[#1488D8] text-white">
                              {tutor.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div>{tutor.name}</div>
                            <div className="text-sm font-normal text-gray-500">
                              {tutor.faculty}
                            </div>
                          </div>
                        </DialogTitle>
                      </DialogHeader>

                      <div className="space-y-6">
                        <div>
                          <Label className="text-base">Giới thiệu</Label>
                          <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                            {tutor.bio || "Chưa có thông tin giới thiệu."}
                          </p>
                        </div>

                        <div>
                          <Label className="text-base">
                            Lịch rảnh chi tiết
                          </Label>
                          <div className="mt-2 grid grid-cols-2 gap-2">
                            {tutor.availability &&
                            tutor.availability.length > 0 ? (
                              tutor.availability.map((slot, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-2 p-2 border rounded bg-gray-50 text-sm"
                                >
                                  <Calendar className="h-4 w-4 text-[#1488D8]" />
                                  {slot}                               
                              </div>
                              ))
                            ) : (
                              <p className="text-sm text-gray-500 col-span-2">
                                Chưa cập nhật lịch rảnh.
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex flex-col">
                            <span className="text-sm text-gray-500">
                              Đánh giá
                            </span>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-semibold">
                                {tutor.rating}
                              </span>
                              <span className="text-xs text-gray-400">
                                ({tutor.totalSessions} lượt dạy)
                              </span>
                            </div>
                          </div>
                          <Button
                            className="bg-[#1488D8] hover:bg-[#1488D8]/90"
                            onClick={() => handleBookSession(tutor)}
                          >
                            Đặt lịch học ngay
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button
                    className="flex-1 bg-[#1488D8] hover:bg-[#1488D8]/90"
                    onClick={() => handleBookSession(tutor)}
                  >
                    Đặt lịch
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
