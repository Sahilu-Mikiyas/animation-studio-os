import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Loader2, Zap, Award, TrendingUp, BookOpen, CheckCircle, Clock, AlertCircle } from "lucide-react";

export default function DashboardHub() {
  const { user } = useAuth();
  const { data: profile, isLoading: profileLoading } = trpc.profile.get.useQuery();
  const { data: tasks } = trpc.tasks.list.useQuery();
  const { data: notifications } = trpc.notifications.list.useQuery({ unreadOnly: true });

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-gradient">Animation Studio OS</div>
          <div className="flex items-center gap-4">
            <Link href="/profile">
              <Button variant="ghost">Profile</Button>
            </Link>
            <Link href="/tasks">
              <Button variant="ghost">Tasks</Button>
            </Link>
            <Link href="/learning">
              <Button variant="ghost">Learning</Button>
            </Link>
            {user?.role === "admin" && (
              <Link href="/admin">
                <Button variant="ghost">Admin</Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      <div className="container py-12 space-y-12">
        {/* Welcome Section */}
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-foreground">
            Welcome back, <span className="text-gradient">{user?.name}</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            {user?.role === "admin" ? "Manage your studio and team" : "Continue your animation journey"}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="bg-card border-border p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">Level</h3>
              <Award className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">L{profile?.level || 1}</p>
            <p className="text-xs text-muted-foreground">{profile?.xp || 0} XP</p>
          </Card>

          <Card className="bg-card border-border p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">Active Tasks</h3>
              <CheckCircle className="w-5 h-5 text-secondary" />
            </div>
            <p className="text-3xl font-bold text-foreground">{tasks?.length || 0}</p>
            <p className="text-xs text-muted-foreground">Assigned to you</p>
          </Card>

          <Card className="bg-card border-border p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">Earnings</h3>
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
            <p className="text-3xl font-bold text-foreground">${profile?.salary || "0"}</p>
            <p className="text-xs text-muted-foreground">Current salary</p>
          </Card>

          <Card className="bg-card border-border p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">Notifications</h3>
              {notifications && notifications.length > 0 && (
                <span className="inline-flex items-center gap-2 px-2 py-1 rounded bg-primary/10 text-primary text-xs text-xs">{notifications.length}</span>
              )}
              <AlertCircle className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-3xl font-bold text-foreground">{notifications?.length || 0}</p>
            <p className="text-xs text-muted-foreground">Unread</p>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Tasks & Learning */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Tasks */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Your Tasks</h2>
                <Link href="/tasks">
                  <Button variant="ghost" size="sm">View All</Button>
                </Link>
              </div>
              <div className="space-y-3">
                {tasks && tasks.length > 0 ? (
                  tasks.slice(0, 3).map((task: any) => (
                    <Card key={task.id} className="bg-card border-border p-4 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                          <h3 className="font-semibold text-foreground">{task.title}</h3>
                          <p className="text-sm text-muted-foreground">{task.description}</p>
                        </div>
                        <div className="text-right space-y-1">
                          <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                            task.priority === "urgent" ? "bg-destructive/10 text-destructive" :
                            task.priority === "high" ? "bg-accent/10 text-accent" :
                            "bg-primary/10 text-primary"
                          }`}>
                            {task.priority}
                          </span>
                          {task.deadline && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(task.deadline).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <Card className="bg-card border-border p-8 text-center">
                    <p className="text-muted-foreground">No tasks assigned yet</p>
                  </Card>
                )}
              </div>
            </div>

            {/* Learning Path */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Learning Path</h2>
                <Link href="/learning">
                  <Button variant="ghost" size="sm">View All</Button>
                </Link>
              </div>
              <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-border p-8 text-center space-y-4">
                <BookOpen className="w-12 h-12 text-primary mx-auto" />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">Personalized Learning Modules</h3>
                  <p className="text-sm text-muted-foreground">
                    Complete interactive lessons tailored to your skill level
                  </p>
                </div>
                <Link href="/learning">
                  <Button className="w-full">Start Learning</Button>
                </Link>
              </Card>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            {/* Skill Level Badge */}
            <Card className="bg-card border-border p-6 text-center space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Current Level</p>
                <div className="text-5xl font-bold text-gradient">L{profile?.level || 1}</div>
              </div>
              <div className="space-y-2">
                <div className="w-full h-2 bg-input rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-secondary"
                    style={{ width: `${((profile?.xp || 0) % 1000) / 10}%` }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground">{profile?.xp || 0} / 1000 XP to next level</p>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-card border-border p-6 space-y-3">
              <h3 className="font-semibold text-foreground">Quick Actions</h3>
              <div className="space-y-2">
                <Link href="/assessment">
                  <Button variant="outline" className="w-full justify-start">
                    <Zap className="w-4 h-4 mr-2" />
                    Take Assessment
                  </Button>
                </Link>
                <Link href="/payments">
                  <Button variant="outline" className="w-full justify-start">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    View Earnings
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button variant="outline" className="w-full justify-start">
                    <Award className="w-4 h-4 mr-2" />
                    View Badges
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Notifications */}
            {notifications && notifications.length > 0 && (
              <Card className="bg-card border-border p-6 space-y-3">
                <h3 className="font-semibold text-foreground">Recent Notifications</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {notifications.slice(0, 3).map((notif: any) => (
                    <div key={notif.id} className="p-2 bg-input rounded text-sm">
                      <p className="font-medium text-foreground">{notif.title}</p>
                      <p className="text-xs text-muted-foreground">{notif.content}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
