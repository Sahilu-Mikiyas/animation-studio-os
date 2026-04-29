import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Eye, CheckCircle, XCircle, Clock, Loader2, MessageSquare } from "lucide-react";

type TabType = "applications" | "assessments" | "tasks" | "analytics";

export default function AdminPanel() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("applications");
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [showDetail, setShowDetail] = useState(false);

  const { data: applications, isLoading } = trpc.applications.list.useQuery({});
  const updateStatusMutation = trpc.applications.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Application status updated!");
      setShowDetail(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update status");
    },
  });

  if (user?.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="bg-card border-border p-8 text-center space-y-4">
          <p className="text-foreground font-medium">Access Denied</p>
          <p className="text-muted-foreground">You don't have permission to access the admin panel</p>
        </Card>
      </div>
    );
  }

  const handleStatusChange = async (applicationId: number, status: string) => {
    await updateStatusMutation.mutateAsync({
      applicationId,
      status: status as any,
    });
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
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage applicants, assessments, and studio operations</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="bg-card border-border p-6 space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Total Applications</h3>
            <p className="text-3xl font-bold text-primary">{applications?.length || 0}</p>
          </Card>
          <Card className="bg-card border-border p-6 space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Under Review</h3>
            <p className="text-3xl font-bold text-secondary">
              {applications?.filter((a: any) => a.status === "under_review").length || 0}
            </p>
          </Card>
          <Card className="bg-card border-border p-6 space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Shortlisted</h3>
            <p className="text-3xl font-bold text-accent">
              {applications?.filter((a: any) => a.status === "shortlisted").length || 0}
            </p>
          </Card>
          <Card className="bg-card border-border p-6 space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Hired</h3>
            <p className="text-3xl font-bold text-primary">
              {applications?.filter((a: any) => a.status === "hired").length || 0}
            </p>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-border">
          {["applications", "assessments", "tasks", "analytics"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as TabType)}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === tab
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Applications Tab */}
        {activeTab === "applications" && (
          <div className="space-y-4">
            <div className="space-y-3">
              {applications && applications.length > 0 ? (
                applications.map((app: any) => (
                  <Card key={app.id} className="bg-card border-border p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-foreground">{app.full_name}</h3>
                          <span className={`badge ${
                            app.status === "hired" ? "badge-primary" :
                            app.status === "shortlisted" ? "badge-secondary" :
                            app.status === "under_review" ? "badge-accent" :
                            "badge-warning"
                          }`}>
                            {app.status}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {app.discipline_interest?.join(", ") || "No disciplines specified"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Applied: {new Date(app.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => {
                            setSelectedApp(app);
                            setShowDetail(true);
                          }}
                          variant="outline"
                          size="sm"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Review
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="bg-card border-border p-8 text-center">
                  <p className="text-muted-foreground">No applications yet</p>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Assessments Tab */}
        {activeTab === "assessments" && (
          <Card className="bg-card border-border p-8 text-center">
            <p className="text-muted-foreground">Assessment management coming soon</p>
          </Card>
        )}

        {/* Tasks Tab */}
        {activeTab === "tasks" && (
          <Card className="bg-card border-border p-8 text-center">
            <p className="text-muted-foreground">Task assignment coming soon</p>
          </Card>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-card border-border p-6 space-y-4">
              <h3 className="font-semibold text-foreground">Application Funnel</h3>
              <div className="space-y-3">
                {[
                  { label: "Total Applications", count: applications?.length || 0, color: "primary" },
                  { label: "Under Review", count: applications?.filter((a: any) => a.status === "under_review").length || 0, color: "secondary" },
                  { label: "Shortlisted", count: applications?.filter((a: any) => a.status === "shortlisted").length || 0, color: "accent" },
                  { label: "Hired", count: applications?.filter((a: any) => a.status === "hired").length || 0, color: "primary" },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground">{item.label}</span>
                      <span className="font-medium">{item.count}</span>
                    </div>
                    <div className="w-full h-2 bg-input rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-${item.color}`}
                        style={{ width: `${(item.count / (applications?.length || 1)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="bg-card border-border p-6 space-y-4">
              <h3 className="font-semibold text-foreground">Key Metrics</h3>
              <div className="space-y-3">
                <div className="flex justify-between p-3 bg-input/50 rounded">
                  <span className="text-muted-foreground">Conversion Rate</span>
                  <span className="font-bold text-primary">
                    {applications?.length ? Math.round((applications.filter((a: any) => a.status === "hired").length / applications.length) * 100) : 0}%
                  </span>
                </div>
                <div className="flex justify-between p-3 bg-input/50 rounded">
                  <span className="text-muted-foreground">Avg Review Time</span>
                  <span className="font-bold text-secondary">2.5 days</span>
                </div>
                <div className="flex justify-between p-3 bg-input/50 rounded">
                  <span className="text-muted-foreground">Team Size</span>
                  <span className="font-bold text-accent">12 members</span>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Detail Modal */}
        {showDetail && selectedApp && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="bg-card border-border max-w-2xl w-full p-8 space-y-6 max-h-96 overflow-y-auto">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-foreground">{selectedApp.full_name}</h2>
                  <p className="text-muted-foreground">{selectedApp.country}</p>
                </div>
                <button
                  onClick={() => setShowDetail(false)}
                  className="text-muted-foreground hover:text-foreground text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                {selectedApp.motivation_statement && (
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Motivation</h3>
                    <p className="text-muted-foreground">{selectedApp.motivation_statement}</p>
                  </div>
                )}

                {selectedApp.portfolio_links?.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Portfolio</h3>
                    <div className="space-y-1">
                      {selectedApp.portfolio_links.map((link: string, idx: number) => (
                        <a
                          key={idx}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm block"
                        >
                          {link}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {selectedApp.software_proficiency?.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Software</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedApp.software_proficiency.map((software: string, idx: number) => (
                        <span key={idx} className="inline-flex items-center gap-2 px-2 py-1 rounded bg-primary/10 text-primary text-xs">{software}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3 border-t border-border pt-4">
                <p className="text-sm font-medium text-foreground">Update Status:</p>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => handleStatusChange(selectedApp.id, "shortlisted")}
                    variant="outline"
                    size="sm"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Shortlist
                  </Button>
                  <Button
                    onClick={() => handleStatusChange(selectedApp.id, "rejected")}
                    variant="outline"
                    size="sm"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    onClick={() => handleStatusChange(selectedApp.id, "hired")}
                    className="col-span-2"
                    size="sm"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Hire
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
