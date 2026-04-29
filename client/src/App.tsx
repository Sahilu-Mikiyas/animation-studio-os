import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import { useAuth } from "./_core/hooks/useAuth";
import { Loader2 } from "lucide-react";
import LoginPage from "./pages/LoginPage";
import DashboardLayout from "./components/DashboardLayout";
import ApplicationPortal from "./pages/ApplicationPortal";
import AssessmentModule from "./pages/AssessmentModule";
import LearningPage from "./pages/LearningPage";
import ProfilePage from "./pages/ProfilePage";
import TasksPage from "./pages/TasksPage";
import PaymentsPage from "./pages/PaymentsPage";
import AdminPanel from "./pages/AdminPanel";

function ProtectedRoute({ component: Component, requiredRole }: { component: React.ComponentType<any>; requiredRole?: string }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <NotFound />;
  }

  return <Component />;
}

function Router() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={Home} />
      <Route path="/login" component={LoginPage} />

      {/* Protected routes - Applicant/Artist */}
      <Route path="/apply" component={() => <ProtectedRoute component={ApplicationPortal} />} />
      <Route path="/assessment" component={() => <ProtectedRoute component={AssessmentModule} />} />
      <Route path="/learning" component={() => <ProtectedRoute component={LearningPage} />} />
      <Route path="/profile" component={() => <ProtectedRoute component={ProfilePage} />} />
      <Route path="/tasks" component={() => <ProtectedRoute component={TasksPage} />} />
      <Route path="/payments" component={() => <ProtectedRoute component={PaymentsPage} />} />

      {/* Admin routes */}
      <Route path="/admin" component={() => <ProtectedRoute component={AdminPanel} requiredRole="admin" />} />

      {/* Dashboard - main hub for authenticated users */}
      <Route path="/dashboard" component={() => <ProtectedRoute component={DashboardLayout} />} />

      {/* 404 */}
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
