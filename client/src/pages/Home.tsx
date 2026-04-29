import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import { ArrowRight, Zap, Users, TrendingUp, Award, Lightbulb, Sparkles } from "lucide-react";

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-gradient">Animation Studio OS</div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                <Link href="/profile">
                  <Button variant="ghost">Profile</Button>
                </Link>
              </>
            ) : (
              <Button onClick={() => (window.location.href = getLoginUrl())}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }}></div>
        </div>

        <div className="container text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight">
              The Complete Animation
              <br />
              <span className="text-gradient">Studio Operating System</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Recruit talented animators, evaluate their skills, provide personalized training, and manage production—all in one platform.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            {!isAuthenticated ? (
              <>
                <Button
                  size="lg"
                  onClick={() => (window.location.href = getLoginUrl())}
                  className="h-12 px-8 text-lg"
                >
                  Apply Now <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-8 text-lg"
                >
                  Learn More
                </Button>
              </>
            ) : (
              <Link href="/dashboard">
                <Button size="lg" className="h-12 px-8 text-lg">
                  Go to Dashboard <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 bg-card/50">
        <div className="container space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">Platform Features</h2>
            <p className="text-xl text-muted-foreground">Everything you need to build a world-class animation team</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: "Talent Recruitment",
                description: "Streamlined application portal with portfolio review and skill assessment",
              },
              {
                icon: Zap,
                title: "Skill Evaluation",
                description: "Timed animation challenges with AI-powered scoring and detailed feedback",
              },
              {
                icon: TrendingUp,
                title: "Personalized Learning",
                description: "Adaptive learning paths tailored to each animator's skill level and goals",
              },
              {
                icon: Award,
                title: "Gamification",
                description: "Badges, levels, and career progression to motivate and recognize talent",
              },
              {
                icon: Lightbulb,
                title: "Production Management",
                description: "Task assignment, deadline tracking, and version control for all submissions",
              },
              {
                icon: Sparkles,
                title: "Analytics & Payments",
                description: "Comprehensive performance tracking and transparent earnings management",
              },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="card-elevated p-6 space-y-4 hover:shadow-xl transition-shadow">
                  <Icon className="w-8 h-8 text-primary" />
                  <h3 className="text-xl font-bold text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="container text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Ready to Join the Studio?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Whether you're an animator looking to grow your skills or a studio manager building a team, Animation Studio OS is your platform.
          </p>
          <Button
            size="lg"
            onClick={() => (window.location.href = getLoginUrl())}
            className="h-12 px-8 text-lg"
          >
            Get Started <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-12">
        <div className="container text-center text-muted-foreground">
          <p>&copy; 2026 Animation Studio OS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
