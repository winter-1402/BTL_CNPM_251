import { useState } from "react";
import { Dashboard } from "./components/Dashboard";
import { TutorDirectory } from "./components/TutorDirectory";
import { SessionManagement } from "./components/SessionManagement";
import { TutorAvailability } from "./components/TutorAvailability";
import { Library } from "./components/Library";
import { Feedback } from "./components/Feedback";
import { Reports } from "./components/Reports";
import { Profile } from "./components/Profile";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { LoginPage } from "./components/LoginPage";
import { Homepage } from "./components/Homepage";
import { Toaster } from "./components/ui/sonner";
import logoImage from "./assets/LogoBK.png";

export type UserRole = "student" | "tutor" | "coordinator" | "admin";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  studentId?: string;
  faculty?: string;
  major?: string;
  avatar?: string;
};

export type Session = {
  id: string;
  tutorId: string;
  tutorName: string;
  studentId: string;
  studentName: string;
  subject: string;
  type: "online" | "in-person";
  status: "scheduled" | "completed" | "cancelled";
  date: string;
  time: string;
  duration: number;
  location?: string;
  meetingLink?: string;
  notes?: string;
  rating?: number;
  feedback?: string;
};

export type Tutor = {
  id: string;
  name: string;
  email: string;
  faculty: string;
  expertise: string[];
  rating: number;
  totalSessions: number;
  availability: string[];
  avatar?: string;
  bio?: string;
};

function App() {
  const [showHomepage, setShowHomepage] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<string>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // User data based on role
  const getUserData = (email: string, role: UserRole): User => {
    const userData: Record<string, User> = {
      "an.nguyen@hcmut.edu.vn": {
        id: "1810123",
        name: "Nguyen Van An",
        email: "an.nguyen@hcmut.edu.vn",
        role: "student",
        studentId: "1810123",
        faculty: "Computer Science",
        major: "Software Engineering",
      },
      "minh.tran@hcmut.edu.vn": {
        id: "T001",
        name: "Dr. Tran Van Minh",
        email: "minh.tran@hcmut.edu.vn",
        role: "tutor",
        faculty: "Computer Science",
      },
      "admin@hcmut.edu.vn": {
        id: "A001",
        name: "System Administrator",
        email: "admin@hcmut.edu.vn",
        role: "admin",
        faculty: "Administration",
      },
    };

    return (
      userData[email] || {
        id: "1",
        name: "User",
        email: email,
        role: role,
      }
    );
  };

  const handleLogin = (email: string, role: UserRole) => {
    const user = getUserData(email, role);
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentView("dashboard");
    setShowHomepage(true);
  };

  const handleNavigateToLogin = () => {
    setShowHomepage(false);
  };

  const renderContent = () => {
    if (!currentUser) return null;

    switch (currentView) {
      case "dashboard":
        return <Dashboard user={currentUser} />;
      case "tutors":
        return <TutorDirectory user={currentUser} />;
      case "sessions":
        return <SessionManagement user={currentUser} />;
      case "feedback":
        return <Feedback user={currentUser} />;
      case "availability":
        return <TutorAvailability user={currentUser} />;
      case "library":
        return <Library user={currentUser} />;
      case "reports":
        return <Reports user={currentUser} />;
      case "profile":
        return <Profile user={currentUser} />;
      default:
        return <Dashboard user={currentUser} />;
    }
  };

  // Show homepage first
  if (showHomepage) {
    return <Homepage onNavigateToLogin={handleNavigateToLogin} />;
  }

  // Show login page if not authenticated
  if (!isAuthenticated || !currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        user={currentUser}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        logoImage={logoImage}
        onLogout={handleLogout}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          user={currentUser}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onLogout={handleLogout}
        />
        <main className="flex-1 overflow-y-auto">{renderContent()}</main>
      </div>
      <Toaster />
    </div>
  );
}

export default App;
