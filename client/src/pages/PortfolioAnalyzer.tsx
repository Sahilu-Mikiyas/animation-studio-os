import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, Loader2, CheckCircle2, AlertCircle, TrendingUp } from "lucide-react";

interface AnalysisResult {
  overall_score: number;
  fluidity_score: number;
  timing_score: number;
  weight_score: number;
  anticipation_score: number;
  spacing_score: number;
  appeal_score: number;
  tags: string[];
  strengths: string;
  areas_for_improvement: string;
  detailed_feedback: string;
  percentile_rank: number;
  comparison_notes: string;
}

interface PortfolioFile {
  id: number;
  file_name: string;
  file_type: string;
  file_size: number;
  status: "uploaded" | "analyzing" | "analyzed" | "failed";
  title?: string;
  description?: string;
  createdAt: string;
}

export default function PortfolioAnalyzer() {
  const { user } = useAuth();
  const [files, setFiles] = useState<PortfolioFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<PortfolioFile | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadProgress(0);
    setIsAnalyzing(true);

    // Simulate file upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => Math.min(prev + 10, 90));
    }, 200);

    try {
      // In production, upload to cloud storage and get signed URL
      // For now, simulate with a data URL
      const fileUrl = URL.createObjectURL(file);
      const newFile: PortfolioFile = {
        id: Date.now(),
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        status: "analyzing",
        createdAt: new Date().toISOString(),
      };

      setFiles([newFile, ...files]);
      setSelectedFile(newFile);

      // Simulate LLM analysis
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockAnalysis: AnalysisResult = {
        overall_score: 82,
        fluidity_score: 85,
        timing_score: 80,
        weight_score: 78,
        anticipation_score: 88,
        spacing_score: 82,
        appeal_score: 79,
        tags: ["smooth", "dynamic", "character-driven", "polished"],
        strengths:
          "Excellent anticipation and weight distribution. The character movements feel natural and well-planned with smooth transitions between poses.",
        areas_for_improvement:
          "Consider adding more secondary motion to enhance appeal. Some spacing could be tightened for more snappy timing in action sequences.",
        detailed_feedback:
          "This is solid character animation work. The fundamentals are strong with good understanding of weight and timing. The anticipation is particularly well-executed. To elevate this further, focus on adding more personality through secondary motion and refining the spacing in key action moments.",
        percentile_rank: 78,
        comparison_notes:
          "This work ranks in the top 22% of submissions. Shows professional-level understanding of animation principles.",
      };

      setAnalysis(mockAnalysis);
      setUploadProgress(100);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      clearInterval(progressInterval);
      setIsAnalyzing(false);
    }
  };

  const ScoreCard = ({
    label,
    score,
  }: {
    label: string;
    score: number;
  }) => (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-foreground/70">{label}</span>
        <span className="font-mono font-semibold text-gold">{score}</span>
      </div>
      <Progress value={score} className="h-2" />
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Portfolio Analyzer</h1>
          <p className="text-foreground/60">
            Upload your animation files for AI-powered motion quality analysis
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-1">
            <Card className="p-6 border-border/50 bg-background/50 backdrop-blur">
              <h2 className="text-lg font-semibold mb-4">Upload Portfolio</h2>

              <div className="space-y-4">
                {/* Upload Area */}
                <label className="block">
                  <div className="border-2 border-dashed border-border/50 rounded-lg p-8 text-center cursor-pointer hover:border-gold/50 transition-colors">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-foreground/50" />
                    <p className="text-sm text-foreground/60">
                      Click to upload animation file
                    </p>
                    <p className="text-xs text-foreground/40 mt-1">
                      MP4, MOV, WebM up to 500MB
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileUpload}
                    disabled={isAnalyzing}
                    className="hidden"
                  />
                </label>

                {/* Upload Progress */}
                {isAnalyzing && uploadProgress > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-foreground/60">Analyzing...</span>
                      <span className="text-gold font-mono">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}

                {/* File List */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-foreground/70">
                    Uploaded Files
                  </h3>
                  {files.length === 0 ? (
                    <p className="text-xs text-foreground/40">No files yet</p>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {files.map((file) => (
                        <button
                          key={file.id}
                          onClick={() => setSelectedFile(file)}
                          className={`w-full text-left p-3 rounded border transition-colors ${
                            selectedFile?.id === file.id
                              ? "border-gold/50 bg-gold/5"
                              : "border-border/30 hover:border-border/50"
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            {file.status === "analyzed" && (
                              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            )}
                            {file.status === "analyzing" && (
                              <Loader2 className="w-4 h-4 text-gold animate-spin mt-0.5 flex-shrink-0" />
                            )}
                            {file.status === "failed" && (
                              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium truncate">
                                {file.file_name}
                              </p>
                              <p className="text-xs text-foreground/40">
                                {(file.file_size / 1024 / 1024).toFixed(1)} MB
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Analysis Results */}
          <div className="lg:col-span-2">
            {selectedFile && analysis ? (
              <div className="space-y-6">
                {/* Overall Score */}
                <Card className="p-6 border-border/50 bg-background/50 backdrop-blur">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-semibold mb-1">Motion Quality Score</h2>
                      <p className="text-sm text-foreground/60">
                        {selectedFile.file_name}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-5xl font-bold text-gold">
                        {analysis.overall_score}
                      </div>
                      <p className="text-xs text-foreground/40 mt-1">
                        Top {100 - analysis.percentile_rank}%
                      </p>
                    </div>
                  </div>

                  {/* Score Breakdown */}
                  <div className="grid grid-cols-2 gap-4">
                    <ScoreCard label="Fluidity" score={analysis.fluidity_score} />
                    <ScoreCard label="Timing" score={analysis.timing_score} />
                    <ScoreCard label="Weight" score={analysis.weight_score} />
                    <ScoreCard
                      label="Anticipation"
                      score={analysis.anticipation_score}
                    />
                    <ScoreCard label="Spacing" score={analysis.spacing_score} />
                    <ScoreCard label="Appeal" score={analysis.appeal_score} />
                  </div>
                </Card>

                {/* Tags */}
                <Card className="p-6 border-border/50 bg-background/50 backdrop-blur">
                  <h3 className="font-semibold mb-3">Motion Characteristics</h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="border-gold/30 text-gold bg-gold/5"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </Card>

                {/* Feedback */}
                <Card className="p-6 border-border/50 bg-background/50 backdrop-blur">
                  <h3 className="font-semibold mb-3">AI Analysis</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-green-500 mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Strengths
                      </h4>
                      <p className="text-sm text-foreground/70">
                        {analysis.strengths}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-amber-500 mb-2">
                        Areas for Improvement
                      </h4>
                      <p className="text-sm text-foreground/70">
                        {analysis.areas_for_improvement}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Detailed Feedback</h4>
                      <p className="text-sm text-foreground/70">
                        {analysis.detailed_feedback}
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Comparison */}
                <Card className="p-6 border-border/50 bg-background/50 backdrop-blur">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-gold mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">Industry Comparison</h4>
                      <p className="text-sm text-foreground/70">
                        {analysis.comparison_notes}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            ) : (
              <Card className="p-12 border-border/50 bg-background/50 backdrop-blur text-center">
                <p className="text-foreground/60">
                  Upload a file to see AI-powered motion quality analysis
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
