"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  X,
  CheckCircle,
  AlertCircle,
  Target,
  TrendingUp,
  Award,
  BookOpen,
} from "lucide-react";
import API_BASE_URL from "@/lib/api-config";

interface MatchResult {
  success: boolean;
  timestamp: string;
  score?: number;
  [key: string]: any; // For flexible result structure
}

interface ResumeUploadProps {
  jobId?: string;
  onMatchComplete?: (results: MatchResult) => void;
}

interface MatchResults {
  success: boolean;
  timestamp: string;
  matching_results: {
    score: number;
    verdict: string;
    matched_skills: string[];
    missing_skills: string[];
    suggestions: string[];
    areas_for_improvement: string[];
    detailed_analysis: {
      strengths: string[];
      areas_for_improvement: string[];
      semantic_confidence: string;
      skill_categories_analysis: {
        [key: string]: {
          match_rate: number;
          matched_skills: string[];
          missing_skills: string[];
          total_required: number;
        };
      };
    };
    score_breakdown: {
      hard_match_score: number;
      semantic_score: number;
      final_score: number;
      weights_used: {
        semantic_weight: number;
        hard_match_weight: number;
      };
      calculation: string;
    };
  };
}

export default function ResumeUpload({
  jobId,
  onMatchComplete,
}: ResumeUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [matchResults, setMatchResults] = useState<MatchResults | null>(null);
  const [isMatching, setIsMatching] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    // Validate file type
    if (file.type !== "application/pdf") {
      setErrorMessage("Please upload a PDF file only");
      setUploadStatus("error");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage("File size must be less than 10MB");
      setUploadStatus("error");
      return;
    }

    setUploadedFile(file);
    setUploadStatus("idle");
    setErrorMessage("");
    setMatchResults(null);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!uploadedFile) return;

    setIsUploading(true);
    setUploadProgress(0);
    setUploadStatus("idle");
    setMatchResults(null);

    try {
      // Step 1: Upload resume
      const formData = new FormData();
      formData.append("resume_file", uploadedFile);

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 45) {
            clearInterval(progressInterval);
            return 45;
          }
          return prev + 5;
        });
      }, 200);

      const uploadResponse = await fetch(`${API_BASE_URL}/api/resume`, {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(50);

      if (!uploadResponse.ok) {
        throw new Error(`Resume upload failed: ${uploadResponse.statusText}`);
      }

      const uploadResult = await uploadResponse.json();

      // Step 2: Perform matching if jobId is provided
      if (jobId) {
        setIsMatching(true);
        setUploadProgress(75);

        const matchResponse = await fetch(`${API_BASE_URL}/api/match`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            job_id: parseInt(jobId),
          }),
        });

        setUploadProgress(90);

        if (!matchResponse.ok) {
          throw new Error(`Matching failed: ${matchResponse.statusText}`);
        }

        const matchData = await matchResponse.json();
        setMatchResults(matchData);
        setUploadProgress(100);

        onMatchComplete?.(matchData);
      } else {
        setUploadProgress(100);
      }

      setUploadStatus("success");
      setTimeout(() => {
        setUploadProgress(0);
      }, 1000);
    } catch (error) {
      setUploadStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploading(false);
      setIsMatching(false);
    }
  };

  const clearFile = () => {
    setUploadedFile(null);
    setUploadStatus("idle");
    setErrorMessage("");
    setUploadProgress(0);
    setMatchResults(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-yellow-100";
    return "bg-red-100";
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Upload Area */}
      <motion.div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50"
        } ${isUploading ? "pointer-events-none opacity-50" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {uploadedFile ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <FileText className="w-8 h-8 text-primary" />
              <div className="text-left">
                <p className="font-medium text-foreground">
                  {uploadedFile.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(uploadedFile.size)}
                </p>
              </div>
              {!isUploading && (
                <button
                  onClick={clearFile}
                  className="p-1 hover:bg-destructive/10 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                </button>
              )}
            </div>

            {(isUploading || isMatching) && (
              <div className="space-y-2">
                <div className="w-full bg-secondary rounded-full h-2">
                  <motion.div
                    className="bg-primary h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  {isMatching ? "Analyzing match..." : "Uploading..."}{" "}
                  {uploadProgress}%
                </p>
              </div>
            )}

            {uploadStatus === "success" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center space-x-2 text-green-600"
              >
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Upload successful!</span>
              </motion.div>
            )}

            {uploadStatus === "error" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center space-x-2 text-destructive"
              >
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">{errorMessage}</span>
              </motion.div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <motion.div
              animate={{ y: isDragging ? -5 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Upload
                className={`w-16 h-16 mx-auto ${
                  isDragging ? "text-primary" : "text-muted-foreground"
                }`}
              />
            </motion.div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Upload Your Resume
              </h3>
              <p className="text-muted-foreground mb-4">
                Drag and drop your resume here, or click to browse
              </p>
              <p className="text-sm text-muted-foreground">
                Supports PDF files (max 10MB)
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileInputChange}
              className="hidden"
            />

            <motion.button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Choose Resume File
            </motion.button>
          </div>
        )}
      </motion.div>

      {/* Upload Button */}
      {uploadedFile &&
        !isUploading &&
        !isMatching &&
        uploadStatus !== "success" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center"
          >
            <motion.button
              onClick={handleUpload}
              className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={!uploadedFile}
            >
              {jobId ? "Upload & Analyze Match" : "Upload Resume"}
            </motion.button>
          </motion.div>
        )}

      {/* Matching Results */}
      <AnimatePresence>
        {matchResults &&
          matchResults.success &&
          matchResults.matching_results && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Score Overview */}
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="text-center mb-6">
                  <div
                    className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${getScoreBgColor(
                      matchResults?.matching_results?.score || 0
                    )} mb-4`}
                  >
                    <span
                      className={`text-3xl font-bold ${getScoreColor(
                        matchResults?.matching_results?.score || 0
                      )}`}
                    >
                      {(matchResults?.matching_results?.score || 0).toFixed(1)}%
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {matchResults?.matching_results?.verdict ||
                      "No verdict available"}
                  </h3>
                  <p className="text-muted-foreground">
                    Match Score:{" "}
                    {(matchResults?.matching_results?.score || 0).toFixed(1)}%
                  </p>
                </div>

                {/* Score Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-secondary/50 rounded-lg">
                    <div className="text-2xl font-bold text-foreground">
                      {(
                        matchResults?.matching_results?.score_breakdown
                          ?.hard_match_score || 0
                      ).toFixed(1)}
                      %
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Hard Match
                    </div>
                  </div>
                  <div className="text-center p-4 bg-secondary/50 rounded-lg">
                    <div className="text-2xl font-bold text-foreground">
                      {(
                        matchResults?.matching_results?.score_breakdown
                          ?.semantic_score || 0
                      ).toFixed(1)}
                      %
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Semantic Match
                    </div>
                  </div>
                  <div className="text-center p-4 bg-secondary/50 rounded-lg">
                    <div className="text-2xl font-bold text-foreground">
                      {(
                        matchResults?.matching_results?.score_breakdown
                          ?.final_score || 0
                      ).toFixed(1)}
                      %
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Final Score
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills Analysis */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Matched Skills */}
                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <h4 className="text-lg font-semibold text-foreground">
                      Matched Skills
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(matchResults?.matching_results?.matched_skills || []).map(
                      (skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full"
                        >
                          {skill}
                        </span>
                      )
                    )}
                  </div>
                </div>

                {/* Missing Skills */}
                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                    <h4 className="text-lg font-semibold text-foreground">
                      Missing Skills
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(matchResults?.matching_results?.missing_skills || []).map(
                      (skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full"
                        >
                          {skill}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Suggestions */}
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <Target className="w-5 h-5 text-blue-600 mr-2" />
                  <h4 className="text-lg font-semibold text-foreground">
                    Suggestions
                  </h4>
                </div>
                <ul className="space-y-2">
                  {(matchResults?.matching_results?.suggestions || []).map(
                    (suggestion, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        <span className="text-foreground">{suggestion}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>

              {/* Skill Categories Analysis */}
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <TrendingUp className="w-5 h-5 text-purple-600 mr-2" />
                  <h4 className="text-lg font-semibold text-foreground">
                    Skill Categories Analysis
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(
                    matchResults?.matching_results?.detailed_analysis
                      ?.skill_categories_analysis || {}
                  ).map(([category, analysis]) => (
                    <div
                      key={category}
                      className="p-4 bg-secondary/50 rounded-lg"
                    >
                      <h5 className="font-medium text-foreground mb-2 capitalize">
                        {category.replace(/_/g, " ")}
                      </h5>
                      <div className="text-2xl font-bold text-foreground mb-1">
                        {analysis?.match_rate || 0}%
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        Match Rate
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {(analysis?.matched_skills || []).length}/
                        {analysis?.total_required || 0} skills
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strengths */}
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <Award className="w-5 h-5 text-green-600 mr-2" />
                  <h4 className="text-lg font-semibold text-foreground">
                    Strengths
                  </h4>
                </div>
                <ul className="space-y-2">
                  {(
                    matchResults?.matching_results?.detailed_analysis
                      ?.strengths || []
                  ).map((strength, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span className="text-foreground">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
      </AnimatePresence>

      {/* Error Message */}
      {errorMessage && uploadStatus === "error" && !uploadedFile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-destructive/5 border border-destructive/20 rounded-lg p-4"
        >
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-destructive" />
            <p className="text-sm text-destructive">{errorMessage}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
