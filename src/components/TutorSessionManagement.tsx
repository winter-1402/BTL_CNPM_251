import { useEffect, useState } from 'react';
import { Calendar, Clock, Video, MapPin, Star, MessageSquare, X, CheckCircle } from 'lucide-react';
import { User, Session } from '../App';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { toast } from 'sonner@2.0.3';
import { set } from 'react-hook-form';

type SessionManagementProps = {
  user: User;
};

export function TutorSessionManagement({ user }: SessionManagementProps) {
  
 const [Session, setSessions] = useState<any[]>([]);

const [loading, setLoading] = useState(true);
  useEffect(() => {
  const fetchDashboardData = async () => {
            try {
              const response_sessions = await fetch(`http://localhost:8000/api/tutor/all-sessions?userid=${user.id[0]}`);
              const data_sessions = await response_sessions.json();
              setSessions(data_sessions);
            } catch (error) {
              console.error('Error fetching dashboard data:', error);
            }
            finally {
                setLoading(false);
            }
          }
     fetchDashboardData();
      }, []);

const now = new Date('2025-10-28T00:00:00'); // Thời điểm hiện tại
// Hoặc mốc thời gian cứng nếu bạn đang test: new Date('2025-10-28T00:00:00')

// 1. Lọc và map Sắp tới
const upcoming = Session
  .filter(s => new Date(s.thoi_gian) > now && s.cancelled_at === null)
  .map(s => ({ ...s, status: 'scheduled' })); // Thêm cột status
// 2. Lọc và map Hoàn thành
const completed = Session
  .filter(s => new Date(s.thoi_gian) <= now && s.cancelled_at === null)
  .map(s => ({ ...s, status: 'completed' })); // Thêm cột status

// 3. Lọc và map Đã hủy
const cancelled = Session
  .filter(s => s.cancelled_at !== null)
  .map(s => ({ ...s, status: 'cancelled' })); // Thêm cột status   

 const handleCancelSession = async (sessionToCancel: any) => {
    // 1. Tạo thời gian hủy hiện tại
    const nowISO = new Date().toISOString();

    // 2. Cập nhật State cục bộ (UI sẽ tự động chuyển tab nhờ logic filter bên trên)
    const updatedSessions = Session.map((s: any) => {
      // Tìm đúng buổi học cần hủy dựa vào ID
      if (s.session_id === sessionToCancel.session_id) {
        // Trả về object cũ nhưng cập nhật thêm trường cancelled_at
        return { ...s, cancelled_at: nowISO, status: 'cancelled' };
      }
      return s;
    });

    setSessions(updatedSessions);

    // 3. Hiển thị thông báo thành công
    toast.success('Đã hủy buổi học', {
      description: (
        <span className="text-black font-medium text-base">
          Buổi học với {sessionToCancel.student_name} đã được hủy.
        </span>
      ),
    });};
 

  const SessionCard = ({ session } ) => {
    const statusColors = {
      scheduled: 'bg-blue-100 text-blue-700',
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    };
   
    const statusLabels = {
      scheduled: 'Đã Đặt',
      completed: 'Hoàn Thành',
      cancelled: 'Đã Hủy',
    };
   return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-gray-900 mb-1">{session.topic}</h3>
            </div>
            <Badge className={statusColors[session.status]} variant="secondary">
              {statusLabels[session.status]}
            </Badge>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>{new Date(session.thoi_gian.split('T')[0]).toLocaleDateString('vi-VN', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>{`Thời gian: ${session.thoi_gian.split('T')[1].replace(':00.000Z', '')}`}</span>
              <span>{`Thời lượng: ${session.thoi_luong}`}</span>
            </div>
            {session.kieu === 'Trực Tuyến' ? (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Video className="h-4 w-4" />
                <span>Buổi Học Trực Tuyến : </span>
                <span>{session.duong_link}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{session.dia_diem}</span>
              </div>
            )}
          </div>

          {session.notes && (
            <div className="bg-gray-50 rounded p-3 mb-4">
              <p className="text-sm text-gray-600">
                <span className="text-gr50-900">Ghi chú:</span> {session.notes}
              </p>
            </div>
          )}

          {session.status === 'completed' && session.rating && (
            <div className="flex items-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= session.rating!
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="text-sm text-gray-600 ml-2">
                {session.feedback && `"${session.feedback}"`}
              </span>
            </div>
          )}

          <div className="flex gap-2">
            {session.status === 'scheduled' && (
              <>
                {session.kieu === 'Trực Tuyến' && session.duong_link && (
                  <Button
                    className="flex-1 bg-[#1488D8] hover:bg-[#1488D8]/90"
                    onClick={() => window.open(session.duong_link, '_blank')}
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Tham Gia 
                  </Button>
                )}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex-1">
                      <X className="h-4 w-4 mr-2" />
                      Hủy
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Hủy Buổi Học</DialogTitle>
                      <DialogDescription>
                        Bạn có chắc chắn muốn hủy buổi học với {session.student_name}?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline">Giữ Buổi Học</Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          handleCancelSession(session);
 
                        }}
                      >
                        Hủy Buổi Học
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </div>
        </CardContent>
      </Card>
        )};
  
  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl text-gray-900 mb-2">Buổi Dạy Của Tôi</h2>
        <p className="text-gray-500">
          Quản lý các buổi dạy và cung cấp đánh giá
        </p>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList>
          <TabsTrigger value="upcoming">
            Sắp Tới ({upcoming.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Hoàn Thành ({completed.length})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Đã Hủy ({cancelled.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcoming.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Không có buổi học sắp tới</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {upcoming.map((session, index) => (
                <SessionCard key={index} session={session} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completed.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Chưa có buổi học hoàn thành</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {completed.map((session,index) => (
                <SessionCard key={index} session={session} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          {cancelled.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <X className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Không có buổi học đã hủy</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {cancelled.map((session, index) => (
                <SessionCard key={index} session={session} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}