import {
  Calendar,
  Clock,
  Star,
  TrendingUp,
  Users,
  BookOpen,
} from "lucide-react";
import { User } from "../App";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { TutorDashboard } from "./TutorDashboard";
import { AdminManagement } from "./AdminManagement";

type DashboardProps = {
  user: User;
};

export function Dashboard({ user }: DashboardProps) {
  // Show tutor-specific dashboard for tutors
  if (user.role[0] === "tutor") {
    return <TutorDashboard user={user} />;
  }

  // Show admin management for admins
  if (user.role[0] === "admin") {
    return <AdminManagement user={user} />;
  }

  const stats = [
    {
      label: "Tổng số buổi học",
      value: "24",
      icon: Calendar,
      color: "bg-blue-500",
    },
    { label: "Giờ học", value: "36", icon: Clock, color: "bg-green-500" },
    {
      label: "Đánh giá trung bình",
      value: "4.8",
      icon: Star,
      color: "bg-yellow-500",
    },
    {
      label: "Gia sư đang học",
      value: "3",
      icon: Users,
      color: "bg-purple-500",
    },
  ];

  const upcomingSessions = [
    {
      id: 1,
      tutor: "TS. Trần Văn Minh",
      subject: "Cấu trúc dữ liệu & Giải thuật",
      date: "27 Thg 10, 2025",
      time: "14:00 - 15:30",
      type: "Trực tuyến",
    },
    {
      id: 2,
      tutor: "ThS. Lê Thị Hoa",
      subject: "Hệ quản trị CSDL",
      date: "28 Thg 10, 2025",
      time: "10:00 - 11:00",
      type: "Trực tiếp",
    },
    {
      id: 3,
      tutor: "TS. Nguyễn Thanh Long",
      subject: "Học máy",
      date: "29 Thg 10, 2025",
      time: "15:00 - 16:30",
      type: "Trực tuyến",
    },
  ];

  const courseProgress = [
    { course: "Cấu trúc dữ liệu", progress: 75, sessions: 8 },
    { course: "Hệ quản trị CSDL", progress: 60, sessions: 6 },
    { course: "Học máy", progress: 45, sessions: 5 },
    { course: "Công nghệ phần mềm", progress: 85, sessions: 10 },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#030391] to-[#1488D8] text-white rounded-lg p-6">
        <h2 className="text-2xl mb-2">Tổng quan</h2>
        <p className="text-blue-100">
          Theo dõi các buổi học, tiến độ và kết nối với gia sư tại ĐHBK TP.HCM
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className="text-2xl mt-1">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} text-white p-3 rounded-lg`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#1488D8]" />
              Buổi học sắp tới
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingSessions.map((session) => (
              <div
                key={session.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-[#1488D8] transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-gray-900">{session.subject}</h4>
                    <p className="text-sm text-gray-500">với {session.tutor}</p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      session.type === "Trực tuyến"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {session.type}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {session.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {session.time}
                  </span>
                </div>
              </div>
            ))}
            <Button className="w-full bg-[#1488D8] hover:bg-[#1488D8]/90">
              Xem tất cả buổi học
            </Button>
          </CardContent>
        </Card>

        {/* Course Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[#1488D8]" />
              Tiến độ học tập
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {courseProgress.map((course, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-900">
                      {course.course}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {course.sessions} buổi học
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={course.progress} className="flex-1" />
                  <span className="text-sm text-gray-600">
                    {course.progress}%
                  </span>
                </div>
              </div>
            ))}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Tiến độ tổng thể</span>
                <span className="text-[#030391]">66%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
