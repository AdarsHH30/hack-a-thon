"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  Sparkles,
  TrendingUp,
  AlertCircle,
  Brain,
  ArrowLeft,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MainLayout from "@/components/layouts/MainLayout";
import API_BASE_URL from "@/lib/api-config";

interface AnalysisResults {
  success: boolean;
  score: number;
  verdict: string;
  matched_skills: string[];
  missing_skills: string[];
  suggestions: string[];
  strengths: string[];
  concerns: string[];
  overall_assessment?: {
    match_score: number;
    suitability_level: string;
    key_findings: string[];
  };
  skill_analysis?: {
    matched_skills: string[];
    missing_critical_skills: string[];
    skill_gap_severity: string;
  };
  improvement_recommendations?: {
    immediate_actions: string[];
    skill_development: string[];
    resume_optimization: string[];
  };
}

export default function AnalyzePage() {
  const router = useRouter();
  const [jdText, setJdText] = useState("");
  const [jdFile, setJdFile] = useState<File | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [error, setError] = useState<string>("");
  const [cooldownTime, setCooldownTime] = useState(0);

  // Cooldown timer effect
  useEffect(() => {
    if (cooldownTime > 0) {
      const timer = setTimeout(() => {
        setCooldownTime(cooldownTime - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldownTime]);

  // Check cooldown on component mount (from localStorage)
  useEffect(() => {
    const lastTime = localStorage.getItem("lastAnalysisTime");
    if (lastTime) {
      const timePassed = Math.floor((Date.now() - parseInt(lastTime)) / 1000);
      const remainingCooldown = Math.max(0, 30 - timePassed); // 30 second cooldown
      if (remainingCooldown > 0) {
        setCooldownTime(remainingCooldown);
      }
    }
  }, []);

  const handleJdFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (1MB = 1048576 bytes)
      if (file.size > 1 * 1024 * 1024) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
        setError(
          `Job description file is too large (${sizeMB}MB). Maximum allowed size is 1MB. Please compress your PDF.`
        );
        return;
      }

      if (file.type === "application/pdf") {
        setJdFile(file);
        setJdText("");
        setError("");
        setResults(null); // Clear previous results
      } else {
        setError("Job description must be a PDF file");
      }
    }
  };

  const handleResumeFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (1MB = 1048576 bytes)
      if (file.size > 1 * 1024 * 1024) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
        setError(
          `Resume file is too large (${sizeMB}MB). Maximum allowed size is 1MB. Please compress your PDF.`
        );
        return;
      }

      if (file.type === "application/pdf") {
        setResumeFile(file);
        setError("");
        setResults(null); // Clear previous results
      } else {
        setError("Resume must be a PDF file");
      }
    }
  };

  const handleReset = () => {
    setJdText("");
    setJdFile(null);
    setResumeFile(null);
    setResults(null);
    setError("");
    console.log("🔄 Reset all inputs and results");
  };

  const handleAnalyze = async () => {
    setError("");
    setResults(null);

    // Check cooldown
    if (cooldownTime > 0) {
      setError(
        `Please wait ${cooldownTime} seconds before analyzing again. This prevents API rate limits.`
      );
      return;
    }

    // Validation
    if (!jdText && !jdFile) {
      setError("Please provide a job description (text or PDF)");
      return;
    }

    if (!resumeFile) {
      setError("Please upload a resume PDF");
      return;
    }

    setIsAnalyzing(true);

    try {
      let jdTextExtracted = jdText;
      let resumeTextExtracted = "";

      // Step 1: Extract text from JD PDF if provided
      if (jdFile) {
        console.log("Uploading JD PDF:", jdFile.name);
        const jdFormData = new FormData();
        jdFormData.append("jd_file", jdFile);

        const jdResponse = await fetch(`${API_BASE_URL}/api/job-description`, {
          method: "POST",
          body: jdFormData,
        });

        const jdData = await jdResponse.json();
        console.log("JD Response:", jdData);

        if (!jdResponse.ok) {
          throw new Error(
            jdData.detail || "Failed to process job description PDF"
          );
        }

        // Check if this triggered automatic matching (has ai_analysis_results)
        if (jdData.ai_analysis_results) {
          console.log("Auto-matching triggered by JD upload!");
          // Use the matching results directly
          setResults({
            success: jdData.success || true,
            score: jdData.score || 0,
            verdict: jdData.verdict || "Unknown",
            matched_skills: jdData.matched_skills || [],
            missing_skills: jdData.missing_skills || [],
            suggestions: jdData.suggestions || [],
            strengths: jdData.ai_analysis_results?.strengths || [],
            concerns: jdData.ai_analysis_results?.concerns || [],
            overall_assessment: jdData.ai_analysis_results?.overall_assessment,
            skill_analysis: jdData.ai_analysis_results?.skill_analysis,
            improvement_recommendations:
              jdData.ai_analysis_results?.improvement_recommendations,
          });
          setIsAnalyzing(false);
          return;
        }

        // Get text for manual analysis
        jdTextExtracted = jdData.text || jdData.raw_text || "";

        if (!jdTextExtracted.trim()) {
          throw new Error(
            "No text extracted from job description PDF. Please ensure the PDF contains readable text."
          );
        }
      }

      // Step 2: Extract text from Resume PDF
      console.log("Uploading Resume PDF:", resumeFile.name);
      const resumeFormData = new FormData();
      resumeFormData.append("resume_file", resumeFile);

      const resumeResponse = await fetch(`${API_BASE_URL}/api/resume`, {
        method: "POST",
        body: resumeFormData,
      });

      const resumeData = await resumeResponse.json();
      console.log("Resume Response:", resumeData);

      if (!resumeResponse.ok) {
        throw new Error(resumeData.detail || "Failed to process resume PDF");
      }

      // Check if this triggered automatic matching (has ai_analysis_results)
      if (resumeData.ai_analysis_results) {
        console.log("Auto-matching triggered by Resume upload!");
        // Use the matching results directly
        setResults({
          success: resumeData.success || true,
          score: resumeData.score || 0,
          verdict: resumeData.verdict || "Unknown",
          matched_skills: resumeData.matched_skills || [],
          missing_skills: resumeData.missing_skills || [],
          suggestions: resumeData.suggestions || [],
          strengths: resumeData.ai_analysis_results?.strengths || [],
          concerns: resumeData.ai_analysis_results?.concerns || [],
          overall_assessment:
            resumeData.ai_analysis_results?.overall_assessment,
          skill_analysis: resumeData.ai_analysis_results?.skill_analysis,
          improvement_recommendations:
            resumeData.ai_analysis_results?.improvement_recommendations,
        });
        setIsAnalyzing(false);
        return;
      }

      // Get text for manual analysis
      resumeTextExtracted = resumeData.text || resumeData.raw_text || "";

      if (!resumeTextExtracted.trim()) {
        throw new Error(
          "No text extracted from resume PDF. Please ensure:\n" +
            "• The PDF is not password-protected\n" +
            "• The PDF contains readable text (not just images)\n" +
            "• The file is a valid PDF document"
        );
      }

      console.log("Extracted JD text length:", jdTextExtracted.length);
      console.log("Extracted Resume text length:", resumeTextExtracted.length);

      // Step 3: Send extracted text to AI analysis endpoint
      console.log("Sending to AI analysis...");
      const analysisFormData = new FormData();
      analysisFormData.append("job_description_text", jdTextExtracted);
      analysisFormData.append("resume_text", resumeTextExtracted);

      const analysisResponse = await fetch(`${API_BASE_URL}/api/ai-analyze`, {
        method: "POST",
        body: analysisFormData,
      });

      const analysisData = await analysisResponse.json();
      console.log("Analysis Response:", analysisData);

      if (!analysisResponse.ok) {
        throw new Error(analysisData.detail || "Analysis failed");
      }

      // Map the response to our interface
      setResults({
        success: analysisData.success || true,
        score:
          analysisData.overall_assessment?.match_score ||
          analysisData.score ||
          0,
        verdict:
          analysisData.overall_assessment?.suitability_level ||
          analysisData.verdict ||
          "Unknown",
        matched_skills:
          analysisData.skill_analysis?.matched_skills ||
          analysisData.matched_skills ||
          [],
        missing_skills:
          analysisData.skill_analysis?.missing_critical_skills ||
          analysisData.missing_skills ||
          [],
        suggestions:
          analysisData.improvement_recommendations?.immediate_actions ||
          analysisData.suggestions ||
          [],
        strengths: analysisData.strengths || [],
        concerns: analysisData.concerns || [],
        overall_assessment: analysisData.overall_assessment,
        skill_analysis: analysisData.skill_analysis,
        improvement_recommendations: analysisData.improvement_recommendations,
      });

      // Set cooldown after successful analysis
      const currentTime = Date.now();
      localStorage.setItem("lastAnalysisTime", currentTime.toString());
      setCooldownTime(30); // 30 second cooldown
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Analysis failed. Please try again."
      );
      console.error("Analysis error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-green-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-white">
        {/* Logo - Top Left of Page */}
        <div className="px-4 sm:px-6 lg:px-8 pt-6 pb-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl blur-xl opacity-30"></div>
              <div className="relative bg-gradient-to-br from-red-600 to-red-700 p-3 rounded-2xl">
                <Brain className="w-8 h-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">TalentMatch</h1>
              <p className="text-sm text-red-600 font-medium">
                AI-Powered Hiring
              </p>
            </div>
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button and Reset */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6 flex items-center justify-between"
          >
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>

            {(jdFile || jdText || resumeFile || results) && (
              <Button
                variant="outline"
                onClick={handleReset}
                className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
              >
                <AlertCircle className="w-4 h-4" />
                New Analysis
              </Button>
            )}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Section - Upload */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="border-2 border-gray-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <FileText className="w-5 h-5 text-red-600" />
                      Job Description
                    </CardTitle>
                    <CardDescription>Paste text or upload PDF</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Tabs defaultValue="text" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="text">Text Input</TabsTrigger>
                        <TabsTrigger value="pdf">PDF Upload</TabsTrigger>
                      </TabsList>
                      <TabsContent value="text" className="space-y-2">
                        <textarea
                          className="w-full h-48 p-4 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none resize-none text-gray-900 placeholder-gray-400"
                          placeholder="Paste the job description here..."
                          value={jdText}
                          onChange={(e) => {
                            setJdText(e.target.value);
                            setJdFile(null);
                            setResults(null); // Clear previous results
                          }}
                          disabled={!!jdFile}
                        />
                      </TabsContent>
                      <TabsContent value="pdf" className="space-y-2">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-red-600 transition-colors">
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={handleJdFileChange}
                            className="hidden"
                            id="jd-upload"
                          />
                          <label htmlFor="jd-upload" className="cursor-pointer">
                            <Upload className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                            {jdFile ? (
                              <p className="text-sm text-gray-900 font-medium">
                                {jdFile.name}
                              </p>
                            ) : (
                              <>
                                <p className="text-sm text-gray-600 font-medium">
                                  Click to upload PDF
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  PDF files only (Max 1MB)
                                </p>
                              </>
                            )}
                          </label>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="border-2 border-gray-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <Upload className="w-5 h-5 text-red-600" />
                      Resume
                    </CardTitle>
                    <CardDescription>Upload PDF only</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-red-600 transition-colors">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleResumeFileChange}
                        className="hidden"
                        id="resume-upload"
                      />
                      <label htmlFor="resume-upload" className="cursor-pointer">
                        <Upload className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                        {resumeFile ? (
                          <p className="text-sm text-gray-900 font-medium">
                            {resumeFile.name}
                          </p>
                        ) : (
                          <>
                            <p className="text-sm text-gray-600 font-medium">
                              Click to upload PDF
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              PDF files only (Max 1MB)
                            </p>
                          </>
                        )}
                      </label>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-red-50 border-2 border-red-200 rounded-lg flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-red-800 whitespace-pre-line">
                    {error}
                  </div>
                </motion.div>
              )}

              <Button
                onClick={handleAnalyze}
                disabled={
                  isAnalyzing ||
                  (!jdText && !jdFile) ||
                  !resumeFile ||
                  cooldownTime > 0
                }
                className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Analyzing...
                  </span>
                ) : cooldownTime > 0 ? (
                  <span className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Wait {cooldownTime}s (Rate Limit)
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Analyze with AI
                  </span>
                )}
              </Button>

              {cooldownTime > 0 && (
                <p className="text-xs text-center text-gray-500 mt-2">
                  ⏱️ Rate limit protection: 30s cooldown between analyses
                </p>
              )}
            </div>

            {/* Right Section - Results */}
            <div className="space-y-6">
              <AnimatePresence mode="wait">
                {results ? (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                  >
                    {/* Score Circle */}
                    <Card className="border-2 border-gray-200 shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-gray-900">
                          Match Score
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-col items-center py-8">
                        <div className="relative w-48 h-48">
                          <svg
                            className="w-full h-full transform -rotate-90"
                            viewBox="0 0 200 200"
                          >
                            <circle
                              cx="100"
                              cy="100"
                              r="90"
                              stroke="#f3f4f6"
                              strokeWidth="12"
                              fill="none"
                            />
                            <motion.circle
                              cx="100"
                              cy="100"
                              r="90"
                              stroke="#dc2626"
                              strokeWidth="12"
                              fill="none"
                              strokeLinecap="round"
                              strokeDasharray={`${2 * Math.PI * 90}`}
                              initial={{ strokeDashoffset: 2 * Math.PI * 90 }}
                              animate={{
                                strokeDashoffset:
                                  2 * Math.PI * 90 * (1 - results.score / 100),
                              }}
                              transition={{ duration: 1.5, ease: "easeOut" }}
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <motion.span
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.5, duration: 0.5 }}
                              className={`text-6xl font-bold ${getScoreColor(
                                results.score
                              )}`}
                            >
                              {Math.round(results.score)}%
                            </motion.span>
                          </div>
                        </div>
                        <div className="mt-6 flex flex-col items-center gap-2">
                          <Badge
                            variant="outline"
                            className="text-base px-4 py-2 border-gray-300 text-gray-900"
                          >
                            {results.verdict}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Matched Skills */}
                    {results.matched_skills.length > 0 && (
                      <Card className="border-2 border-gray-200 shadow-sm">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-gray-900">
                            <TrendingUp className="w-5 h-5 text-green-600" />
                            Matched Skills
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {results.matched_skills
                              .slice(0, 10)
                              .map((skill, idx) => (
                                <Badge
                                  key={idx}
                                  className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200"
                                >
                                  {skill}
                                </Badge>
                              ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Missing Skills */}
                    {results.missing_skills.length > 0 && (
                      <Card className="border-2 border-red-200 shadow-sm bg-red-50">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-gray-900">
                            <AlertCircle className="w-5 h-5 text-red-600" />
                            Missing Critical Skills
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {results.missing_skills
                              .slice(0, 10)
                              .map((skill, idx) => (
                                <Badge
                                  key={idx}
                                  className="bg-red-200 text-red-900 hover:bg-red-300 border-red-300"
                                >
                                  {skill}
                                </Badge>
                              ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Recommendations */}
                    {results.suggestions.length > 0 && (
                      <Card className="border-2 border-gray-200 shadow-sm">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-gray-900">
                            <Sparkles className="w-5 h-5 text-red-600" />
                            AI Recommendations
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-3">
                            {results.suggestions.map((suggestion, idx) => (
                              <li key={idx} className="flex gap-3">
                                <span className="text-red-600 font-bold">
                                  •
                                </span>
                                <span className="text-sm text-gray-700">
                                  {suggestion}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}

                    {/* Strengths */}
                    {results.strengths.length > 0 && (
                      <Card className="border-2 border-green-200 shadow-sm bg-green-50">
                        <CardHeader>
                          <CardTitle className="text-gray-900">
                            Key Strengths
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {results.strengths.map((strength, idx) => (
                              <li key={idx} className="flex gap-3">
                                <span className="text-green-600 font-bold">
                                  ✓
                                </span>
                                <span className="text-sm text-gray-700">
                                  {strength}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center h-full"
                  >
                    <Card className="border-2 border-dashed border-gray-300 bg-gray-50 w-full">
                      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                        <Sparkles className="w-16 h-16 text-gray-400 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Ready to Analyze
                        </h3>
                        <p className="text-sm text-gray-600 max-w-sm">
                          Upload your documents and click &quot;Analyze with
                          AI&quot; to get comprehensive insights and
                          recommendations.
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
