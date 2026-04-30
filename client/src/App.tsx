import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import DashboardLayout from "./components/DashboardLayout";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import { useAuth } from "./_core/hooks/useAuth";
import { Loader2 } from "lucide-react";
import LoginPage from "./pages/LoginPage";
import DashboardHub from "./pages/DashboardHub";
import ApplicationPortal from "./pages/ApplicationPortal";
import AssessmentModule from "./pages/AssessmentModule";
import LearningPage from "./pages/LearningPage";
import ProfilePage from "./pages/ProfilePage";
import TasksPage from "./pages/TasksPage";
import PaymentsPage from "./pages/PaymentsPage";
import AdminPanel from "./pages/AdminPanel";
import PortfolioAnalyzer from "./pages/PortfolioAnalyzer";

function AppRoute({
  component: Component,
  requiredRole,
}: {
  component: React.ComponentType<any>;
  requiredRole?: string;
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display:         "flex",
          alignItems:      "center",
          justifyContent:  "center",
          minHeight:       "100vh",
          backgroundColor: "#0A0A0A",
        }}
      >
        <Loader2
          style={{ width: "24px", height: "24px", color: "#D4AF37" }}
          className="animate-spin"
        />
      </div>
    );
  }

  if (!user) return <LoginPage />;

  if (requiredRole && user.role !== requiredRole) return <NotFound />;

  return (
    <DashboardLayout>
      <Component />
    </DashboardLayout>
  );
}

function Router() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display:         "flex",
          alignItems:      "center",
          justifyContent:  "center",
          minHeight:       "100vh",
          backgroundColor: "#0A0A0A",
        }}
      >
        <Loader2
          style={{ width: "24px", height: "24px", color: "#D4AF37" }}
          className="animate-spin"
        />
      </div>
    );
  }

  return (
    <Switch>
      {/* Public */}
      <Route path="/" component={Home} />
      <Route path="/login" component={LoginPage} />

      {/* Authenticated app routes */}
      <Route path="/dashboard"  component={() => <AppRoute component={DashboardHub} />} />
      <Route path="/apply"      component={() => <AppRoute component={ApplicationPortal} />} />
      <Route path="/assessment" component={() => <AppRoute component={AssessmentModule} />} />
      <Route path="/portfolio"  component={() => <AppRoute component={PortfolioAnalyzer} />} />
      <Route path="/learning"   component={() => <AppRoute component={LearningPage} />} />
      <Route path="/profile"    component={() => <AppRoute component={ProfilePage} />} />
      <Route path="/tasks"      component={() => <AppRoute component={TasksPage} />} />
      <Route path="/payments"   component={() => <AppRoute component={PaymentsPage} />} />
      <Route path="/admin"      component={() => <AppRoute component={AdminPanel} requiredRole="admin" />} />

      {/* 404 */}
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
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
