import { useState } from "react";
import {
  MessageSquare,
  Star,
  Send,
  CheckCircle,
  Calendar,
  User as UserIcon,
} from "lucide-react";
import { User } from "../App";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
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
  DialogFooter,
} from "./ui/dialog";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

type FeedbackProps = {
  user: User;
};

type SessionFeedback = {
  id: string;
  sessionId: string;
  tutorName: string;
  tutorId: string;
  subject: string;
  sessionDate: string;
  rating: number;
  feedback: string;
  submittedDate: string;
  status: "pending" | "submitted";
};

type CompletedSession = {
  id: string;
  tutorName: string;
  tutorId: string;
  subject: string;
  date: string;
  duration: number;
  hasFeedback: boolean;
};

export function Feedback({ user }: FeedbackProps) {
  const [feedbackHistory, setFeedbackHistory] = useState<SessionFeedback[]>([
    {
      id: "1",
      sessionId: "S001",
      tutorName: "Dr. Tran Van Minh",
      tutorId: "T001",
      subject: "Data Structures",
      sessionDate: "2025-10-20",
      rating: 5,
      feedback:
        "Excellent session! Dr. Minh explained binary trees very clearly with great examples.",
      submittedDate: "2025-10-20",
      status: "submitted",
    },
    {
      id: "2",
      sessionId: "S002",
      tutorName: "MSc. Le Thi Hoa",
      tutorId: "T002",
      subject: "Algorithms",
      sessionDate: "2025-10-18",
      rating: 4,
      feedback:
        "Good explanation of sorting algorithms. Would like more practice problems.",
      submittedDate: "2025-10-18",
      status: "submitted",
    },
    {
      id: "3",
      sessionId: "S003",
      tutorName: "PhD. Nguyen Thanh Long",
      tutorId: "T003",
      subject: "Machine Learning",
      sessionDate: "2025-10-15",
      rating: 5,
      feedback:
        "Outstanding! The neural network concepts were explained with perfect clarity.",
      submittedDate: "2025-10-15",
      status: "submitted",
    },
  ]);

  const [completedSessions] = useState<CompletedSession[]>([
    {
      id: "S004",
      tutorName: "Dr. Hoang Van Khanh",
      tutorId: "T006",
      subject: "Software Engineering",
      date: "2025-10-25",
      duration: 90,
      hasFeedback: false,
    },
    {
      id: "S005",
      tutorName: "Dr. Tran Van Minh",
      tutorId: "T001",
      subject: "Data Structures",
      date: "2025-10-23",
      duration: 60,
      hasFeedback: false,
    },
  ]);

  const handleSubmitFeedback = (
    sessionId: string,
    tutorName: string,
    tutorId: string,
    subject: string,
    sessionDate: string,
    rating: number,
    feedback: string
  ) => {
    const newFeedback: SessionFeedback = {
      id: Date.now().toString(),
      sessionId,
      tutorName,
      tutorId,
      subject,
      sessionDate,
      rating,
      feedback,
      submittedDate: new Date().toISOString().split("T")[0],
      status: "submitted",
    };

    setFeedbackHistory([newFeedback, ...feedbackHistory]);
    toast.success("Đã gửi đánh giá!", {
      description:
        "Cảm ơn bạn đã đánh giá. Điều này giúp chúng tôi cải thiện trải nghiệm học tập.",
    });
  };

  const pendingFeedback = completedSessions.filter((s) => !s.hasFeedback);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-gray-900 mb-2">Đánh Giá Buổi Học</h2>
          <p className="text-gray-500">
            Cung cấp đánh giá về buổi học của bạn để giúp cải thiện trải nghiệm
            học tập
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Tổng Đánh Giá</p>
                <p className="text-2xl mt-1">{feedbackHistory.length}</p>
              </div>
              <MessageSquare className="h-10 w-10 text-[#1488D8]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Chờ Đánh Giá</p>
                <p className="text-2xl mt-1">{pendingFeedback.length}</p>
              </div>
              <CheckCircle className="h-10 w-10 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Điểm TB Đã Cho</p>
                <p className="text-2xl mt-1">
                  {(
                    feedbackHistory.reduce((acc, f) => acc + f.rating, 0) /
                    feedbackHistory.length
                  ).toFixed(1)}
                </p>
              </div>
              <Star className="h-10 w-10 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pending">
            Chờ Đánh Giá ({pendingFeedback.length})
          </TabsTrigger>
          <TabsTrigger value="history">
            Lịch Sử Đánh Giá ({feedbackHistory.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingFeedback.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {pendingFeedback.map((session) => (
                <PendingFeedbackCard
                  key={session.id}
                  session={session}
                  onSubmit={handleSubmitFeedback}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p className="text-gray-900 mb-2">Đã hoàn thành!</p>
                <p className="text-gray-500">
                  Bạn đã đánh giá tất cả các buổi học đã hoàn thành
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <div className="space-y-4">
            {feedbackHistory.map((feedback) => (
              <FeedbackHistoryCard key={feedback.id} feedback={feedback} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PendingFeedbackCard({
  session,
  onSubmit,
}: {
  session: CompletedSession;
  onSubmit: (
    sessionId: string,
    tutorName: string,
    tutorId: string,
    subject: string,
    sessionDate: string,
    rating: number,
    feedback: string
  ) => void;
}) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [showDialog, setShowDialog] = useState(false);

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error("Vui lòng chọn điểm đánh giá");
      return;
    }
    if (feedback.trim() === "") {
      toast.error("Vui lòng viết nhận xét");
      return;
    }

    onSubmit(
      session.id,
      session.tutorName,
      session.tutorId,
      session.subject,
      session.date,
      rating,
      feedback
    );
    setShowDialog(false);
    setRating(0);
    setFeedback("");
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-[#1488D8] text-white">
              {session.tutorName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-gray-900">{session.tutorName}</h3>
            <p className="text-sm text-gray-600">{session.subject}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(session.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span>{session.duration} min</span>
            </div>
          </div>
          <Badge variant="secondary" className="bg-orange-100 text-orange-700">
            Chờ Xử Lý
          </Badge>
        </div>

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button className="w-full bg-[#1488D8] hover:bg-[#1488D8]/90">
              <MessageSquare className="h-4 w-4 mr-2" />
              Đánh Giá
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Đánh Giá Buổi Học</DialogTitle>
              <DialogDescription>
                Chia sẻ trải nghiệm của bạn với {session.tutorName}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-[#1488D8] text-white">
                    {session.tutorName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-gray-900">{session.tutorName}</p>
                  <p className="text-sm text-gray-600">{session.subject}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(session.date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div>
                <Label className="mb-3 block">
                  Bạn đánh giá buổi học này như thế nào?
                </Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-10 w-10 ${
                          star <= (hoverRating || rating)
                            ? "fill-yellow-500 text-yellow-500"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="text-sm text-gray-600 mt-2">
                    {rating === 5 && "Xuất sắc!"}
                    {rating === 4 && "Rất tốt"}
                    {rating === 3 && "Tốt"}
                    {rating === 2 && "Khá"}
                    {rating === 1 && "Cần cải thiện"}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="feedback">Nhận Xét Của Bạn</Label>
                <Textarea
                  id="feedback"
                  placeholder="Chia sẻ suy nghĩ của bạn về buổi học, những điều tốt và cần cải thiện..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={6}
                  className="mt-2"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Đánh giá của bạn giúp gia sư cải thiện và hỗ trợ sinh viên
                  khác chọn gia sư phù hợp.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Hủy
              </Button>
              <Button
                onClick={handleSubmit}
                className="bg-[#1488D8] hover:bg-[#1488D8]/90"
              >
                <Send className="h-4 w-4 mr-2" />
                Gửi Đánh Giá
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

function FeedbackHistoryCard({ feedback }: { feedback: SessionFeedback }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4 flex-1">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-[#1488D8] text-white">
                {feedback.tutorName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-gray-900">{feedback.tutorName}</h3>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < feedback.rating
                          ? "fill-yellow-500 text-yellow-500"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">{feedback.subject}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Buổi học:{" "}
                  {new Date(feedback.sessionDate).toLocaleDateString("vi-VN")}
                </span>
                <span>
                  Đã gửi:{" "}
                  {new Date(feedback.submittedDate).toLocaleDateString("vi-VN")}
                </span>
              </div>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                {feedback.feedback}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
