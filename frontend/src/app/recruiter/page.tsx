"use client";

import { useState } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import UploadForm from "@/components/UploadForm";
import CandidateTable from "@/components/CandidateTable";

// Mock candidate data
const mockCandidates = [
  {
    id: "1",
    name: "Sarah Chen",
    email: "sarah.chen@email.com",
    score: 92,
    experience: "5+ years",
    skills: ["React", "TypeScript", "Node.js", "AWS", "GraphQL"],
    resumeUrl: "/resumes/sarah-chen.pdf",
  },
  {
    id: "2",
    name: "Michael Rodriguez",
    email: "michael.r@email.com",
    score: 87,
    experience: "3+ years",
    skills: ["JavaScript", "Python", "Docker", "MongoDB", "Express"],
    resumeUrl: "/resumes/michael-rodriguez.pdf",
  },
  {
    id: "3",
    name: "Emily Johnson",
    email: "emily.johnson@email.com",
    score: 84,
    experience: "4+ years",
    skills: ["Vue.js", "PHP", "MySQL", "Laravel", "Redis"],
    resumeUrl: "/resumes/emily-johnson.pdf",
  },
  {
    id: "4",
    name: "David Kim",
    email: "david.kim@email.com",
    score: 79,
    experience: "2+ years",
    skills: ["Angular", "Java", "Spring Boot", "PostgreSQL", "Kubernetes"],
    resumeUrl: "/resumes/david-kim.pdf",
  },
  {
    id: "5",
    name: "Lisa Wang",
    email: "lisa.wang@email.com",
    score: 76,
    experience: "6+ years",
    skills: ["React Native", "Swift", "Kotlin", "Firebase", "CI/CD"],
    resumeUrl: "/resumes/lisa-wang.pdf",
  },
  {
    id: "6",
    name: "James Thompson",
    email: "james.t@email.com",
    score: 71,
    experience: "1+ years",
    skills: ["HTML", "CSS", "JavaScript", "Git", "Figma"],
    resumeUrl: "/resumes/james-thompson.pdf",
  },
];

export default function RecruiterPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setIsAnalyzing(true);

    // Simulate API call
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
    }, 3000);
  };

  return (
    <MainLayout>
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {!showResults ? (
            <UploadForm
              title="Upload Job Description"
              description="Upload your job description to find the most relevant candidates from our database"
              acceptedTypes=".pdf,.docx,.txt"
              onFileUpload={handleFileUpload}
            />
          ) : null}

          {isAnalyzing && (
            <div className="max-w-2xl mx-auto text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold mb-2">
                Analyzing Job Requirements
              </h3>
              <p className="text-muted-foreground">
                Matching candidates from our database based on your job
                description...
              </p>
            </div>
          )}

          {showResults && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4">Candidate Matches</h2>
                <p className="text-muted-foreground">
                  Found {mockCandidates.length} candidates matching your job
                  requirements
                </p>
              </div>

              {/* Job Summary */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Job Analysis Summary
                </h3>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">
                      Required Skills:
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {["React", "TypeScript", "Node.js", "AWS"].map(
                        (skill) => (
                          <span
                            key={skill}
                            className="px-2 py-1 bg-primary/10 text-primary rounded text-xs"
                          >
                            {skill}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">
                      Experience Level:
                    </span>
                    <p className="font-medium">3-5 years</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">
                      Total Candidates:
                    </span>
                    <p className="font-medium">
                      {mockCandidates.length} matches
                    </p>
                  </div>
                </div>
              </div>

              <CandidateTable candidates={mockCandidates} />

              {/* Actions */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowResults(false)}
                  className="px-6 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                >
                  Upload New Job Description
                </button>
                <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                  Export Shortlist
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
