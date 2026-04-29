import { Button } from "@/components/ui/button";

export default function ApplicationPortal() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-4">Application Portal</h1>
        <p className="text-muted-foreground mb-8">Submit your application to join our animation studio.</p>
        <Button>Coming Soon</Button>
      </div>
    </div>
  );
}
