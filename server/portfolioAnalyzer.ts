import { invokeLLM } from "./_core/llm";

interface MotionMetrics {
  fluidity_score: number;
  timing_score: number;
  weight_score: number;
  anticipation_score: number;
  spacing_score: number;
  appeal_score: number;
}

interface AnalysisResult {
  overall_score: number;
  metrics: MotionMetrics;
  tags: string[];
  strengths: string;
  areas_for_improvement: string;
  detailed_feedback: string;
  percentile_rank: number;
  comparison_notes: string;
}

/**
 * Analyze animation portfolio file using LLM
 * Scores motion quality across multiple dimensions
 */
export async function analyzePortfolioFile(
  fileName: string,
  fileType: string,
  fileSize: number,
  fileUrl: string,
  fileDescription?: string
): Promise<AnalysisResult> {
  try {
    // Create detailed prompt for LLM analysis
    const analysisPrompt = `You are an expert animation director and motion quality analyst. Analyze this animation portfolio submission and provide detailed feedback.

File Details:
- Name: ${fileName}
- Type: ${fileType}
- Size: ${fileSize} bytes
- Description: ${fileDescription || "No description provided"}
- URL: ${fileUrl}

Analyze the motion quality across these dimensions (score 0-100 for each):
1. Fluidity - How smooth and continuous is the motion?
2. Timing - Are the timing and spacing of keyframes appropriate?
3. Weight - Does the movement feel like it has proper weight and mass?
4. Anticipation - Is there proper anticipation before major movements?
5. Spacing - Is the spacing between frames consistent and well-planned?
6. Appeal - Does the animation have visual appeal and appeal to the eye?

Provide your analysis in this exact JSON format:
{
  "overall_score": <0-100>,
  "fluidity_score": <0-100>,
  "timing_score": <0-100>,
  "weight_score": <0-100>,
  "anticipation_score": <0-100>,
  "spacing_score": <0-100>,
  "appeal_score": <0-100>,
  "tags": [<array of motion quality tags like "smooth", "dynamic", "character-driven", "technical", "creative", "polished", "experimental">],
  "strengths": "<2-3 sentences about what's good>",
  "areas_for_improvement": "<2-3 sentences about what needs work>",
  "detailed_feedback": "<4-5 sentences of constructive feedback>",
  "percentile_rank": <0-100 where this ranks among similar work>,
  "comparison_notes": "<1-2 sentences comparing to industry standards>"
}`;

    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "You are an expert animation director. Analyze motion quality and provide scores. Always respond with valid JSON."
        },
        {
          role: "user",
          content: analysisPrompt
        }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "animation_analysis",
          strict: true,
          schema: {
            type: "object",
            properties: {
              overall_score: { type: "number", description: "Overall quality score 0-100" },
              fluidity_score: { type: "number" },
              timing_score: { type: "number" },
              weight_score: { type: "number" },
              anticipation_score: { type: "number" },
              spacing_score: { type: "number" },
              appeal_score: { type: "number" },
              tags: { type: "array", items: { type: "string" } },
              strengths: { type: "string" },
              areas_for_improvement: { type: "string" },
              detailed_feedback: { type: "string" },
              percentile_rank: { type: "number" },
              comparison_notes: { type: "string" }
            },
            required: [
              "overall_score",
              "fluidity_score",
              "timing_score",
              "weight_score",
              "anticipation_score",
              "spacing_score",
              "appeal_score",
              "tags",
              "strengths",
              "areas_for_improvement",
              "detailed_feedback",
              "percentile_rank",
              "comparison_notes"
            ],
            additionalProperties: false
          }
        }
      }
    });

    // Parse the LLM response
    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from LLM");
    }

    const analysisData = typeof content === "string" ? JSON.parse(content) : content;

    // Validate and normalize scores
    const result: AnalysisResult = {
      overall_score: Math.min(100, Math.max(0, Math.round(analysisData.overall_score))),
      metrics: {
        fluidity_score: Math.min(100, Math.max(0, Math.round(analysisData.fluidity_score))),
        timing_score: Math.min(100, Math.max(0, Math.round(analysisData.timing_score))),
        weight_score: Math.min(100, Math.max(0, Math.round(analysisData.weight_score))),
        anticipation_score: Math.min(100, Math.max(0, Math.round(analysisData.anticipation_score))),
        spacing_score: Math.min(100, Math.max(0, Math.round(analysisData.spacing_score))),
        appeal_score: Math.min(100, Math.max(0, Math.round(analysisData.appeal_score))),
      },
      tags: Array.isArray(analysisData.tags) ? analysisData.tags.slice(0, 10) : [],
      strengths: String(analysisData.strengths || "").slice(0, 500),
      areas_for_improvement: String(analysisData.areas_for_improvement || "").slice(0, 500),
      detailed_feedback: String(analysisData.detailed_feedback || "").slice(0, 1000),
      percentile_rank: Math.min(100, Math.max(0, Math.round(analysisData.percentile_rank))),
      comparison_notes: String(analysisData.comparison_notes || "").slice(0, 300),
    };

    return result;
  } catch (error) {
    console.error("[PortfolioAnalyzer] Analysis failed:", error);
    throw error;
  }
}

/**
 * Calculate aggregate insights from multiple portfolio analyses
 */
export function calculatePortfolioInsights(analyses: any[]) {
  if (analyses.length === 0) {
    return {
      average_overall_score: 0,
      average_fluidity: 0,
      average_timing: 0,
      average_weight: 0,
      top_strengths: [],
      common_improvements: [],
      quality_trend: [],
    };
  }

  const scores = analyses.map(a => a.overall_score || 0);
  const fluidity = analyses.map(a => a.fluidity_score || 0);
  const timing = analyses.map(a => a.timing_score || 0);
  const weight = analyses.map(a => a.weight_score || 0);

  // Calculate averages
  const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;

  // Extract and count tags
  const allTags: Record<string, number> = {};
  analyses.forEach(a => {
    if (Array.isArray(a.tags)) {
      a.tags.forEach((tag: string) => {
        allTags[tag] = (allTags[tag] || 0) + 1;
      });
    }
  });

  const topStrengths = Object.entries(allTags)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tag]) => tag);

  return {
    average_overall_score: parseFloat(avg(scores).toFixed(2)),
    average_fluidity: parseFloat(avg(fluidity).toFixed(2)),
    average_timing: parseFloat(avg(timing).toFixed(2)),
    average_weight: parseFloat(avg(weight).toFixed(2)),
    top_strengths: topStrengths,
    common_improvements: [],
    quality_trend: [],
  };
}
