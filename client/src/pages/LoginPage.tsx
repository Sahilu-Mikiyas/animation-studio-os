import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Logo/Title */}
        <div className="space-y-2">
          <h1 className="text-5xl font-bold text-gradient">Animation Studio OS</h1>
          <p className="text-muted-foreground text-lg">Recruit. Train. Create. Evolve.</p>
        </div>

        {/* Description */}
        <div className="space-y-4 py-8">
          <p className="text-foreground/80">
            Join our creative community and unlock your potential as an animator.
          </p>
          <p className="text-sm text-muted-foreground">
            Sign in to access your dashboard, assessments, and learning paths.
          </p>
        </div>

        {/* Login Button */}
        <div className="pt-4">
          <Button
            onClick={() => (window.location.href = getLoginUrl())}
            className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Sign in with Manus
          </Button>
        </div>

        {/* Footer */}
        <div className="pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>

      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }}></div>
      </div>
    </div>
  );
}
