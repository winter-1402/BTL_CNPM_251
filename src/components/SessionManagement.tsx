import { useState } from "react";
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  Star,
  MessageSquare,
  X,
  CheckCircle,
} from "lucide-react";
import { User, Session } from "../App";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { toast } from "sonner";

type SessionManagementProps = {
  user: User;
};

export function SessionManagement({ user }: SessionManagementProps) {
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const sessions: Session[] = [
    {
      id: "1",
      tutorId: "1",
      tutorName: "Dr. Tran Van Minh",
      studentId: user.id,
      studentName: user.name,
      subject: "Data Structures & Algorithms",
      type: "online",
      status: "scheduled",
      date: "2025-10-27",
      time: "14:00",
      duration: 90,
      meetingLink: "https://meet.google.com/abc-defg-hij",
      notes: "Please review sorting algorithms before the session",
    },
    {
      id: "2",
      tutorId: "2",
      tutorName: "MSc. Le Thi Hoa",
      studentId: user.id,
      studentName: user.name,
      subject: "Database Systems",
      type: "in-person",
      status: "scheduled",
      date: "2025-10-28",
      time: "10:00",
      duration: 60,
      location: "Building A1, Room 302",
      notes: "Bring your laptop with MySQL installed",
    },
    {
      id: "3",
      tutorId: "3",
      tutorName: "PhD. Nguyen Thanh Long",
      studentId: user.id,
      studentName: user.name,
      subject: "Machine Learning",
      type: "online",
      status: "completed",
      date: "2025-10-20",
      time: "15:00",
      duration: 90,
      meetingLink: "https://meet.google.com/xyz-abcd-efg",
      rating: 5,
      feedback: "Excellent session! Very clear explanations.",
    },
    {
      id: "4",
      tutorId: "1",
      tutorName: "Dr. Tran Van Minh",
      studentId: user.id,
      studentName: user.name,
      subject: "Algorithms",
      type: "online",
      status: "completed",
      date: "2025-10-15",
      time: "14:00",
      duration: 60,
      rating: 5,
    },
    {
      id: "5",
      tutorId: "6",
      tutorName: "Dr. Hoang Van Khanh",
      studentId: user.id,
      studentName: user.name,
      subject: "Software Engineering",
      type: "in-person",
      status: "cancelled",
      date: "2025-10-18",
      time: "16:00",
      duration: 90,
      location: "Building B4, Room 201",
    },
  ];

  const upcomingSessions = sessions.filter((s) => s.status === "scheduled");
  const completedSessions = sessions.filter((s) => s.status === "completed");
  const cancelledSessions = sessions.filter((s) => s.status === "cancelled");

  const handleCancelSession = (session: Session) => {
    toast.success("Đã hủy buổi học", {
      description: `Buổi học với ${session.tutorName} đã được hủy.`,
    });
  };

  const handleSubmitFeedback = () => {
    toast.success("Đã gửi đánh giá", {
      description: "Cảm ơn bạn đã đánh giá!",
    });
    setRating(0);
    setFeedback("");
  };

  const SessionCard = ({ session }: { session: Session }) => {
    const statusColors = {
      scheduled: "bg-blue-100 text-blue-700",
      completed: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
    };

    const statusLabels = {
      scheduled: "Đã Đặt",
      completed: "Hoàn Thành",
      cancelled: "Đã Hủy",
    };

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-gray-900 mb-1">{session.subject}</h3>
              <p className="text-sm text-gray-500">với {session.tutorName}</p>
            </div>
            <Badge className={statusColors[session.status]} variant="secondary">
              {statusLabels[session.status]}
            </Badge>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date(session.date).toLocaleDateString("vi-VN", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>
                {session.time} ({session.duration} phút)
              </span>
            </div>
            {session.type === "online" ? (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Video className="h-4 w-4" />
                <span>Buổi Học Trực Tuyến</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{session.location}</span>
              </div>
            )}
          </div>

          {session.notes && (
            <div className="bg-gray-50 rounded p-3 mb-4">
              <p className="text-sm text-gray-600">
                <span className="text-gray-900">Ghi chú:</span> {session.notes}
              </p>
            </div>
          )}

          {session.status === "completed" && session.rating && (
            <div className="flex items-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= session.rating!
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="text-sm text-gray-600 ml-2">
                {session.feedback && `"${session.feedback}"`}
              </span>
            </div>
          )}

          <div className="flex gap-2">
            {session.status === "scheduled" && (
              <>
                {session.type === "online" && session.meetingLink && (
                  <Button
                    className="flex-1 bg-[#1488D8] hover:bg-[#1488D8]/90"
                    onClick={() => window.open(session.meetingLink, "_blank")}
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
                        Bạn có chắc chắn muốn hủy buổi học với{" "}
                        {session.tutorName}?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline">Giữ Buổi Học</Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleCancelSession(session)}
                      >
                        Hủy Buổi Học
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </>
            )}
            {session.status === "completed" && !session.rating && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full bg-[#1488D8] hover:bg-[#1488D8]/90">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Đánh Giá
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Đánh Giá Buổi Học</DialogTitle>
                    <DialogDescription>
                      Buổi học với {session.tutorName} như thế nào?
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <Label>Điểm Đánh Giá</Label>
                      <div className="flex gap-2 mt-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setRating(star)}
                            className="focus:outline-none"
                          >
                            <Star
                              className={`h-8 w-8 ${
                                star <= rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="feedback">Nhận Xét (Tùy Chọn)</Label>
                      <Textarea
                        id="feedback"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Chia sẻ trải nghiệm của bạn..."
                        className="mt-2"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      className="bg-[#1488D8] hover:bg-[#1488D8]/90"
                      onClick={handleSubmitFeedback}
                      disabled={rating === 0}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Gửi Đánh Giá
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl text-gray-900 mb-2">Buổi Học Của Tôi</h2>
        <p className="text-gray-500">
          Quản lý các buổi học và cung cấp đánh giá
        </p>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList>
          <TabsTrigger value="upcoming">
            Sắp Tới ({upcomingSessions.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Hoàn Thành ({completedSessions.length})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Đã Hủy ({cancelledSessions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingSessions.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Không có buổi học sắp tới</p>
                <Button className="mt-4 bg-[#1488D8] hover:bg-[#1488D8]/90">
                  Đặt Buổi Học
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {upcomingSessions.map((session) => (
                <SessionCard key={session.id} session={session} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedSessions.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Chưa có buổi học hoàn thành</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {completedSessions.map((session) => (
                <SessionCard key={session.id} session={session} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          {cancelledSessions.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <X className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Không có buổi học đã hủy</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {cancelledSessions.map((session) => (
                <SessionCard key={session.id} session={session} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
