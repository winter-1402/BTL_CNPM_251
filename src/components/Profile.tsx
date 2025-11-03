import { Mail, Phone, MapPin, Calendar, Edit, Book, Award, Briefcase, GraduationCap, BookOpen, Star } from 'lucide-react';
import { User } from '../App';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

type ProfileProps = {
  user: User;
};

export function Profile({ user }: ProfileProps) {
  // Render different profiles for tutors vs students
  if (user.role === 'tutor') {
    return <TutorProfile user={user} />;
  }
  
  return <StudentProfile user={user} />;
}

function StudentProfile({ user }: { user: User }) {
  const profileData = {
    ...user,
    phone: '+84 123 456 789',
    address: 'TP. Hồ Chí Minh, Việt Nam',
    joinDate: 'Tháng 9, 2023',
    bio: 'Sinh viên ngành Khoa học Máy tính, đam mê về thuật toán và học máy. Hiện đang thực hiện đề tài liên quan đến ứng dụng deep learning.',
    interests: ['Học máy', 'Thuật toán', 'Phát triển Web', 'Khoa học dữ liệu'],
    achievements: [
      'Top 10% lớp',
      'Danh sách Dean (3 học kỳ)',
      'Giải nhất Hackathon 2024',
    ],
  };

  const academicInfo = [
    { label: 'Khoa', value: user.faculty || 'Khoa Khoa học và Kỹ thuật Máy tính' },
    { label: 'Chuyên ngành', value: user.major || 'Công nghệ phần mềm' },
    { label: 'Năm học', value: 'Năm 4' },
    { label: 'GPA', value: '3.75/4.0' },
  ];

  const recentActivity = [
    { date: '20/10/2025', activity: 'Hoàn thành buổi học Học máy với TS. Nguyễn Thanh Long' },
    { date: '18/10/2025', activity: 'Tham gia chương trình học Hệ quản trị CSDL' },
    { date: '15/10/2025', activity: 'Nhận huy hiệu "Học viên xuất sắc"' },
    { date: '10/10/2025', activity: 'Hoàn thành buổi học thứ 20' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl text-gray-900">Hồ sơ cá nhân</h2>
        <Button className="bg-[#1488D8] hover:bg-[#1488D8]/90">
          <Edit className="h-4 w-4 mr-2" />
          Chỉnh sửa hồ sơ
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-32 w-32 mb-4">
                  <AvatarFallback className="bg-[#1488D8] text-white text-3xl">
                    {user.name.split(' ').map((n) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl text-gray-900 mb-1">{user.name}</h3>
                <Badge className="mb-4">Sinh viên</Badge>
                <p className="text-sm text-gray-600 mb-6">{profileData.bio}</p>

                <Separator className="my-4 w-full" />

                <div className="w-full space-y-3 text-left">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{profileData.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{profileData.address}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Tham gia {profileData.joinDate}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interests */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-base">Lĩnh vực quan tâm</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profileData.interests.map((interest, index) => (
                  <Badge key={index} variant="secondary">
                    {interest}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Academic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="h-5 w-5 text-[#1488D8]" />
                Thông tin học tập
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {academicInfo.map((info, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">{info.label}</p>
                    <p className="text-gray-900">{info.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-[#1488D8]" />
                Thành tích
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {profileData.achievements.map((achievement, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-700">
                    <div className="h-2 w-2 rounded-full bg-[#1488D8]" />
                    {achievement}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Hoạt động gần đây</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-24 text-sm text-gray-500">
                      {item.date}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">{item.activity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function TutorProfile({ user }: { user: User }) {
  const tutorData = {
    ...user,
    phone: '+84 987 654 321',
    address: 'TP. Hồ Chí Minh, Việt Nam',
    joinDate: 'Tháng 1, 2020',
    bio: 'Tiến sĩ chuyên ngành Khoa học Máy tính với hơn 10 năm kinh nghiệm giảng dạy. Đam mê nghiên cứu và chia sẻ kiến thức về cấu trúc dữ liệu, thuật toán và AI.',
    degree: 'Tiến sĩ Khoa học Máy tính',
    university: 'Đại học Bách Khoa TP.HCM',
    experience: '10 năm',
    expertise: ['Cấu trúc dữ liệu', 'Giải thuật', 'Học máy', 'AI', 'Lập trình C++'],
    totalStudents: 156,
    rating: 4.9,
    totalSessions: 324,
  };

  const projects = [
    {
      title: 'Hệ thống nhận diện khuôn mặt bằng Deep Learning',
      description: 'Phát triển hệ thống nhận diện khuôn mặt cho ứng dụng bảo mật',
      year: '2024',
    },
    {
      title: 'Thuật toán tối ưu cho bài toán định tuyến',
      description: 'Nghiên cứu và cải tiến thuật toán Dijkstra cho mạng lớn',
      year: '2023',
    },
    {
      title: 'Ứng dụng Machine Learning trong dự đoán thời tiết',
      description: 'Xây dựng mô hình ML để dự đoán thời tiết chính xác',
      year: '2022',
    },
  ];

  const education = [
    {
      degree: 'Tiến sĩ Khoa học Máy tính',
      school: 'Đại học Bách Khoa TP.HCM',
      year: '2015 - 2019',
      description: 'Luận án: Tối ưu hóa thuật toán trong hệ thống phân tán',
    },
    {
      degree: 'Thạc sĩ Công nghệ Thông tin',
      school: 'Đại học Bách Khoa TP.HCM',
      year: '2010 - 2012',
      description: 'Chuyên ngành: Trí tuệ nhân tạo',
    },
    {
      degree: 'Kỹ sư Khoa học Máy tính',
      school: 'Đại học Bách Khoa TP.HCM',
      year: '2005 - 2010',
      description: 'Tốt nghiệp loại Giỏi',
    },
  ];

  const workExperience = [
    {
      position: 'Giảng viên cao cấp',
      organization: 'Đại học Bách Khoa TP.HCM',
      period: '2019 - Hiện tại',
      description: 'Giảng dạy các môn Cấu trúc dữ liệu, Giải thuật, và Học máy',
    },
    {
      position: 'Nghiên cứu viên',
      organization: 'Phòng thí nghiệm AI, ĐHBK',
      period: '2015 - 2019',
      description: 'Nghiên cứu về thuật toán tối ưu và machine learning',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl text-gray-900">Hồ sơ gia sư</h2>
        <Button className="bg-[#1488D8] hover:bg-[#1488D8]/90">
          <Edit className="h-4 w-4 mr-2" />
          Chỉnh sửa hồ sơ
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-32 w-32 mb-4">
                  <AvatarFallback className="bg-[#1488D8] text-white text-3xl">
                    {user.name.split(' ').map((n) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl text-gray-900 mb-1">{user.name}</h3>
                <Badge className="mb-2 bg-purple-100 text-purple-700">Gia sư</Badge>
                <div className="flex items-center gap-1 mb-4">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <span className="text-lg">{tutorData.rating}</span>
                  <span className="text-sm text-gray-500">({tutorData.totalSessions} buổi học)</span>
                </div>
                <p className="text-sm text-gray-600 mb-6">{tutorData.bio}</p>

                <Separator className="my-4 w-full" />

                <div className="w-full space-y-3 text-left">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{tutorData.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{tutorData.address}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Tham gia {tutorData.joinDate}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-base">Thống kê</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Tổng học viên</p>
                <p className="text-2xl text-gray-900">{tutorData.totalStudents}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tổng buổi học</p>
                <p className="text-2xl text-gray-900">{tutorData.totalSessions}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Đánh giá trung bình</p>
                <p className="text-2xl text-gray-900">{tutorData.rating}/5.0</p>
              </div>
            </CardContent>
          </Card>

          {/* Expertise */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-base">Chuyên môn</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {tutorData.expertise.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-700">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="education" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="education">Học vấn</TabsTrigger>
              <TabsTrigger value="experience">Kinh nghiệm</TabsTrigger>
              <TabsTrigger value="projects">Dự án</TabsTrigger>
            </TabsList>

            <TabsContent value="education" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-[#1488D8]" />
                    Bằng cấp & Học vấn
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {education.map((edu, index) => (
                    <div key={index} className="border-l-2 border-[#1488D8] pl-4">
                      <h4 className="text-gray-900 mb-1">{edu.degree}</h4>
                      <p className="text-sm text-gray-600 mb-1">{edu.school}</p>
                      <p className="text-sm text-gray-500 mb-2">{edu.year}</p>
                      <p className="text-sm text-gray-700">{edu.description}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="experience" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-[#1488D8]" />
                    Kinh nghiệm làm việc
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {workExperience.map((work, index) => (
                    <div key={index} className="border-l-2 border-[#1488D8] pl-4">
                      <h4 className="text-gray-900 mb-1">{work.position}</h4>
                      <p className="text-sm text-gray-600 mb-1">{work.organization}</p>
                      <p className="text-sm text-gray-500 mb-2">{work.period}</p>
                      <p className="text-sm text-gray-700">{work.description}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Thông tin chuyên môn</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Khoa</p>
                      <p className="text-gray-900">{user.faculty || 'Khoa KHMT'}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Kinh nghiệm</p>
                      <p className="text-gray-900">{tutorData.experience}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Trường</p>
                      <p className="text-gray-900">{tutorData.university}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Bằng cấp cao nhất</p>
                      <p className="text-gray-900">{tutorData.degree}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-[#1488D8]" />
                    Dự án & Nghiên cứu
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {projects.map((project, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-gray-900">{project.title}</h4>
                        <Badge variant="outline">{project.year}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{project.description}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
