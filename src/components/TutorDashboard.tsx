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
import React, { useEffect, useState } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from './ui/table';
import { toast } from 'sonner';
import { get } from 'http';
import { addMinutes, format } from 'date-fns';

type TutorDashboardProps = {
  user: User;
};

function formatSessionWithLib(startStr :string, duration: number) {
    let start = new Date(startStr);
    let end = addMinutes(start, duration);
    // Adjust for timezone offset
    start = new Date(start.getTime() + start.getTimezoneOffset() * 60000);
    end = new Date(end.getTime() + end.getTimezoneOffset() * 60000);

    // Format pattern: 'yyyy-MM-dd , HH:mm - HH:mm'
    return `${format(start, 'yyyy-MM-dd')} , ${format(start, 'HH:mm')} - ${format(end, 'HH:mm')}`;
}
function tinhThoiLuong(startStr, endStr) {
    // Input ví dụ:
    // startStr = "Thứ Hai 14:00"
    // endStr = "19:00.0000Z"

    // 1. Kiểm tra dữ liệu đầu vào để tránh crash
    if (!startStr || !endStr) return 0;

    // 2. Regex để tìm định dạng "Số:Số" (Ví dụ: 14:00 hoặc 09:30)
    // Nó sẽ bỏ qua "Thứ Hai", ".0000Z" hay bất cứ ký tự lạ nào.
    const timePattern = /(\d{1,2}):(\d{2})/;

    const startMatch = startStr.match(timePattern);
    const endMatch = endStr.match(timePattern);

    // Nếu không tìm thấy giờ trong chuỗi, trả về 0
    if (!startMatch || !endMatch) return 0;

    // 3. Hàm đổi giờ:phút ra tổng số phút
    // match[1] là giờ, match[2] là phút
    const getMinutes = (match) => {
        const hours = parseInt(match[1]);
        const minutes = parseInt(match[2]);
        return (hours * 60) + minutes;
    };

    const startTotalMinutes = getMinutes(startMatch); // 14:00 -> 840 phút
    const endTotalMinutes = getMinutes(endMatch);     // 19:00 -> 1140 phút

    // 4. Trừ nhau để ra kết quả
    return endTotalMinutes - startTotalMinutes;
}
function addStudents(pendingRequest ,recentStudents1, progress, pendingRequest_all) 
{
  recentStudents1.push({
    id : recentStudents1.length ,
    student_name: pendingRequest.student_name,
    MSSV : pendingRequest.MSSV,
    thoi_gian: '',
    thoi_luong: tinhThoiLuong(pendingRequest.startTime.split(' ')[2], pendingRequest.endTime),
    kieu : pendingRequest.booked_types,
    topic : pendingRequest.topic,
    notes : 'Buổi học đầu tiên',   
  });

  progress.push({
    id : progress.length ,
    student_name: pendingRequest.student_name,
    subject: pendingRequest.subject,
    MSSV : pendingRequest.MSSV,
    tien_do : 0,
  });
  
  const dayName = pendingRequest.startTime.split(' ')[0] + ' ' + pendingRequest.startTime.split(' ')[1];
  const days = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
  const dayIndex = days.indexOf(dayName);
  const dayToday = new Date("2025-10-27").getDay();
  let dayDiff = (dayIndex - dayToday) % 7;
  if (dayDiff <= 0) {
    dayDiff += 7;
  }
  const today = new Date("2025-10-27");
  recentStudents1[recentStudents1.length - 1].thoi_gian = `${new Date(today.getTime() + dayDiff * 24 * 60 * 60 * 1000).getFullYear()}-${new Date(today.getTime()+ dayDiff * 24 * 60 * 60 * 1000).getMonth()}-${new Date(today.getTime()+ (dayDiff-1) * 24 * 60 * 60 * 1000).getDate()}`;
  return { recentStudents1 , pendingRequest_all};
}

const handleCancelSession = (pendingRequests) => {
    toast.success(`Đã hủy yêu cầu của ${pendingRequests.student_name} vào lúc 2025-10-27 10:00`, 
    );
};


export function TutorDashboard({ user }: TutorDashboardProps) {

  const [stats1, setStats1] = useState(null);
  const [sessionData, setSessionData] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [requestData, setRequestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionPage, setSessionPage] = useState(1);
  
  useEffect(() => {
        // Define an async function inside useEffect
        const fetchDashboardData = async () => {
            try {
                // ✅ CORRECT: Call your backend API
                const response = await fetch(`http://localhost:8000/api/tutor/dashboard-stats?userid=${user.id[0]}`);
                const response_sessions = await fetch(`http://localhost:8000/api/tutor/upcoming-sessions?userid=${user.id[0]}`);
                const response_progress = await fetch(`http://localhost:8000/api/tutor/progress?userid=${user.id[0]}`);
                const response_requests = await fetch(`http://localhost:8000/api/tutor/pending-requests?userid=${user.id[0]}`);
                const data = await response.json();
                const data_sessions = await response_sessions.json();
                const data_progress = await response_progress.json();
                const data_requests = await response_requests.json();
                setStats1(data);
                setSessionData(data_sessions);
                setProgressData(data_progress);
                setRequestData(data_requests);
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []); // Empty array means run once on mount
    
    if (loading) return <div>Loading...</div>;
  const handleAddSession = (pendingRequests,recentStudents1) => {
        const input = {
          id : recentStudents1.length,
          MSSV: pendingRequests.MSSV,
          userid : user.id[0],
          thoi_gian: recentStudents1[recentStudents1.length -1].thoi_gian,
          thoi_luong: recentStudents1[recentStudents1.length -1].thoi_luong,
          kieu : recentStudents1[recentStudents1.length -1].kieu,
          topic : recentStudents1[recentStudents1.length -1].topic,
          dia_diem : '',
          duong_link : '',
        }
        if(recentStudents1[recentStudents1.length -1].kieu === 'Trực Tuyến'){
            input.duong_link = 'https://meet.google.com/example-link'
          }
          else{
         input.dia_diem = 'H3-112'
          };
        
        const addDashboardData = async () => {
            try {
                // ✅ CORRECT: Call your backend API
                const response = await fetch('http://localhost:8000/api/tutor/add',
                  {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // Bắt buộc phải có dòng này
            },
            body: JSON.stringify(input) // Chuyển object thành chuỗi JSON
        });
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };
        addDashboardData();
    toast.success(`Đã thêm buổi học với ${pendingRequests.student_name} vào lúc 2025-10-27 11:00`, 
    );
  };    
    const stats = [
    { label: 'Tổng Học Sinh Đang Dạy', value: stats1[0].tong_hoc_sinh , icon: Calendar, color: 'bg-blue-500' },
    { label: 'Tháng Này', value: stats1[0].tong_buoi_thang_nay, icon: Clock, color: 'bg-green-500' },
    { label: 'Đánh Giá Trung Bình', value: stats1[0].rating, icon: Star, color: 'bg-yellow-500' },
    { label: 'Sinh Viên Đang Hoạt Động', value: 42, icon: Users, color: 'bg-purple-500' },
 ];
    // Pagination state

  const pageSize = 5;
  const totalPages = Math.ceil(sessionData.length / pageSize);
  const pageSessions = sessionData.slice((sessionPage - 1) * pageSize, sessionPage * pageSize);

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
            {sessionData.slice(0,3).map((session,index) => (
              <div    
                key={index}       
                className="border border-gray-200 rounded-lg p-4 hover:border-[#1488D8] transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-gray-900">{session.student_name}</h4>
                    <p className="text-sm text-gray-500">
                      MSSV: {session.MSSV}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {session.topic}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      session.kieu === 'Trực Tuyến' 
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {session.kieu}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatSessionWithLib(session.thoi_gian, session.thoi_luong).split(' , ')[0]}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {formatSessionWithLib(session.thoi_gian, session.thoi_luong).split(' , ')[1]}
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
                      {pageSessions.map((session,index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{session.student_name}</TableCell>
                          <TableCell>{session.MSSV}</TableCell>
                          <TableCell>{session.topic}</TableCell>
                          <TableCell>{formatSessionWithLib(session.thoi_gian, session.thoi_luong).split(' , ')[0]}</TableCell>
                          <TableCell>{formatSessionWithLib(session.thoi_gian, session.thoi_luong).split(' , ')[1]}</TableCell>
                          <TableCell>
                            <span
                              className={`text-xs px-2 py-1 rounded ${
                                session.kieu === 'Trực Tuyến'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-blue-100 text-blue-700'
                              }`}
                            >
                              {session.kieu}
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
              Yêu Cầu Chờ Xử Lý ({requestData.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {requestData.map((request , index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-[#1488D8] text-white text-sm">
                        {request.student_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="text-gray-900">{request.student_name}</h4>
                      <p className="text-sm text-gray-500">
                        MSSV: {request.MSSV}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">Yêu cầu thời gian: {request.startTime} - {format(new Date(new Date(request.endTime).getTime() + new Date(request.endTime).getTimezoneOffset() * 60000), 'HH:mm')} </p>
                <p className="text-sm text-gray-600 mb-2">Môn học: {request.topic}</p>
                <p className="text-sm text-gray-600 mb-3">Hình thức: {request.booked_types}</p>
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
                    addStudents(request, sessionData, progressData, requestData);
                    setProgressData(progressData);
                    handleAddSession(request, sessionData);
                    setRequestData((prev) => prev.filter((r) => r.MSSV !== request.MSSV));
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
                    handleCancelSession(request);
                    setRequestData((prev) => prev.filter((r) => r.MSSV !== request.MSSV));
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
            {requestData.length === 0 && (
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
            {progressData.slice(0,3).map((student, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-[#1488D8] text-white">
                        {student.student_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="text-gray-900">{student.student_name}</h4>
                      <p className="text-sm text-gray-500">
                        Môn : {student.topic} 
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-600">
                    {student.tien_do}%
                  </span>
                </div>
                <Progress value={student.tien_do} className="h-2" />
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
            {progressData.slice((sessionPage - 1) * pageSize, sessionPage * pageSize).map((student, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-[#1488D8] text-white">
                        {student.student_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="text-gray-900">{student.student_name}</h4>
                        <p className="text-sm text-gray-500">
                        Môn : {student.topic} 
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-600">
                    {student.tien_do}%
                  </span>
                </div>
                <Progress value={student.tien_do} className="h-2" />
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
