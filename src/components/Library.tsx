import { useState } from "react";
import {
  BookOpen,
  Download,
  Search,
  Filter,
  FileText,
  File,
  Video,
  FileArchive,
  Eye,
  Star,
} from "lucide-react";
import { User } from "../App";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'; // BỎ CÁC IMPORT CỦA TABS
import { toast } from 'sonner';
import { useMemo } from "react";

type LibraryProps = {
  user: User;
};

type Document = {
  id: string;
  title: string;
  subject: string;
  type: "pdf" | "doc" | "video" | "archive";
  author: string;
  uploadDate: string;
  downloads: number;
  rating: number;
  description: string;
  fileSize: string;
  tags: string[];
};

// ... Dữ liệu documents giữ nguyên
  const documents: Document[] = [
    {
      id: "1",
      title: "Data Structures and Algorithms - Complete Guide",
      subject: "Data Structures",
      type: "pdf",
      author: "Dr. Tran Van Minh",
      uploadDate: "2025-10-15",
      downloads: 245,
      rating: 4.8,
      description:
        "Comprehensive guide covering all fundamental data structures including arrays, linked lists, trees, graphs, and hash tables.",
      fileSize: "12.5 MB",
      tags: ["Beginner", "Theory", "Practice"],
    },
    {
      id: "2",
      title: "Sorting Algorithms Explained",
      subject: "Algorithms",
      type: "video",
      author: "MSc. Le Thi Hoa",
      uploadDate: "2025-10-20",
      downloads: 189,
      rating: 4.9,
      description:
        "Video lecture series explaining bubble sort, quick sort, merge sort, and heap sort with visualizations.",
      fileSize: "1.2 GB",
      tags: ["Video", "Intermediate", "Visualization"],
    },
    {
      id: "3",
      title: "SQL Database Design Patterns",
      subject: "Database Systems",
      type: "pdf",
      author: "PhD. Nguyen Thanh Long",
      uploadDate: "2025-10-18",
      downloads: 312,
      rating: 4.7,
      description:
        "Best practices and design patterns for relational database design, normalization, and optimization.",
      fileSize: "8.3 MB",
      tags: ["Advanced", "Design Patterns"],
    },
    {
      id: "4",
      title: "Machine Learning Fundamentals",
      subject: "Machine Learning",
      type: "pdf",
      author: "Dr. Hoang Van Khanh",
      uploadDate: "2025-10-10",
      downloads: 428,
      rating: 4.9,
      description:
        "Introduction to supervised and unsupervised learning, neural networks, and deep learning basics.",
      fileSize: "25.8 MB",
      tags: ["Beginner", "Theory", "Python"],
    },
    {
      id: "5",
      title: "Practice Problems - Data Structures",
      subject: "Data Structures",
      type: "archive",
      author: "Dr. Tran Van Minh",
      uploadDate: "2025-10-22",
      downloads: 156,
      rating: 4.6,
      description:
        "Collection of 100+ practice problems with solutions for mastering data structures.",
      fileSize: "5.2 MB",
      tags: ["Practice", "Solutions Included"],
    },
    {
      id: '6',
      title: 'Software Design Principles',
      subject: 'Software Engineering',
      type: 'doc',
      author: 'MSc. Pham Thi Lan',
      uploadDate: '2025-10-12',
      downloads: 267,
      rating: 4.8,
      description:
        "SOLID principles, design patterns, and clean code practices for software development.",
      fileSize: "15.7 MB",
      tags: ["Theory", "Best Practices"],
    },
    {
      id: "7",
      title: "Graph Algorithms Workshop Recording",
      subject: "Algorithms",
      type: "video",
      author: "Dr. Tran Van Minh",
      uploadDate: "2025-10-25",
      downloads: 98,
      rating: 4.9,
      description:
        "Complete workshop on graph traversal, shortest path algorithms, and minimum spanning trees.",
      fileSize: "2.8 GB",
      tags: ["Video", "Advanced", "Workshop"],
    },
    {
      id: "8",
      title: "Python Programming Cheat Sheet",
      subject: "Programming",
      type: "pdf",
      author: "MSc. Le Thi Hoa",
      uploadDate: "2025-10-08",
      downloads: 523,
      rating: 4.7,
      description:
        "Quick reference guide for Python syntax, built-in functions, and common libraries.",
      fileSize: "2.1 MB",
      tags: ["Cheat Sheet", "Quick Reference"],
    },
  ];

export function Library({ user }: LibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>([]);

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.subject.toLowerCase().includes(searchQuery.toLowerCase()); // Thêm tìm kiếm theo môn học
    const matchesSubject = selectedSubject === 'all' || doc.subject === selectedSubject;
    const matchesType = selectedType === 'all' || doc.type === selectedType;
    return matchesSearch && matchesSubject && matchesType;
  });

  // ... (getFileIcon, handleDownload giữ nguyên)
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-8 h-8 text-black fill-black" fill="gray" stroke="black" />;
      case 'doc':
        return <File className="w-8 h-8 text-black fill-black" fill="gray" stroke="black" />;
      case 'video':
        return <Video className="w-8 h-8 text-black fill-black" fill="black" stroke="black" />;
      case 'archive':
        return <FileArchive className="w-8 h-8 text-black fill-black" fill="gray" stroke="black" />;
      default:
        return <File className="w-8 h-8 text-black fill-black" fill="gray" stroke="black" />;
    }
  };

  const handleDownload = (doc: Document) => {
    toast.success("Bắt đầu tải xuống", {
      description: `"${doc.title}" đang được tải xuống...`,
    });
  };

  const handleView = (doc: Document) => {
    setRecentlyViewedIds(prevIds => {
      const filteredIds = prevIds.filter(id => id !== doc.id);
      return [doc.id, ...filteredIds].slice(0, 3);
    });

    toast.info('Đang mở tài liệu', {
      description: `Đang mở "${doc.title}" trong trình xem...`,
    });
  };

  const recentlyViewed = useMemo(() => {
    return recentlyViewedIds
      .map(id => documents.find(doc => doc.id === id))
      .filter((doc): doc is Document => doc !== undefined);
  }, [recentlyViewedIds, documents]);

  // BỎ: const popular = [...documents].sort((a, b) => b.downloads - a.downloads).slice(0, 4);
  // THAY BẰNG: (hoặc không cần nếu bạn không hiển thị "Phổ biến nhất" ở tab riêng nữa)
  const popular = useMemo(() => {
      return [...documents].sort((a, b) => b.downloads - a.downloads).slice(0, 4);
  }, [documents]);


  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-[#138FE0] to-[#0A4E7A] text-white rounded-lg p-6">
        <h2 className="text-2xl mb-2">Thư Viện Tài Liệu</h2>
        <p className="text-white-100">
          Truy cập tài liệu học tập, bài giảng và nguồn tài nguyên học tập
        </p>
      </div>
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* ... (Giữ nguyên các Card thống kê) ... */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Tổng Tài Liệu</p>
                <p className="text-2xl mt-1">{documents.length}</p>
              </div>
              <BookOpen className="h-10 w-10 text-[#0000]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Tài Liệu PDF</p>
                <p className="text-2xl mt-1">
                  {documents.filter((d) => d.type === "pdf").length}
                </p>
              </div>
              <FileText className="w-8 h-8 text-black fill-black" fill="gray" stroke="black" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Bài Giảng Video</p>
                <p className="text-2xl mt-1">
                  {documents.filter((d) => d.type === "video").length}
                </p>
              </div>
              <Video className="w-8 h-8 text-black fill-black" fill="black" stroke="black" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Đã Tải Xuống</p>
                <p className="text-2xl mt-1">12</p>
              </div>
              <Download className="w-8 h-8 text-black fill-black" fill="white" stroke="black" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recently Viewed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-[#1488D8]" />
            Đã Xem Gần Đây
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentlyViewed.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentlyViewed.map((doc) => (
                <div
                  key={doc.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-[#1488D8] transition-colors cursor-pointer"
                  onClick={() => handleView(doc)}
                >
                  <div className="flex items-start gap-3">
                    {getFileIcon(doc.type)}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm text-gray-900 truncate">{doc.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">{doc.author}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-4 text-gray-500">
              Bạn chưa xem tài liệu nào gần đây.
            </div>
          )}
        </CardContent>
      </Card>

      {/* THAY THẾ TOÀN BỘ <Tabs> cũ bằng KHU VỰC TÌM KIẾM MỚI */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">Tìm kiếm tài liệu</h3>
        
        {/* CONTAINER CHỨA THANH TÌM KIẾM VÀ FILTER (Theo ảnh) */}
        <div className="border border-gray-200 rounded-lg p-3 flex flex-col md:flex-row items-stretch gap-2 bg-white shadow-sm">
          
          {/* Ô TÌM KIẾM CHÍNH */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm theo tên tài liệu hoặc môn học"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 border-none bg-gray-100 focus-visible:ring-0"
            />
          </div>

          {/* CONTAINER LỌC (SELECTS) - Sử dụng Select Trigger làm nút Filter */}
          <div className="flex flex-row gap-2">
            
            {/* Filter Môn học (Tất cả khoa) */}
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-full md:w-auto h-11 border-gray-300">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Tất cả khoa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất Cả Môn Học</SelectItem>
                <SelectItem value="Data Structures">
                  Cấu Trúc Dữ Liệu
                </SelectItem>
                <SelectItem value="Algorithms">Giải Thuật</SelectItem>
                <SelectItem value="Database Systems">Cơ Sở Dữ Liệu</SelectItem>
                <SelectItem value="Machine Learning">Học Máy</SelectItem>
                <SelectItem value="Software Engineering">
                  Kỹ Thuật Phần Mềm
                </SelectItem>
                <SelectItem value="Programming">Lập Trình</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Filter Loại */}
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full md:w-auto h-11 border-gray-300">
                <SelectValue placeholder="Loại" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất Cả Loại</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="doc">Tài Liệu</SelectItem>
                <SelectItem value="archive">Nén</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {/* HIỂN THỊ KẾT QUẢ TÌM KIẾM (thay cho TabsContent "all") */}
      <div className="space-y-4 pt-4">
          <h3 className="text-xl font-semibold text-gray-900">Kết Quả ({filteredDocuments.length} tài liệu)</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredDocuments.map((doc) => (
              <DocumentCard
                key={doc.id}
                doc={doc}
                onDownload={handleDownload}
                onView={handleView}
              />
            ))}
          </div>
          {filteredDocuments.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Không tìm thấy tài liệu phù hợp</p>
              </CardContent>
            </Card>
          )}
      </div>
        <Tabs>
        <TabsContent value="popular" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {popular.map((doc) => (
              <DocumentCard
                key={doc.id}
                doc={doc}
                onDownload={handleDownload}
                onView={handleView}
              />
            ))}
          </div>
        </TabsContent>
  </Tabs>
    </div>
  );
}

// ... (Component DocumentCard giữ nguyên)
// ... (Bạn có thể cập nhật lại DocumentCard với code trong câu trả lời trước để đảm bảo icon có màu sắc đẹp hơn)
function DocumentCard({
  doc,
  onDownload,
  onView,
}: {
  doc: Document;
  onDownload: (doc: Document) => void;
  onView: (doc: Document) => void;
}) {
  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-12 w-12 text-red-500" />;
      case "doc":
        return <File className="h-12 w-12 text-blue-500" />;
      case "video":
        return <Video className="h-12 w-12 text-purple-500" />;
      case "archive":
        return <FileArchive className="h-12 w-12 text-orange-500" />;
      default:
        return <File className="h-12 w-12 text-gray-500" />;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex gap-4">
          <div className="flex-shrink-0">{getFileIcon(doc.type)}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="text-gray-900 line-clamp-2">{doc.title}</h3>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm text-gray-600">{doc.rating}</span>
              </div>
            </div>
</div>
</div>
            <div className="space-y-2 mb-3">
              <p className="text-sm text-gray-600 line-clamp-2">
                {doc.description}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>{doc.author}</span>
                <span>•</span>
                <span>{new Date(doc.uploadDate).toLocaleDateString()}</span>
              </div>
            </div>

                        <div className="space-y-2 mb-3">
                            <p className="text-sm text-gray-600 line-clamp-2">{doc.description}</p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span>{doc.author}</span>
                                <span>•</span>
                                <span>{new Date(doc.uploadDate).toLocaleDateString()}</span>
                            </div>
                        </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>{doc.fileSize}</span>
                <span className="flex items-center gap-1">
                  <Download className="h-3 w-3" />
                  {doc.downloads}
                </span>
              </div>
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Xem
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{doc.title}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div className="flex items-center gap-4">
                        {getFileIcon(doc.type)}
                        <div>
                          <p className="text-sm text-gray-900">
                            Tác giả: {doc.author}
                          </p>
                          <p className="text-xs text-gray-500">
                            Tải lên:{" "}
                            {new Date(doc.uploadDate).toLocaleDateString(
                              "vi-VN"
                            )}
                          </p>
                          <p className="text-xs text-gray-500">
                            Kích thước: {doc.fileSize}
                          </p>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm text-gray-900 mb-2">Mô Tả</h4>
                        <p className="text-sm text-gray-600">
                          {doc.description}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm text-gray-900 mb-2">Thẻ</h4>
                        <div className="flex flex-wrap gap-2">
                          {doc.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 pt-4 border-t">
                        <Button
                          className="flex-1 bg-[#1488D8] hover:bg-[#1488D8]/90"
                          onClick={() => onDownload(doc)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Tải Xuống
                        </Button>
                        {doc.type === "pdf" && (
                          <Button
                            className="flex-1"
                            variant="outline"
                            onClick={() => onView(doc)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Xem Trước
                          </Button>
                        )}
                      </div>
                    </div>
                      </DialogContent>
                </Dialog>
              </div>
                </div>
            </CardContent>
        </Card>
    );
}