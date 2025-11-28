import { BarChart, Users, TrendingUp, Clock, Download } from "lucide-react";
import { User } from "../App";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  BarChart as RechartsBarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { toast } from "sonner";

type ReportsProps = {
  user: User;
};

export function Reports({ user }: ReportsProps) {
  const sessionsByFaculty = [
    { faculty: "Computer Science", sessions: 156, students: 45 },
    { faculty: "Electrical Eng", sessions: 98, students: 32 },
    { faculty: "Mechanical Eng", sessions: 76, students: 28 },
    { faculty: "Civil Eng", sessions: 54, students: 18 },
  ];

  const monthlyTrend = [
    { month: "Jun", sessions: 78, satisfaction: 4.5 },
    { month: "Jul", sessions: 92, satisfaction: 4.6 },
    { month: "Aug", sessions: 105, satisfaction: 4.7 },
    { month: "Sep", sessions: 118, satisfaction: 4.8 },
    { month: "Oct", sessions: 134, satisfaction: 4.9 },
  ];

  const sessionTypes = [
    { name: "Online", value: 245, color: "#1488D8" },
    { name: "In-person", value: 139, color: "#030391" },
  ];

  const topTutors = [
    { name: "Dr. Tran Van Minh", sessions: 156, rating: 4.9, students: 42 },
    {
      name: "PhD. Nguyen Thanh Long",
      sessions: 142,
      rating: 4.9,
      students: 38,
    },
    { name: "Dr. Hoang Van Khanh", sessions: 134, rating: 4.9, students: 35 },
    { name: "MSc. Le Thi Hoa", sessions: 98, rating: 4.8, students: 29 },
    { name: "Dr. Pham Minh Tuan", sessions: 87, rating: 4.7, students: 24 },
  ];

  const handleExportReport = () => {
    toast.success("Report exported", {
      description: "Your report has been downloaded successfully.",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl text-gray-900 mb-2">Reports & Analytics</h2>
          <p className="text-gray-500">
            Monitor program performance and track key metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="oct-2025">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="oct-2025">October 2025</SelectItem>
              <SelectItem value="sep-2025">September 2025</SelectItem>
              <SelectItem value="aug-2025">August 2025</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button
            className="bg-[#1488D8] hover:bg-[#1488D8]/90"
            onClick={handleExportReport}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Sessions</p>
                <p className="text-2xl mt-1">384</p>
              </div>
              <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
                <BarChart className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-xs text-green-600">+18% vs last month</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Students</p>
                <p className="text-2xl mt-1">123</p>
              </div>
              <div className="bg-green-100 text-green-600 p-3 rounded-lg">
                <Users className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-xs text-green-600">+12% vs last month</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Avg Satisfaction</p>
                <p className="text-2xl mt-1">4.8/5</p>
              </div>
              <div className="bg-yellow-100 text-yellow-600 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-xs text-green-600">+0.2 vs last month</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Hours</p>
                <p className="text-2xl mt-1">576</p>
              </div>
              <div className="bg-purple-100 text-purple-600 p-3 rounded-lg">
                <Clock className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-xs text-green-600">+24% vs last month</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sessions by Faculty</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsBarChart data={sessionsByFaculty}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="faculty" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sessions" fill="#1488D8" name="Sessions" />
                <Bar dataKey="students" fill="#030391" name="Students" />
              </RechartsBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Session Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sessionTypes}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {sessionTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Trend Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" domain={[0, 5]} />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="sessions"
                stroke="#1488D8"
                strokeWidth={2}
                name="Sessions"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="satisfaction"
                stroke="#030391"
                strokeWidth={2}
                name="Satisfaction"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Tutors */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Tutors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm text-gray-600">
                    Rank
                  </th>
                  <th className="text-left py-3 px-4 text-sm text-gray-600">
                    Tutor
                  </th>
                  <th className="text-left py-3 px-4 text-sm text-gray-600">
                    Sessions
                  </th>
                  <th className="text-left py-3 px-4 text-sm text-gray-600">
                    Students
                  </th>
                  <th className="text-left py-3 px-4 text-sm text-gray-600">
                    Rating
                  </th>
                </tr>
              </thead>
              <tbody>
                {topTutors.map((tutor, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-[#1488D8] text-white text-sm">
                        {index + 1}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-900">{tutor.name}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {tutor.sessions}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {tutor.students}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-yellow-600">
                        <span>{tutor.rating}</span>
                        <span className="text-gray-400">/5</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
