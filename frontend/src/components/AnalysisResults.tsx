"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ProcessStages {
  extraction?: string;
  cleaning?: string;
  ai_analysis?: string;
}

interface JobDescription {
  company?: string;
  position?: string;
  source_type?: string;
  text_length?: number;
}

interface Resume {
  filename?: string;
  text_length?: number;
}

interface InputInfo {
  job_description?: JobDescription;
  resume?: Resume;
}

interface AIAnalysisResults {
  overall_assessment?: {
    score?: number;
    match_score?: number;
    fit_analysis?: string;
    recommendation?: string;
    suitability_level?: string;
    confidence_level?: string;
    summary?: string;
  };
  skill_analysis?: {
    matching_skills?: string[];
    matched_skills?: string[];
    missing_critical_skills?: string[];
    transferable_skills?: string[];
    skill_gaps?: string[];
    technical_competency?: string;
  };
  experience_assessment?: {
    level_match?: string;
    domain_relevance?: string;
    growth_trajectory?: string;
  };
  experience_analysis?: {
    relevance?: string;
    level?: string;
    progression?: string;
    domain_fit?: string;
  };
  suggestions?: {
    immediate_improvements?: string[];
    long_term_development?: string[];
    interview_preparation?: string[];
  };
  improvement_recommendations?: {
    immediate_actions?: string[];
    skill_development?: string[];
    experience_building?: string[];
    resume_optimization?: string[];
  };
  strengths?: string[];
}

interface MatchResult {
  score: number;
  feedback?: string[];
  strengths?: string[];
  improvements?: string[];
  keywordMatches?: string[];
  missingSkills?: string[];
  process_stages?: ProcessStages;
  input_info?: InputInfo;
  ai_analysis_results?: AIAnalysisResults;
}

interface AnalysisResultsProps {
  analysisResults: any; // Temporarily using any for flexibility
}

export default function AnalysisResults({
  analysisResults,
}: AnalysisResultsProps) {
  if (!analysisResults) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mt-8"
    >
      <Card className="shadow-xl">
        <CardHeader
          style={{
            background:
              "linear-gradient(to right, hsl(var(--blue-50)), hsl(var(--gradient-primary-middle)))",
          }}
        >
          <CardTitle className="text-3xl font-bold text-gray-900">
            📊 Resume Analysis Results
          </CardTitle>
          <CardDescription className="text-lg">
            Detailed analysis of your resume against the job requirements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 p-8">
          {/* Process Status */}
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center text-gray-900">
              🔄 Process Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-gray-50 border">
                <div className="flex items-center">
                  <span className="mr-2">
                    {analysisResults.process_stages?.extraction === "completed"
                      ? "✅"
                      : "⏳"}
                  </span>
                  <span className="font-medium text-gray-700">Extraction</span>
                </div>
                <p className="text-sm text-gray-600 mt-1 capitalize">
                  {analysisResults.process_stages?.extraction || "pending"}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-gray-50 border">
                <div className="flex items-center">
                  <span className="mr-2">
                    {analysisResults.process_stages?.cleaning === "completed"
                      ? "✅"
                      : "⏳"}
                  </span>
                  <span className="font-medium text-gray-700">
                    Data Cleaning
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1 capitalize">
                  {analysisResults.process_stages?.cleaning || "pending"}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-gray-50 border">
                <div className="flex items-center">
                  <span className="mr-2">
                    {analysisResults.process_stages?.ai_analysis === "completed"
                      ? "✅"
                      : "⏳"}
                  </span>
                  <span className="font-medium text-gray-700">AI Analysis</span>
                </div>
                <p className="text-sm text-gray-600 mt-1 capitalize">
                  {analysisResults.process_stages?.ai_analysis || "pending"}
                </p>
              </div>
            </div>
          </div>

          {/* Input Information */}
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center text-gray-900">
              📋 Input Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">
                  Job Description
                </h4>
                <div className="space-y-1 text-sm text-blue-700">
                  <p>
                    <strong>Company:</strong>{" "}
                    {analysisResults.input_info?.job_description?.company ||
                      "N/A"}
                  </p>
                  <p>
                    <strong>Position:</strong>{" "}
                    {analysisResults.input_info?.job_description?.position ||
                      "N/A"}
                  </p>
                  <p>
                    <strong>Source:</strong>{" "}
                    {analysisResults.input_info?.job_description?.source_type ||
                      "N/A"}
                  </p>
                  <p>
                    <strong>Text Length:</strong>{" "}
                    {analysisResults.input_info?.job_description?.text_length ||
                      0}{" "}
                    characters
                  </p>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">Resume</h4>
                <div className="space-y-1 text-sm text-green-700">
                  <p>
                    <strong>Filename:</strong>{" "}
                    {analysisResults.input_info?.resume?.filename || "N/A"}
                  </p>
                  <p>
                    <strong>Text Length:</strong>{" "}
                    {analysisResults.input_info?.resume?.text_length || 0}{" "}
                    characters
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Overall Assessment */}
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center text-gray-900">
              🎯 Overall Assessment
            </h3>
            <div className="p-6 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
              <div className="text-center mb-4">
                <div
                  className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
                    analysisResults.ai_analysis_results?.overall_assessment
                      ?.match_score >= 80
                      ? "bg-green-100"
                      : analysisResults.ai_analysis_results?.overall_assessment
                          ?.match_score >= 60
                      ? "bg-yellow-100"
                      : "bg-red-100"
                  }`}
                >
                  <span
                    className={`text-2xl font-bold ${
                      analysisResults.ai_analysis_results?.overall_assessment
                        ?.match_score >= 80
                        ? "text-green-600"
                        : analysisResults.ai_analysis_results
                            ?.overall_assessment?.match_score >= 60
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {analysisResults.ai_analysis_results?.overall_assessment
                      ?.match_score || 0}
                    %
                  </span>
                </div>
                <h4 className="text-xl font-bold text-gray-900">
                  {analysisResults.ai_analysis_results?.overall_assessment
                    ?.suitability_level || "Unknown"}
                </h4>
                <p className="text-gray-600">
                  {analysisResults.ai_analysis_results?.overall_assessment
                    ?.confidence_level || "Unknown"}{" "}
                  Confidence
                </p>
              </div>
              <p className="text-gray-700 text-center">
                {analysisResults.ai_analysis_results?.overall_assessment
                  ?.summary || "No summary available"}
              </p>
            </div>
          </div>

          {/* Skill Analysis */}
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center text-gray-900">
              🛠️ Skill Analysis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                <h4 className="font-semibold text-green-800 mb-3">
                  ✅ Matched Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysisResults.ai_analysis_results?.skill_analysis?.matched_skills?.map(
                    (skill: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full"
                      >
                        {skill}
                      </span>
                    )
                  ) || []}
                </div>
              </div>
              <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                <h4 className="font-semibold text-red-800 mb-3">
                  ❌ Missing Critical Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysisResults.ai_analysis_results?.skill_analysis?.missing_critical_skills?.map(
                    (skill: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full"
                      >
                        {skill}
                      </span>
                    )
                  ) || []}
                </div>
              </div>
              <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                <h4 className="font-semibold text-yellow-800 mb-3">
                  📈 Skill Gaps
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysisResults.ai_analysis_results?.skill_analysis?.skill_gaps?.map(
                    (skill: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full"
                      >
                        {skill}
                      </span>
                    )
                  ) || []}
                </div>
              </div>
            </div>
            <div className="mt-4 p-4 rounded-lg bg-gray-50 border">
              <p className="text-gray-700">
                {analysisResults.ai_analysis_results?.skill_analysis
                  ?.technical_competency ||
                  "No technical competency analysis available"}
              </p>
            </div>
          </div>

          {/* Experience Analysis */}
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center text-gray-900">
              💼 Experience Analysis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {analysisResults.ai_analysis_results?.experience_analysis
                    ?.experience_match || "Unknown"}
                </div>
                <p className="text-sm text-blue-700">Experience Match</p>
              </div>
              <div className="p-4 rounded-lg bg-purple-50 border border-purple-200 text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {analysisResults.ai_analysis_results?.experience_analysis
                    ?.relevant_experience_years || 0}
                </div>
                <p className="text-sm text-purple-700">Relevant Years</p>
              </div>
              <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-200 text-center">
                <div className="text-2xl font-bold text-indigo-600 mb-1">
                  {analysisResults.ai_analysis_results?.experience_analysis
                    ?.experience_quality || "Unknown"}
                </div>
                <p className="text-sm text-indigo-700">Quality</p>
              </div>
            </div>
            <div className="mt-4 p-4 rounded-lg bg-gray-50 border">
              <p className="text-gray-700">
                <strong>Career Progression:</strong>{" "}
                {analysisResults.ai_analysis_results?.experience_analysis
                  ?.career_progression ||
                  "No career progression analysis available"}
              </p>
            </div>
          </div>

          {/* Improvement Recommendations */}
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center text-gray-900">
              🚀 Improvement Recommendations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-lg bg-orange-50 border border-orange-200">
                <h4 className="font-semibold text-orange-800 mb-3">
                  Immediate Actions
                </h4>
                <ul className="space-y-2">
                  {analysisResults.ai_analysis_results?.improvement_recommendations?.immediate_actions?.map(
                    (action: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="text-orange-600 mr-2">•</span>
                        <span className="text-orange-700">{action}</span>
                      </li>
                    )
                  ) || []}
                </ul>
              </div>
              <div className="p-4 rounded-lg bg-teal-50 border border-teal-200">
                <h4 className="font-semibold text-teal-800 mb-3">
                  Skill Development
                </h4>
                <ul className="space-y-2">
                  {analysisResults.ai_analysis_results?.improvement_recommendations?.skill_development?.map(
                    (skill: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="text-teal-600 mr-2">•</span>
                        <span className="text-teal-700">{skill}</span>
                      </li>
                    )
                  ) || []}
                </ul>
              </div>
              <div className="p-4 rounded-lg bg-cyan-50 border border-cyan-200">
                <h4 className="font-semibold text-cyan-800 mb-3">
                  Experience Building
                </h4>
                <ul className="space-y-2">
                  {analysisResults.ai_analysis_results?.improvement_recommendations?.experience_building?.map(
                    (exp: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="text-cyan-600 mr-2">•</span>
                        <span className="text-cyan-700">{exp}</span>
                      </li>
                    )
                  ) || []}
                </ul>
              </div>
              <div className="p-4 rounded-lg bg-pink-50 border border-pink-200">
                <h4 className="font-semibold text-pink-800 mb-3">
                  Resume Optimization
                </h4>
                <ul className="space-y-2">
                  {analysisResults.ai_analysis_results?.improvement_recommendations?.resume_optimization?.map(
                    (opt: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="text-pink-600 mr-2">•</span>
                        <span className="text-pink-700">{opt}</span>
                      </li>
                    )
                  ) || []}
                </ul>
              </div>
            </div>
          </div>

          {/* Strengths and Concerns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-lg bg-green-50 border border-green-200">
              <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                💪 Strengths
              </h4>
              <ul className="space-y-2">
                {analysisResults.ai_analysis_results?.strengths?.map(
                  (strength: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span className="text-green-700">{strength}</span>
                    </li>
                  )
                ) || []}
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-red-50 border border-red-200">
              <h4 className="font-semibold text-red-800 mb-3 flex items-center">
                ⚠️ Concerns
              </h4>
              <ul className="space-y-2">
                {analysisResults.ai_analysis_results?.concerns?.map(
                  (concern: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="text-red-600 mr-2">•</span>
                      <span className="text-red-700">{concern}</span>
                    </li>
                  )
                ) || []}
              </ul>
            </div>
          </div>

          {/* Recommendation */}
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center text-gray-900">
              🎯 Final Recommendation
            </h3>
            <div className="p-6 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200">
              <div className="text-center mb-4">
                <div
                  className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold mb-2 ${
                    analysisResults.ai_analysis_results?.recommendation
                      ?.interview_recommendation === "Recommend"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {analysisResults.ai_analysis_results?.recommendation
                    ?.interview_recommendation || "Unknown"}
                </div>
                <p className="text-gray-700 mb-4">
                  {analysisResults.ai_analysis_results?.recommendation
                    ?.justification || "No justification provided"}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">
                  Next Steps:
                </h4>
                <ul className="space-y-2">
                  {analysisResults.ai_analysis_results?.recommendation?.next_steps?.map(
                    (step: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="text-indigo-600 mr-2">
                          {index + 1}.
                        </span>
                        <span className="text-gray-700">{step}</span>
                      </li>
                    )
                  ) || []}
                </ul>
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center text-gray-900">
              📈 Summary Statistics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-gray-50 border text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {analysisResults.score || 0}%
                </div>
                <p className="text-sm text-gray-600">Overall Score</p>
              </div>
              <div className="p-4 rounded-lg bg-gray-50 border text-center">
                <div className="text-lg font-semibold text-gray-900">
                  {analysisResults.verdict || "Unknown"}
                </div>
                <p className="text-sm text-gray-600">Verdict</p>
              </div>
              <div className="p-4 rounded-lg bg-gray-50 border text-center">
                <div className="text-2xl font-bold text-green-600">
                  {analysisResults.matched_skills?.length || 0}
                </div>
                <p className="text-sm text-gray-600">Matched Skills</p>
              </div>
              <div className="p-4 rounded-lg bg-gray-50 border text-center">
                <div className="text-2xl font-bold text-red-600">
                  {analysisResults.missing_skills?.length || 0}
                </div>
                <p className="text-sm text-gray-600">Missing Skills</p>
              </div>
            </div>
          </div>

          {/* Timestamp */}
          <div className="text-center text-sm text-gray-500 border-t pt-4">
            Analysis completed on{" "}
            {new Date(analysisResults.timestamp).toLocaleString()}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
