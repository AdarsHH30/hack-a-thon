"use client";

import { useState } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import UploadForm from "@/components/UploadForm";
import ResultCard from "@/components/ResultCard";

export default function StudentPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setIsAnalyzing(true);

    // Simulate API call
    setTimeout(() => {
      // Mock results
      setResults({
        score: 78,
        feedback: [
          "Your resume shows strong technical skills that align well with modern software development roles.",
          "The experience section clearly demonstrates progression in your career with increasing responsibilities.",
          "Consider adding more specific metrics and quantifiable achievements to strengthen your impact statements.",
        ],
        strengths: [
          "Strong technical skills in React, Node.js, and TypeScript",
          "Clear career progression with increasing responsibilities",
          "Good balance of technical and soft skills",
          "Relevant project experience with modern technologies",
        ],
        improvements: [
          "Add more quantifiable achievements and metrics",
          "Include specific examples of problem-solving",
          "Expand on leadership and collaboration experiences",
          "Consider adding relevant certifications or courses",
        ],
      });
      setIsAnalyzing(false);
    }, 3000);
  };

  return (
    <MainLayout>
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {!results ? (
            <UploadForm
              title="Upload Your Resume"
              description="Get instant feedback on how well your resume matches job requirements"
              acceptedTypes=".pdf,.docx"
              onFileUpload={handleFileUpload}
            />
          ) : null}

          {isAnalyzing && (
            <div className="max-w-2xl mx-auto text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold mb-2">
                Analyzing Your Resume
              </h3>
              <p className="text-muted-foreground">
                Our AI is reviewing your resume and generating personalized
                feedback...
              </p>
            </div>
          )}

          {results && (
            <div className="py-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">
                  Resume Analysis Results
                </h2>
                <p className="text-muted-foreground">
                  Here's how your resume performs and how to improve it
                </p>
              </div>
              <ResultCard {...results} />
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
