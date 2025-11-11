import { Calendar, Clock, Star, Users, TrendingUp, BookOpen, CheckCircle } from 'lucide-react';
import { User } from '../App';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from './ui/dialog';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback } from './ui/avatar';
import React, { useState } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from './ui/table';


type TutorDashboardProps = {
  user: User;
};
const stats = [
    { label: 'Tổng Buổi Học', value: 156, icon: Calendar, color: 'bg-blue-500' },
    { label: 'Tháng Này', value: 18, icon: Clock, color: 'bg-green-500' },
    { label: 'Đánh Giá Trung Bình', value: 4.9, icon: Star, color: 'bg-yellow-500' },
    { label: 'Sinh Viên Đang Hoạt Động', value: 42, icon: Users, color: 'bg-purple-500' },
 ];
type recentStudents = {
    name: string;
    progress: number; 
    sessions: number;
    lastSession: string;
  };
type upcomingSession = {
    id: number;
    student: string;
    studentId: string;
    subject: string;
    date: string;
    time: string;
    type: string;
    notes: string;
  };
type pendingRequest = {
    id: number;
    student: string;
    studentId: string;
    subject: string;
    typeRequested: string;
    timeRequested: string;
    requestDate: string;
};
function removePendingRequestById(pendingRequests: pendingRequest[], id: number) 
{
  return pendingRequests.filter((r) => r.id !== id);
}
function addStudents(pendingRequest: pendingRequest, recentStudents1: recentStudents[], upcomingSessions: upcomingSession[], pendingRequest_all: pendingRequest[]) 
{
  recentStudents1.push({
    name: pendingRequest.student,
    progress: 0,
    sessions: 0,
    lastSession: 'Mới thêm',
  });

  upcomingSessions.push({
    id : upcomingSessions.length + 1,
    student: pendingRequest.student,
    studentId: pendingRequest.studentId,
    subject: pendingRequest.subject,
    date: '',
    time:  pendingRequest.timeRequested.split(' , ')[0],
    type: pendingRequest.typeRequested,
    notes: 'Buổi học đầu tiên',
  });
  
  const dayName = pendingRequest.timeRequested.split(' , ')[1];
  const days = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];
  const dayIndex = days.indexOf(dayName);
  const dayToday = new Date().getDay();
  const dayDiff = (dayIndex - dayToday + 7) % 7;
  
 upcomingSessions[upcomingSessions.length - 1].date = `${new Date(Date.now() + dayDiff * 24 * 60 * 60 * 1000).getDate()} Thg ${new Date(Date.now() + dayDiff * 24 * 60 * 60 * 1000).getMonth()}, ${new Date(Date.now() + dayDiff * 24 * 60 * 60 * 1000).getFullYear()}`;
  
 return { recentStudents1, upcomingSessions , pendingRequest_all: removePendingRequestById(pendingRequest_all, pendingRequest.id)};
  
}

export function TutorDashboard({ user }: TutorDashboardProps) {
  const upcomingSessions: upcomingSession[] = [
    {
      id: 1,
      student: 'Nguyễn Văn An',
      studentId: '1810123',
      subject: 'Cấu Trúc Dữ Liệu & Thuật Toán',
      date: '27 Thg 10, 2025',
      time: '14:00 - 15:30',
      type: 'Trực tuyến',
      notes: 'Sinh viên muốn ôn lại thuật toán sắp xếp',
    },
    {
      id: 2,
      student: 'Lê Thị Mai',
      studentId: '1810456',
      subject: 'Thuật Toán',
      date: '28 Thg 10, 2025',
      time: '10:00 - 11:00',
      type: 'Trực tiếp',
      notes: 'Buổi học đầu tiên - giới thiệu',
    },
    {
      id: 3,
      student: 'Trần Văn Đức',
      studentId: '1810789',
      subject: 'Cấu Trúc Dữ Liệu',
      date: '29 Thg 10, 2025',
      time: '15:00 - 16:30',
      type: 'Trực tuyến',
      notes: 'Cấu trúc dữ liệu cây',
    },
    { 
      id: 4,
      student: 'Trần Văn Đức',
      studentId: '1810789',
      subject: 'Cấu Trúc Dữ Liệu',
      date: '29 Thg 10, 2025',
      time: '15:00 - 16:30',
      type: 'Trực tuyến',
      notes: 'Cấu trúc dữ liệu cây',
     },
  ];
  const recentStudents1: recentStudents[] = [
    { name: 'Nguyễn Văn An', progress: 85, sessions: 12, lastSession: '2 ngày trước' },
    { name: 'Lê Thị Mai', progress: 70, sessions: 8, lastSession: '1 tuần trước' },
    { name: 'Trần Văn Đức', progress: 60, sessions: 6, lastSession: '3 ngày trước' },
    { name: 'Phạm Thị Hoa', progress: 90, sessions: 15, lastSession: '1 ngày trước' },
  ];

  const pendingRequests: pendingRequest[] = [
    {
      id: 1,
      student: 'Hoàng Văn Khánh',
      studentId: '1811234',
      subject: 'Học Máy',
      typeRequested: 'Trực tuyến',
      timeRequested: '8:00 - 9:30 , Thứ Bảy',
      requestDate: '26 Thg 10, 2025',
    },
    {
      id: 2,
      student: 'Võ Thị Lan',
      studentId: '1811567',
      subject: 'Cấu Trúc Dữ Liệu',
      typeRequested: 'Trực tiếp',
      timeRequested: '18:00 - 19:30 , Thứ Ba',
      requestDate: '25 Thg 10, 2025',
    },
  ];
  // Keep sessions in state so changes re-render the UI
  const [sessions, setSessions] = useState<upcomingSession[]>(upcomingSessions);
  const [pendingRequest_sessions, setPendingRequests] = useState<pendingRequest[]>(pendingRequests);
  const [recentStudents_sessions, setRecentStudents] = useState<recentStudents[]>(recentStudents1);
  // Pagination state
  const [sessionPage, setSessionPage] = useState(1);
  const pageSize = 5;
  const totalPages = Math.ceil(sessions.length / pageSize);
  const pageSessions = sessions.slice((sessionPage - 1) * pageSize, sessionPage * pageSize);



  return (
    <div className="p-6 space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#030391] to-[#1488D8] text-white rounded-lg p-6">
        <h2 className="text-2xl mb-2">Bảng Điều Khiển Gia Sư</h2>
        <p className="text-blue-100">
          Quản lý buổi học và theo dõi tiến độ sinh viên
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
              Buổi Học Sắp Tới
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {sessions.slice(0,3).map((session) => (
              <div             
                key={session.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-[#1488D8] transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-gray-900">{session.student}</h4>
                    <p className="text-sm text-gray-500">MSSV: {session.studentId}</p>
                    <p className="text-sm text-gray-600 mt-1">{session.subject}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    session.type === 'Trực tuyến' 
                      ? 'bg-green-100 text-green-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {session.type}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {session.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {session.time}
                  </span>
                </div>
                {session.notes && (
                  <div className="bg-gray-50 rounded p-2 text-xs text-gray-600 mt-2">
                    Ghi chú: {session.notes}
                  </div>
                )}
              </div>
            ))}
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full bg-[#1488D8] hover:bg-[#1488D8]/90">
                  <span> Xem Tất Cả Buổi Học</span>
                </Button>
              </DialogTrigger>           
               <DialogContent  className="p-3 overflow-hidden sm:max-w-[1000px] max-h-[600px]">
                <DialogHeader>
                  <DialogTitle>Buổi Học Tiếp Theo</DialogTitle>
                </DialogHeader>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Học viên</TableHead>
                        <TableHead>MSSV</TableHead>
                        <TableHead>Môn học</TableHead>
                        <TableHead>Ngày</TableHead>
                        <TableHead>Giờ</TableHead>
                        <TableHead>Hình thức</TableHead>
                        <TableHead>Ghi chú</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pageSessions.map((session) => (
                        <TableRow key={session.id}>
                          <TableCell className="font-medium">{session.student}</TableCell>
                          <TableCell>{session.studentId}</TableCell>
                          <TableCell>{session.subject}</TableCell>
                          <TableCell>{session.date}</TableCell>
                          <TableCell>{session.time}</TableCell>
                          <TableCell>
                            <span
                              className={`text-xs px-2 py-1 rounded ${
                                session.type === 'Trực tuyến'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-blue-100 text-blue-700'
                              }`}
                            >
                              {session.type}
                            </span>
                          </TableCell>
                          <TableCell className="max-w-[120px]truncate">{session.notes}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <DialogFooter className="mt-4 flex items-center justify-between gap-2">
                  <div className="text-sm text-gray-600">
                    Trang {sessionPage} / {totalPages || 1}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setSessionPage((p) => Math.max(1, p - 1))}
                      disabled={sessionPage <= 1}
                    >
                      Trước
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setSessionPage((p) => Math.min(totalPages, p + 1))}
                      disabled={sessionPage >= totalPages}
                    >
                      Sau
                    </Button>
                    <DialogClose asChild>
                      <Button variant="default">Đóng</Button>
                    </DialogClose>
                  </div>
                </DialogFooter>
               </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Pending Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-[#1488D8]" />
              Yêu Cầu Chờ Xử Lý ({pendingRequest_sessions.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingRequest_sessions.map((request) => (
              <div
                key={request.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-[#1488D8] text-white text-sm">
                        {request.student.split(' ').map((n) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="text-gray-900">{request.student}</h4>
                      <p className="text-sm text-gray-500">MSSV: {request.studentId}</p>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">Yêu cầu thời gian: {request.timeRequested}</p>
                <p className="text-sm text-gray-600 mb-2">Môn học: {request.subject}</p>
                <p className="text-sm text-gray-600 mb-3">Hình thức: {request.typeRequested}</p>
                <p className="text-xs text-gray-500 mb-4">Yêu cầu lúc: {request.requestDate}</p>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                  <Button className="flex-1 bg-[#1488D8] hover:bg-[#1488D8]/90" size="sm">
                    Chấp Nhận
                  </Button>
                    </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="font-bold">Chấp nhận yêu cầu</DialogTitle>
                    </DialogHeader>
                    <DialogDescription className=" text-sm text-gray-600">
                      Hành động này sẽ thêm học viên vào danh sách của bạn và lên lịch buổi học đầu tiên.
                    </DialogDescription>
                    <div className="flex gap-2 mt-4">
                       <DialogClose asChild>
                  <Button className="flex-1 bg-[#1488D8] hover:bg-[#1488D8]/90" size="sm"
                   onClick={() => {
                    addStudents(request, recentStudents_sessions, sessions , pendingRequest_sessions);
                    setSessions(sessions);
                    setPendingRequests((prev) => prev.filter((r) => r.id !== request.id));
                    setRecentStudents(recentStudents_sessions);
                   }}
                  >
                    Có
                  </Button>
                  </DialogClose>
                  <DialogClose asChild>
                        <Button variant="outline" className="flex-1" size="sm">
                          Không
                        </Button>
                      </DialogClose>
                    </div>
                  </DialogContent>
                  </Dialog>
                  <Dialog>
                    <DialogTrigger asChild>
                       <Button variant="outline" className="flex-1" size="sm">
                    Từ Chối
                  </Button>
                    </DialogTrigger>
                 <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="font-bold"> Từ chối yêu cầu </DialogTitle>
                    </DialogHeader>
                    <DialogDescription className=" text-sm text-gray-600">
                      Bạn chắc chắn muốn từ chối yêu cầu này . Việc thực hiện hành động này sẽ không thể hoàn tác.
                    </DialogDescription>
                    <div className="flex gap-2 mt-4">
                  <Button className="flex-1 bg-[#1488D8] hover:bg-[#1488D8]/90" size="sm"
                  onClick={() => {
                    setPendingRequests((prev) => prev.filter((r) => r.id !== request.id));
                  }}
                  >
                    Có
                  </Button>
                  <DialogClose asChild>
                        <Button variant="outline" className="flex-1" size="sm">
                          Không
                        </Button>
                    </DialogClose>
                  </div> 
                  </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
            {pendingRequest_sessions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p>Không có yêu cầu chờ xử lý</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Student Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#1488D8]" />
            Tiến Độ Sinh Viên Gần Đây
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentStudents_sessions.slice(0,3).map((student, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-[#1488D8] text-white">
                        {student.name.split(' ').map((n) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="text-gray-900">{student.name}</h4>
                      <p className="text-sm text-gray-500">{student.sessions} buổi học • Lần cuối: {student.lastSession}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-600">{student.progress}%</span>
                </div>
                <Progress value={student.progress} className="h-2" />
              </div>
            ))}
          </div>
          <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full bg-[#1488D8] hover:bg-[#1488D8]/90">
                  <span> Xem Tất Cả Tiến Độ Sinh Viên</span>
                </Button>
              </DialogTrigger>
              <DialogContent >  
                <DialogHeader>
                  <DialogTitle>Tiến Độ Sinh Viên</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
            {recentStudents_sessions.slice((sessionPage - 1) * pageSize, sessionPage * pageSize).map((student, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-[#1488D8] text-white">
                        {student.name.split(' ').map((n) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="text-gray-900">{student.name}</h4>
                      <p className="text-sm text-gray-500">{student.sessions} buổi học • Lần cuối: {student.lastSession}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-600">{student.progress}%</span>
                </div>
                <Progress value={student.progress} className="h-2" />
              </div>
            ))}
          </div>
                <DialogFooter className="mt-4 flex items-center justify-between gap-2">
                  <div className="text-sm text-gray-600">
                    Trang {sessionPage} / {totalPages || 1}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setSessionPage((p) => Math.max(1, p - 1))}
                      disabled={sessionPage <= 1}
                    >
                      Trước
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setSessionPage((p) => Math.min(totalPages, p + 1))}
                      disabled={sessionPage >= totalPages}
                    >
                      Sau
                    </Button>
                    <DialogClose asChild>
                      <Button variant="default">Đóng</Button>
                    </DialogClose>
                  </div>
                </DialogFooter>
          </DialogContent>
            </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}
