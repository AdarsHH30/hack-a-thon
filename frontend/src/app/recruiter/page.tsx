"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  Users,
  FileText,
  Search,
  Plus,
  Eye,
  Download,
} from "lucide-react";
import MainLayout from "@/components/layouts/MainLayout";

export default function RecruiterPage() {
  // Environment variables with fallbacks for production
  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8003';
  
  const [activeTab, setActiveTab] = useState("post-job");
  const [jobDescription, setJobDescription] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobFile, setJobFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const tabs = [
    { id: "post-job", label: "Post a Job", icon: Plus },
    { id: "browse-candidates", label: "Browse Candidates", icon: Users },
    { id: "evaluate-resumes", label: "Evaluate Resumes", icon: FileText },
    { id: "dashboard", label: "Dashboard", icon: Eye },
  ];

  const mockCandidates = [
    {
      id: 1,
      name: "Priya Sharma",
      skills: "React, Node.js, MongoDB",
      experience: "3 years",
      location: "Bangalore",
      score: 92,
    },
    {
      id: 2,
      name: "Rahul Kumar",
      skills: "Python, Django, PostgreSQL",
      experience: "4 years",
      location: "Hyderabad",
      score: 88,
    },
    {
      id: 3,
      name: "Sneha Patel",
      skills: "Java, Spring Boot, MySQL",
      experience: "2 years",
      location: "Pune",
      score: 85,
    },
    {
      id: 4,
      name: "Arjun Singh",
      skills: "Angular, TypeScript, AWS",
      experience: "5 years",
      location: "Delhi NCR",
      score: 90,
    },
  ];

  const handleResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setResumeFile(file);
    }
  };

  const handleJobFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setJobFile(file);
      setUploadSuccess(false);
    }
  };

  const uploadJobDescription = async () => {
    if (!jobFile) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("jd_file", jobFile);

      const response = await fetch(
        `${API_BASE_URL}/api/job-description`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Job description uploaded successfully:", result);
        setUploadSuccess(true);
        // Reset file after successful upload
        setTimeout(() => {
          setJobFile(null);
          setUploadSuccess(false);
        }, 3000);
      } else {
        console.error("Upload failed:", response.statusText);
        alert("Upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading job description:", error);
      alert("Upload error. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "post-job":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Post a Job</h2>
            <p className="text-muted-foreground">
              Upload your job description and we&apos;ll take care of the rest. Just
              drop your PDF here and candidates will start seeing it right away.
            </p>

            <div className="bg-card border border-border rounded-lg p-8">
              <div className="text-center">
                <Upload className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Add Your Job Description
                </h3>
                <p className="text-muted-foreground mb-6">
                  Just upload your job posting as a PDF - we&apos;ll handle
                  everything else
                </p>

                <div className="max-w-md mx-auto">
                  <input
                    type="file"
                    onChange={handleJobFileUpload}
                    accept=".pdf"
                    className="hidden"
                    id="job-file-upload"
                    disabled={isUploading}
                  />
                  <label
                    htmlFor="job-file-upload"
                    className={`block w-full px-6 py-4 rounded-lg font-semibold cursor-pointer transition-colors text-center ${
                      isUploading
                        ? "bg-muted text-muted-foreground cursor-not-allowed"
                        : "bg-innomatics-blue text-background hover:bg-innomatics-blue/90"
                    }`}
                  >
                    {isUploading ? "Publishing..." : "Choose File"}
                  </label>

                  {jobFile && !isUploading && (
                    <div className="mt-4 p-3 bg-innomatics-blue/10 rounded-lg">
                      <p className="text-sm text-innomatics-blue font-medium">
                        📄 Ready to go: {jobFile.name}
                      </p>
                      <p className="text-xs text-innomatics-blue/80 mt-1">
                        Size: {(jobFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  )}

                  {uploadSuccess && (
                    <div className="mt-4 p-3 bg-green-500/10 rounded-lg">
                      <p className="text-sm text-green-700 font-medium">
                        ✅ Your job is now live!
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        Candidates can now find and apply for this position.
                      </p>
                    </div>
                  )}

                  {isUploading && (
                    <div className="mt-4 p-3 bg-yellow-500/10 rounded-lg">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-innomatics-purple"></div>
                        <p className="text-sm text-innomatics-purple font-medium">
                          Getting your job ready...
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {jobFile && !isUploading && !uploadSuccess && (
              <div className="text-center">
                <button
                  onClick={uploadJobDescription}
                  className="bg-innomatics-red text-background px-8 py-3 rounded-lg font-semibold hover:bg-innomatics-red/90 transition-colors"
                >
                  Post Job
                </button>
              </div>
            )}

            <div className="bg-innomatics-blue/10 border border-innomatics-blue/20 rounded-lg p-4">
              <h4 className="font-semibold text-innomatics-blue mb-2">
                💡 Quick tips:
              </h4>
              <ul className="text-sm text-innomatics-blue/80 space-y-1">
                <li>• Include all the important details in your PDF</li>
                <li>
                  • Add salary info if you can - candidates love transparency
                </li>
                <li>• Keep it under 10MB for quick processing</li>
                <li>• Text should be selectable (not just images)</li>
              </ul>
            </div>
          </div>
        );

      case "browse-candidates":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">
                Browse Talent
              </h2>
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Search for skills, experience, location..."
                  className="px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-innomatics-blue focus:border-transparent"
                />
                <button className="bg-innomatics-blue text-background px-4 py-2 rounded-lg hover:bg-innomatics-blue/90">
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="grid gap-4">
              {mockCandidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground">
                        {candidate.name}
                      </h3>
                      <p className="text-muted-foreground mb-2">
                        {candidate.experience} experience • {candidate.location}
                      </p>
                      <p className="text-sm text-muted-foreground mb-3">
                        Skills: {candidate.skills}
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            Match Score:
                          </span>
                          <span
                            className={`px-2 py-1 rounded text-sm font-medium ${
                              candidate.score >= 90
                                ? "bg-green-100 text-green-800"
                                : candidate.score >= 80
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {candidate.score}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="bg-innomatics-blue text-background px-4 py-2 rounded-lg text-sm hover:bg-innomatics-blue/90">
                        View Profile
                      </button>
                      <button className="border border-border px-4 py-2 rounded-lg text-sm hover:bg-muted">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "evaluate-resumes":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">
              Review Resumes
            </h2>
            <div className="bg-card border border-border rounded-lg p-8">
              <div className="text-center">
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Quick Resume Review
                </h3>
                <p className="text-muted-foreground mb-6">
                  Drop a resume here and get instant feedback on how well it
                  matches your needs
                </p>
                <div className="max-w-md mx-auto">
                  <input
                    type="file"
                    onChange={handleResumeUpload}
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    id="resume-upload"
                  />
                  <label
                    htmlFor="resume-upload"
                    className="block w-full bg-innomatics-blue text-background px-6 py-3 rounded-lg font-semibold cursor-pointer hover:bg-innomatics-blue/90 transition-colors"
                  >
                    Choose Resume File
                  </label>
                  {resumeFile && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      Selected: {resumeFile.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Job details (optional - helps with better matching)
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full p-3 border border-border rounded-lg h-24 focus:ring-2 focus:ring-innomatics-blue focus:border-transparent"
                placeholder="Paste your job requirements here for better matching..."
              />
            </div>
            <button className="bg-innomatics-red text-background px-6 py-3 rounded-lg font-semibold hover:bg-innomatics-red/90 transition-colors">
              Check Resume
            </button>
          </div>
        );

      case "dashboard":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">
              Your Hiring Overview
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Open Positions
                </h3>
                <p className="text-3xl font-bold text-innomatics-blue">12</p>
                <p className="text-sm text-muted-foreground">actively hiring</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Applications
                </h3>
                <p className="text-3xl font-bold text-innomatics-purple">348</p>
                <p className="text-sm text-muted-foreground">this month</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Interviews
                </h3>
                <p className="text-3xl font-bold text-innomatics-red">23</p>
                <p className="text-sm text-muted-foreground">coming up</p>
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                What&apos;s happening
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 border border-border rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-foreground">
                    New application for Frontend Developer role
                  </span>
                  <span className="text-sm text-muted-foreground ml-auto">
                    2 hours ago
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 border border-border rounded-lg">
                  <div className="w-2 h-2 bg-innomatics-blue rounded-full"></div>
                  <span className="text-foreground">
                    Interview set up with Priya Sharma
                  </span>
                  <span className="text-sm text-muted-foreground ml-auto">
                    4 hours ago
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 border border-border rounded-lg">
                  <div className="w-2 h-2 bg-innomatics-purple rounded-full"></div>
                  <span className="text-foreground">
                    Backend Engineer job went live
                  </span>
                  <span className="text-sm text-muted-foreground ml-auto">
                    1 day ago
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-background overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-innomatics-blue/5 via-background to-innomatics-purple/5" />
        <div className="relative z-10 container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Recruiter Hub
            </h1>
            <p className="text-muted-foreground">
              Everything you need to find and hire great talent
            </p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:w-64"
            >
              <div className="bg-card border border-border rounded-lg p-4">
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const IconComponent = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                          activeTab === tab.id
                            ? "bg-innomatics-blue text-background"
                            : "text-foreground hover:bg-muted"
                        }`}
                      >
                        <IconComponent className="w-5 h-5" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex-1"
            >
              <div className="bg-card border border-border rounded-lg p-8">
                {renderTabContent()}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
