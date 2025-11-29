import { useState, useEffect } from "react";
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
import { AuthProvider, useAuth } from "./AuthContext";

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

function AppContent() {
  const { user, isAuthenticated, loading, login, logout } = useAuth();
  const [showHomepage, setShowHomepage] = useState(true);
  const [currentView, setCurrentView] = useState<string>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Handle login with API
  const handleLogin = async (email: string, role: UserRole) => {
    // For demo, use mock passwords
    setShowHomepage(false);
  };

  const handleLogout = async () => {
    await logout();
    setCurrentView("dashboard");
    setShowHomepage(true);
  };

  const handleNavigateToLogin = () => {
    setShowHomepage(false);
  };

  const renderContent = () => {
    if (!user) return null;

    switch (currentView) {
      case "dashboard":
        return <Dashboard user={user} />;
      case "tutors":
        return <TutorDirectory user={user} />;
      case "sessions":
        return <SessionManagement user={user} />;
      case "feedback":
        return <Feedback user={user} />;
      case "availability":
        return <TutorAvailability user={user} />;
      case "library":
        return <Library user={user} />;
      case "reports":
        return <Reports user={user} />;
      case "profile":
        return <Profile user={user} />;
      default:
        return <Dashboard user={user} />;
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (showHomepage) {
    return <Homepage onNavigateToLogin={handleNavigateToLogin} />;
  }

  if (!isAuthenticated || !user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        user={user}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        logoImage={logoImage}
        onLogout={handleLogout}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          user={user}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onLogout={handleLogout}
        />
        <main className="flex-1 overflow-y-auto">{renderContent()}</main>
      </div>
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
