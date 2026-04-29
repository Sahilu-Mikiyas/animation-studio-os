import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Upload, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

type Step = "info" | "portfolio" | "motivation" | "review" | "success";

export default function ApplicationPortal() {
  const { user } = useAuth();
  const [step, setStep] = useState<Step>("info");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    full_name: user?.name || "",
    age: "",
    country: "",
    software_proficiency: [] as string[],
    discipline_interest: [] as string[],
    motivation_statement: "",
    portfolio_links: [] as string[],
    resume_url: "",
  });

  const [portfolioLink, setPortfolioLink] = useState("");
  const [softwareInput, setSoftwareInput] = useState("");
  const [disciplineInput, setDisciplineInput] = useState("");

  const createApplicationMutation = trpc.applications.create.useMutation({
    onSuccess: () => {
      setStep("success");
      toast.success("Application submitted successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to submit application");
      setIsSubmitting(false);
    },
  });

  const handleAddPortfolioLink = () => {
    if (portfolioLink.trim()) {
      setFormData({
        ...formData,
        portfolio_links: [...formData.portfolio_links, portfolioLink],
      });
      setPortfolioLink("");
    }
  };

  const handleRemovePortfolioLink = (index: number) => {
    setFormData({
      ...formData,
      portfolio_links: formData.portfolio_links.filter((_, i) => i !== index),
    });
  };

  const handleAddSoftware = () => {
    if (softwareInput.trim()) {
      setFormData({
        ...formData,
        software_proficiency: [...formData.software_proficiency, softwareInput],
      });
      setSoftwareInput("");
    }
  };

  const handleRemoveSoftware = (index: number) => {
    setFormData({
      ...formData,
      software_proficiency: formData.software_proficiency.filter((_, i) => i !== index),
    });
  };

  const handleAddDiscipline = () => {
    if (disciplineInput.trim()) {
      setFormData({
        ...formData,
        discipline_interest: [...formData.discipline_interest, disciplineInput],
      });
      setDisciplineInput("");
    }
  };

  const handleRemoveDiscipline = (index: number) => {
    setFormData({
      ...formData,
      discipline_interest: formData.discipline_interest.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await createApplicationMutation.mutateAsync({
        full_name: formData.full_name,
        age: formData.age ? parseInt(formData.age) : undefined,
        country: formData.country,
        software_proficiency: formData.software_proficiency,
        discipline_interest: formData.discipline_interest,
        motivation_statement: formData.motivation_statement,
        portfolio_links: formData.portfolio_links,
      });
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  const progressSteps = ["info", "portfolio", "motivation", "review", "success"] as const;
  const currentStepIndex = progressSteps.indexOf(step);
  const progress = ((currentStepIndex + 1) / progressSteps.length) * 100;

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Join Our Studio</h1>
          <p className="text-muted-foreground">Complete your application to become part of our creative team</p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Step {currentStepIndex + 1} of {progressSteps.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 bg-card rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Form Card */}
        <Card className="bg-card border-border p-8 space-y-6">
          {/* Personal Information Step */}
          {step === "info" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">Personal Information</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                  <Input
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="Your full name"
                    className="bg-input border-border"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Age</label>
                    <Input
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      placeholder="Your age"
                      className="bg-input border-border"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Country</label>
                    <Input
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      placeholder="Your country"
                      className="bg-input border-border"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Software Proficiency</label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={softwareInput}
                      onChange={(e) => setSoftwareInput(e.target.value)}
                      placeholder="e.g., Blender, Maya, After Effects"
                      className="bg-input border-border"
                      onKeyPress={(e) => e.key === "Enter" && handleAddSoftware()}
                    />
                    <Button onClick={handleAddSoftware} variant="outline">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.software_proficiency.map((software, idx) => (
                      <div
                        key={idx}
                        className="badge-primary flex items-center gap-2"
                      >
                        {software}
                        <button
                          onClick={() => handleRemoveSoftware(idx)}
                          className="text-xs hover:text-primary/80"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Animation Discipline Interest</label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={disciplineInput}
                      onChange={(e) => setDisciplineInput(e.target.value)}
                      placeholder="e.g., Character Animation, VFX, Rigging"
                      className="bg-input border-border"
                      onKeyPress={(e) => e.key === "Enter" && handleAddDiscipline()}
                    />
                    <Button onClick={handleAddDiscipline} variant="outline">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.discipline_interest.map((discipline, idx) => (
                      <div
                        key={idx}
                        className="badge-secondary flex items-center gap-2"
                      >
                        {discipline}
                        <button
                          onClick={() => handleRemoveDiscipline(idx)}
                          className="text-xs hover:text-secondary/80"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Button onClick={() => setStep("portfolio")} className="w-full">
                  Next: Portfolio
                </Button>
              </div>
            </div>
          )}

          {/* Portfolio Step */}
          {step === "portfolio" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">Portfolio & Resume</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Portfolio Links</label>
                  <p className="text-sm text-muted-foreground mb-3">Add links to your ArtStation, portfolio website, or other work samples</p>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={portfolioLink}
                      onChange={(e) => setPortfolioLink(e.target.value)}
                      placeholder="https://artstation.com/your-profile"
                      className="bg-input border-border"
                      onKeyPress={(e) => e.key === "Enter" && handleAddPortfolioLink()}
                    />
                    <Button onClick={handleAddPortfolioLink} variant="outline">
                      Add
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {formData.portfolio_links.map((link, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-input border border-border rounded-lg"
                      >
                        <a href={link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">
                          {link}
                        </a>
                        <button
                          onClick={() => handleRemovePortfolioLink(idx)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center space-y-2 hover:border-primary transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto" />
                  <p className="text-sm font-medium text-foreground">Upload Resume (PDF)</p>
                  <p className="text-xs text-muted-foreground">Drag and drop or click to select</p>
                </div>
              </div>

              <div className="flex justify-between gap-4 pt-4">
                <Button onClick={() => setStep("info")} variant="outline" className="w-full">
                  Back
                </Button>
                <Button onClick={() => setStep("motivation")} className="w-full">
                  Next: Motivation
                </Button>
              </div>
            </div>
          )}

          {/* Motivation Step */}
          {step === "motivation" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">Your Motivation</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Why do you want to join our studio?</label>
                  <Textarea
                    value={formData.motivation_statement}
                    onChange={(e) => setFormData({ ...formData, motivation_statement: e.target.value })}
                    placeholder="Tell us about your passion for animation, your goals, and why you'd be a great fit for our team..."
                    className="bg-input border-border min-h-40"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    {formData.motivation_statement.length}/500 characters
                  </p>
                </div>
              </div>

              <div className="flex justify-between gap-4 pt-4">
                <Button onClick={() => setStep("portfolio")} variant="outline" className="w-full">
                  Back
                </Button>
                <Button onClick={() => setStep("review")} className="w-full">
                  Next: Review
                </Button>
              </div>
            </div>
          )}

          {/* Review Step */}
          {step === "review" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">Review Your Application</h2>

              <div className="space-y-4 bg-input/50 p-4 rounded-lg">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Full Name</p>
                  <p className="text-foreground font-medium">{formData.full_name}</p>
                </div>
                {formData.age && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Age</p>
                    <p className="text-foreground font-medium">{formData.age}</p>
                  </div>
                )}
                {formData.country && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Country</p>
                    <p className="text-foreground font-medium">{formData.country}</p>
                  </div>
                )}
                {formData.software_proficiency.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Software</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {formData.software_proficiency.map((s, i) => (
                        <span key={i} className="badge-primary">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
                {formData.discipline_interest.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Disciplines</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {formData.discipline_interest.map((d, i) => (
                        <span key={i} className="badge-secondary">{d}</span>
                      ))}
                    </div>
                  </div>
                )}
                {formData.portfolio_links.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Portfolio Links</p>
                    <p className="text-foreground font-medium">{formData.portfolio_links.length} link(s)</p>
                  </div>
                )}
              </div>

              <div className="flex justify-between gap-4 pt-4">
                <Button onClick={() => setStep("motivation")} variant="outline" className="w-full">
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Success Step */}
          {step === "success" && (
            <div className="text-center space-y-6 py-8">
              <CheckCircle className="w-16 h-16 text-primary mx-auto" />
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">Application Submitted!</h2>
                <p className="text-muted-foreground">
                  Thank you for your application. Our team will review it and get back to you soon.
                </p>
              </div>
              <Button onClick={() => window.location.href = "/"} className="w-full">
                Return to Home
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
