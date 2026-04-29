import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Award, Star, Zap, TrendingUp, Edit2, Loader2 } from "lucide-react";

const SKILL_TREE = [
  { id: 1, name: "Animation Basics", level: 1, unlocked: true },
  { id: 2, name: "Timing & Spacing", level: 2, unlocked: true },
  { id: 3, name: "Character Movement", level: 3, unlocked: true },
  { id: 4, name: "Advanced Rigging", level: 4, unlocked: false },
  { id: 5, name: "VFX Mastery", level: 4, unlocked: false },
  { id: 6, name: "Motion Graphics", level: 3, unlocked: true },
  { id: 7, name: "Facial Animation", level: 3, unlocked: false },
  { id: 8, name: "3D Modeling", level: 2, unlocked: true },
];

const BADGES = [
  { id: 1, name: "First Steps", icon: "🎬", description: "Complete your first assessment" },
  { id: 2, name: "Quick Learner", icon: "⚡", description: "Complete 5 learning modules" },
  { id: 3, name: "Perfect Score", icon: "💯", description: "Score 100% on an assessment" },
  { id: 4, name: "Consistency", icon: "📈", description: "Complete tasks for 7 days straight" },
  { id: 5, name: "Team Player", icon: "👥", description: "Collaborate on 10 projects" },
  { id: 6, name: "Master Animator", icon: "🏆", description: "Reach level 10" },
];

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || "",
    bio: "Passionate animator and creative professional",
  });

  const { data: profile, isLoading } = trpc.profile.get.useQuery();
  const { data: badges } = trpc.profile.getBadges.useQuery();
  const { data: analytics } = trpc.profile.getAnalytics.useQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold text-foreground">{user?.name}</h1>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant="outline"
              size="sm"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
          <p className="text-muted-foreground">
            {editData.bio}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="bg-card border-border p-6 space-y-3 text-center">
            <div className="text-4xl font-bold text-primary">{profile?.level || 1}</div>
            <p className="text-sm text-muted-foreground">Current Level</p>
          </Card>

          <Card className="bg-card border-border p-6 space-y-3 text-center">
            <div className="text-4xl font-bold text-secondary">{profile?.xp || 0}</div>
            <p className="text-sm text-muted-foreground">Total XP</p>
          </Card>

          <Card className="bg-card border-border p-6 space-y-3 text-center">
            <div className="text-4xl font-bold text-accent">{badges?.length || 0}</div>
            <p className="text-sm text-muted-foreground">Badges Earned</p>
          </Card>

          <Card className="bg-card border-border p-6 space-y-3 text-center">
            <div className="text-4xl font-bold text-primary">{analytics?.tasks_completed || 0}</div>
            <p className="text-sm text-muted-foreground">Tasks Done</p>
          </Card>
        </div>

        {/* XP Progress */}
        <Card className="bg-card border-border p-6 space-y-4">
          <h2 className="text-xl font-bold text-foreground">Level Progress</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Level {profile?.level || 1}</span>
              <span className="text-muted-foreground">{profile?.xp || 0} / 1000 XP</span>
            </div>
            <div className="w-full h-3 bg-input rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                style={{ width: `${((profile?.xp || 0) % 1000) / 10}%` }}
              ></div>
            </div>
          </div>
        </Card>

        {/* Skill Tree */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Skill Tree</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {SKILL_TREE.map((skill) => (
              <Card
                key={skill.id}
                className={`p-4 text-center space-y-2 transition-all ${
                  skill.unlocked
                    ? "bg-card border-border hover:shadow-lg"
                    : "bg-input/50 border-border/50 opacity-50"
                }`}
              >
                <div className="text-3xl">
                  {skill.unlocked ? "🔓" : "🔒"}
                </div>
                <h3 className="font-semibold text-foreground">{skill.name}</h3>
                <p className="text-xs text-muted-foreground">Level {skill.level}</p>
                {skill.unlocked && (
                  <div className="w-full h-1 bg-input rounded-full overflow-hidden mt-2">
                    <div
                      className="h-full bg-primary"
                      style={{ width: "75%" }}
                    ></div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Badges */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Achievements</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {BADGES.map((badge) => {
              const earned = badges?.some((b: any) => b.badge_id === badge.id);
              return (
                <Card
                  key={badge.id}
                  className={`p-6 text-center space-y-3 transition-all ${
                    earned
                      ? "bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/50"
                      : "bg-input/50 border-border/50 opacity-50"
                  }`}
                >
                  <div className="text-5xl">{badge.icon}</div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-foreground">{badge.name}</h3>
                    <p className="text-xs text-muted-foreground">{badge.description}</p>
                  </div>
                  {earned && (
                    <div className="text-xs text-primary font-medium">✓ Earned</div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>

        {/* Performance Stats */}
        <Card className="bg-card border-border p-6 space-y-6">
          <h2 className="text-xl font-bold text-foreground">Performance Stats</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Average Score
              </p>
              <p className="text-3xl font-bold text-primary">{analytics?.average_score || 0}%</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Improvement
              </p>
              <p className="text-3xl font-bold text-secondary">+{(analytics?.average_score as any) || 0}%</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Star className="w-4 h-4" />
                Rank
              </p>
              <p className="text-3xl font-bold text-accent">Top 10%</p>
            </div>
          </div>
        </Card>

        {/* Activity Timeline */}
        <Card className="bg-card border-border p-6 space-y-4">
          <h2 className="text-xl font-bold text-foreground">Recent Activity</h2>
          <div className="space-y-3">
            {[
              { date: "Today", activity: "Completed Walk Cycle assessment", icon: "✓" },
              { date: "Yesterday", activity: "Earned 'Quick Learner' badge", icon: "🏆" },
              { date: "2 days ago", activity: "Reached Level 5", icon: "⬆️" },
              { date: "3 days ago", activity: "Completed 5 learning modules", icon: "📚" },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4 pb-3 border-b border-border last:border-0">
                <div className="text-2xl">{item.icon}</div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{item.activity}</p>
                  <p className="text-xs text-muted-foreground">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
