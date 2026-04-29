import { Button } from "@/components/ui/button";

export default function AdminPanel() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-4">Admin Panel</h1>
        <p className="text-muted-foreground mb-8">Manage applicants, tasks, and studio analytics.</p>
        <Button>Coming Soon</Button>
      </div>
    </div>
  );
}
