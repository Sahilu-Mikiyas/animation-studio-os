import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Upload, Clock, CheckCircle, AlertCircle, Play, Pause, RotateCcw, Loader2 } from "lucide-react";

type AssessmentState = "list" | "instructions" | "active" | "submitted" | "results";

const ASSESSMENT_CHALLENGES = [
  {
    id: 1,
    title: "Bouncing Ball",
    description: "Create a bouncing ball animation demonstrating weight, gravity, and timing",
    duration: 30,
    difficulty: "Beginner",
    instructions: "Animate a sphere bouncing 3-4 times with decreasing height. Focus on proper easing and weight.",
  },
  {
    id: 2,
    title: "Walk Cycle",
    description: "Animate a character performing a natural walk cycle",
    duration: 60,
    difficulty: "Intermediate",
    instructions: "Create a smooth walk cycle for a humanoid character. Include proper weight shift and limb movement.",
  },
  {
    id: 3,
    title: "Facial Expression",
    description: "Demonstrate facial animation with emotion",
    duration: 45,
    difficulty: "Intermediate",
    instructions: "Animate a face transitioning between neutral, happy, and sad expressions with smooth transitions.",
  },
  {
    id: 4,
    title: "Complex Motion",
    description: "Advanced animation combining multiple elements",
    duration: 90,
    difficulty: "Advanced",
    instructions: "Create a complex scene combining character movement, object interaction, and camera work.",
  },
];

export default function AssessmentModule() {
  const { user } = useAuth();
  const [state, setState] = useState<AssessmentState>("list");
  const [selectedChallenge, setSelectedChallenge] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: assessments, isLoading } = trpc.assessments.list.useQuery();
  const submitMutation = trpc.assessments.submitAssessment.useMutation({
    onSuccess: () => {
      toast.success("Assessment submitted successfully!");
      setState("submitted");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to submit assessment");
      setIsSubmitting(false);
    },
  });

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            toast.error("Time's up!");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartChallenge = (challenge: any) => {
    setSelectedChallenge(challenge);
    setTimeLeft(challenge.duration * 60);
    setState("instructions");
  };

  const handleBeginTimer = () => {
    setIsRunning(true);
    setState("active");
  };

  const handleSubmitChallenge = async () => {
    setIsSubmitting(true);
    try {
      // In a real app, this would upload files
      await submitMutation.mutateAsync({
        assessmentId: selectedChallenge.id,
        video_url: "https://example.com/submission.mp4",
        project_file_url: "https://example.com/project.blend",
        file_type: "blend",
      });
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Skill Assessment</h1>
          <p className="text-muted-foreground">Complete animation challenges to demonstrate your skills</p>
        </div>

        {/* Assessment List View */}
        {state === "list" && (
          <div className="grid md:grid-cols-2 gap-6">
            {ASSESSMENT_CHALLENGES.map((challenge) => (
              <Card key={challenge.id} className="bg-card border-border p-6 space-y-4 hover:shadow-lg transition-shadow">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <h3 className="text-xl font-bold text-foreground">{challenge.title}</h3>
                    <span className={`badge ${
                      challenge.difficulty === "Beginner" ? "badge-primary" :
                      challenge.difficulty === "Intermediate" ? "badge-secondary" :
                      "badge-accent"
                    }`}>
                      {challenge.difficulty}
                    </span>
                  </div>
                  <p className="text-muted-foreground">{challenge.description}</p>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{challenge.duration} minutes</span>
                </div>

                <Button onClick={() => handleStartChallenge(challenge)} className="w-full">
                  Start Challenge
                </Button>
              </Card>
            ))}
          </div>
        )}

        {/* Instructions View */}
        {state === "instructions" && selectedChallenge && (
          <Card className="bg-card border-border p-8 space-y-6 max-w-2xl mx-auto">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-foreground">{selectedChallenge.title}</h2>
              <p className="text-lg text-muted-foreground">{selectedChallenge.description}</p>
            </div>

            <div className="bg-input/50 p-6 rounded-lg space-y-4">
              <h3 className="font-semibold text-foreground">Instructions</h3>
              <p className="text-foreground">{selectedChallenge.instructions}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-input/50 p-6 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Time Limit</p>
                <p className="text-2xl font-bold text-foreground">{selectedChallenge.duration} min</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Difficulty</p>
                <p className="text-2xl font-bold text-foreground">{selectedChallenge.difficulty}</p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                ⏱️ The timer will start when you begin. Make sure you have all your files ready before starting.
              </p>
              <div className="flex gap-4">
                <Button onClick={() => setState("list")} variant="outline" className="flex-1">
                  Back
                </Button>
                <Button onClick={handleBeginTimer} className="flex-1">
                  <Play className="w-4 h-4 mr-2" />
                  Start Challenge
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Active Challenge View */}
        {state === "active" && selectedChallenge && (
          <Card className="bg-card border-border p-8 space-y-6 max-w-4xl mx-auto">
            {/* Timer */}
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-foreground">{selectedChallenge.title}</h2>
              <div className={`text-6xl font-bold font-mono ${timeLeft < 300 ? "text-destructive" : "text-primary"}`}>
                {formatTime(timeLeft)}
              </div>
              <p className="text-sm text-muted-foreground">Time remaining</p>
            </div>

            {/* Challenge Area */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Challenge Instructions</h3>
              <div className="bg-input/50 p-6 rounded-lg">
                <p className="text-foreground">{selectedChallenge.instructions}</p>
              </div>
            </div>

            {/* File Upload Area */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Submit Your Work</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center space-y-2 hover:border-primary transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto" />
                  <p className="text-sm font-medium text-foreground">Upload Video</p>
                  <p className="text-xs text-muted-foreground">MP4, WebM (max 500MB)</p>
                </div>

                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center space-y-2 hover:border-primary transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto" />
                  <p className="text-sm font-medium text-foreground">Upload Project File</p>
                  <p className="text-xs text-muted-foreground">Blend, Maya, etc (max 1GB)</p>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-4 pt-4 border-t border-border">
              <Button
                onClick={() => setIsRunning(!isRunning)}
                variant="outline"
                className="flex-1"
              >
                {isRunning ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Resume
                  </>
                )}
              </Button>
              <Button
                onClick={() => {
                  setTimeLeft(selectedChallenge.duration * 60);
                  setIsRunning(false);
                }}
                variant="outline"
                className="flex-1"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button
                onClick={handleSubmitChallenge}
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Submit
                  </>
                )}
              </Button>
            </div>
          </Card>
        )}

        {/* Submitted View */}
        {state === "submitted" && (
          <Card className="bg-card border-border p-8 text-center space-y-6 max-w-2xl mx-auto">
            <CheckCircle className="w-16 h-16 text-primary mx-auto" />
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Assessment Submitted!</h2>
              <p className="text-muted-foreground">
                Your submission has been received. Our team will review it and provide feedback.
              </p>
            </div>
            <Button onClick={() => setState("list")} className="w-full">
              Back to Assessments
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
