import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { BookOpen, Play, CheckCircle, Lock, Loader2, Star } from "lucide-react";

const LEARNING_MODULES = [
  {
    id: 1,
    title: "Animation Fundamentals",
    description: "Master the 12 principles of animation",
    duration: "45 min",
    difficulty: "Beginner",
    lessons: 8,
    completed: true,
    progress: 100,
  },
  {
    id: 2,
    title: "Timing & Spacing",
    description: "Learn how to control motion through timing",
    duration: "60 min",
    difficulty: "Beginner",
    lessons: 6,
    completed: true,
    progress: 100,
  },
  {
    id: 3,
    title: "Character Movement",
    description: "Animate realistic character motion",
    duration: "90 min",
    difficulty: "Intermediate",
    lessons: 10,
    completed: false,
    progress: 65,
    unlocked: true,
  },
  {
    id: 4,
    title: "Advanced Rigging",
    description: "Create complex character rigs",
    duration: "120 min",
    difficulty: "Advanced",
    lessons: 12,
    completed: false,
    progress: 0,
    unlocked: false,
  },
  {
    id: 5,
    title: "VFX & Particles",
    description: "Master effects and particle systems",
    duration: "75 min",
    difficulty: "Advanced",
    lessons: 9,
    completed: false,
    progress: 0,
    unlocked: false,
  },
  {
    id: 6,
    title: "Motion Graphics",
    description: "Create dynamic motion graphics",
    duration: "60 min",
    difficulty: "Intermediate",
    lessons: 7,
    completed: false,
    progress: 40,
    unlocked: true,
  },
];

export default function LearningPage() {
  const { user } = useAuth();
  const [selectedModule, setSelectedModule] = useState<any>(null);
  const [showLessonDetail, setShowLessonDetail] = useState(false);

  const { data: modules, isLoading } = trpc.learning.getModules.useQuery({});

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const completedCount = LEARNING_MODULES.filter(m => m.completed).length;
  const totalXP = completedCount * 100;

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Learning Path</h1>
          <p className="text-muted-foreground">
            Master animation skills through interactive lessons and challenges
          </p>
        </div>

        {/* Progress Overview */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-card border-border p-6 space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Courses Completed</h3>
            <p className="text-3xl font-bold text-primary">{completedCount}/{LEARNING_MODULES.length}</p>
            <div className="w-full h-2 bg-input rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-secondary"
                style={{ width: `${(completedCount / LEARNING_MODULES.length) * 100}%` }}
              ></div>
            </div>
          </Card>

          <Card className="bg-card border-border p-6 space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Learning Streak</h3>
            <p className="text-3xl font-bold text-secondary">7 days</p>
            <p className="text-xs text-muted-foreground">Keep it up! 🔥</p>
          </Card>

          <Card className="bg-card border-border p-6 space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">XP Earned</h3>
            <p className="text-3xl font-bold text-accent">{totalXP}</p>
            <p className="text-xs text-muted-foreground">From completed courses</p>
          </Card>
        </div>

        {/* Learning Modules Grid */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Available Courses</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {LEARNING_MODULES.map((module) => (
              <Card
                key={module.id}
                className={`p-6 space-y-4 transition-all cursor-pointer hover:shadow-lg ${
                  module.unlocked ? "bg-card border-border" : "bg-input/50 border-border/50 opacity-75"
                }`}
                onClick={() => {
                  if (module.unlocked || module.completed) {
                    setSelectedModule(module);
                    setShowLessonDetail(true);
                  }
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-foreground">{module.title}</h3>
                      {module.completed && <CheckCircle className="w-5 h-5 text-primary" />}
                      {!module.unlocked && !module.completed && <Lock className="w-5 h-5 text-muted-foreground" />}
                    </div>
                    <p className="text-sm text-muted-foreground">{module.description}</p>
                  </div>
                  <div className="text-2xl">
                    {module.difficulty === "Beginner" ? "🟢" : module.difficulty === "Intermediate" ? "🟡" : "🔴"}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{module.lessons} lessons</span>
                  <span>•</span>
                  <span>{module.duration}</span>
                </div>

                {(module.unlocked || module.completed) && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium text-foreground">{module.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-input rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-secondary transition-all"
                        style={{ width: `${module.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <Button
                  className="w-full"
                  disabled={!module.unlocked && !module.completed}
                  variant={module.completed ? "outline" : "default"}
                >
                  {module.completed ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Completed
                    </>
                  ) : module.progress > 0 ? (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Continue
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Start Course
                    </>
                  )}
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Recommended Path */}
        <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/50 p-8 space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Recommended Next Steps</h2>
          <p className="text-muted-foreground">
            Based on your progress, we recommend completing "Character Movement" to unlock advanced rigging techniques.
          </p>
          <Button className="w-full">
            <Play className="w-4 h-4 mr-2" />
            Continue Character Movement
          </Button>
        </Card>

        {/* Lesson Detail Modal */}
        {showLessonDetail && selectedModule && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="bg-card border-border max-w-2xl w-full p-8 space-y-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-foreground">{selectedModule.title}</h2>
                  <p className="text-muted-foreground">{selectedModule.description}</p>
                </div>
                <button
                  onClick={() => setShowLessonDetail(false)}
                  className="text-muted-foreground hover:text-foreground text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Lessons in this course:</h3>
                <div className="space-y-2">
                  {Array.from({ length: selectedModule.lessons }).map((_, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 bg-input/50 rounded-lg hover:bg-input transition-colors cursor-pointer"
                    >
                      <div className="text-lg">
                        {idx < 3 ? "✓" : idx < 5 ? "▶" : "🔒"}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">Lesson {idx + 1}</p>
                        <p className="text-xs text-muted-foreground">15-20 minutes</p>
                      </div>
                      <Star className="w-4 h-4 text-accent" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <Button onClick={() => setShowLessonDetail(false)} variant="outline" className="flex-1">
                  Close
                </Button>
                <Button className="flex-1">
                  <Play className="w-4 h-4 mr-2" />
                  Start Course
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
