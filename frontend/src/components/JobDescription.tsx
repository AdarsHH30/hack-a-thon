"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "./AuthProvider";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ResumeUpload from "./ResumeUpload";

interface JobDescription {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  postedDate: string;
  description: string;
  requirements: string[];
  salary?: string;
}

export default function JobDescription() {
  const [jobDescriptions, setJobDescriptions] = useState<JobDescription[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [selectedJob, setSelectedJob] = useState<JobDescription | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get("id");

  // Load job descriptions on component mount
  useEffect(() => {
    loadJobDescriptions();
  }, []);

  // Set selected job when jobId changes
  useEffect(() => {
    if (jobId && jobDescriptions.length > 0) {
      const job = jobDescriptions.find((j) => j.id === jobId);
      if (job) {
        setSelectedJob(job);
      } else {
        // Job not found, redirect to job list
        router.push("/job-list");
      }
    }
  }, [jobId, jobDescriptions, router]);

  const loadJobDescriptions = async () => {
    setIsLoadingJobs(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get-jobs`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch jobs: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success && data.jobs) {
        // Transform API data to match our JobDescription interface
        const transformedJobs: JobDescription[] = data.jobs.map((job: any) => {
          const structuredData = job.groq_structured_data || {};

          return {
            id: job.id.toString(),
            title:
              structuredData.job_title || job.filename || "Untitled Position",
            company: structuredData.company || "Company Not Specified",
            location: structuredData.location || "Location Not Specified",
            type: structuredData.employment_type || "Full-time",
            postedDate: new Date(job.uploaded_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }),
            description:
              structuredData.job_summary ||
              job.full_text?.substring(0, 500) + "..." ||
              "No description available",
            requirements: structuredData.required_skills || [],
            salary: structuredData.salary_range || undefined,
          };
        });

        setJobDescriptions(transformedJobs);
      } else {
        console.error("API response unsuccessful:", data);
        // Fallback to empty array if API fails
        setJobDescriptions([]);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      // Fallback to empty array if fetch fails
      setJobDescriptions([]);
    } finally {
      setIsLoadingJobs(false);
    }
  };

  // Logout function removed for testing
  // const handleLogout = async () => {
  //   await supabase.auth.signOut();
  // };

  const handleJobSelect = (job: JobDescription) => {
    setSelectedJob(job);
    setUploadedFile(null);
    setShowSuccessMessage(false);
  };

  const handleBackToJobs = () => {
    setSelectedJob(null);
    setUploadedFile(null);
    setShowSuccessMessage(false);
  };

  if (isLoadingJobs) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="bg-gray-200 h-8 w-1/3 rounded mb-4"></div>
            <div className="bg-gray-200 h-6 w-1/2 rounded mb-8"></div>
            <div className="bg-gray-200 h-64 w-full rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedJob) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Job Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The job you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/job-list">
            <Button>Back to Job List</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header with Back Button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-4">
            <Link
              href="/job-list"
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <span className="mr-2">←</span>
              Back to all jobs
            </Link>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-sm text-muted-foreground">
                    Welcome, {user?.user_metadata?.name || user?.email}
                  </span>
                </>
              ) : (
                <div className="flex space-x-2">
                  <Link href="/student-login">
                    <Button variant="outline" size="sm">
                      Student Login
                    </Button>
                  </Link>
                  <Link href="/admin-login">
                    <Button variant="outline" size="sm">
                      Admin Login
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {selectedJob.title}
          </h1>
          <p className="text-lg text-gray-600">at {selectedJob.company}</p>
        </motion.div>

        {/* Job Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="shadow-xl">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    {selectedJob.title}
                  </CardTitle>
                  <CardDescription className="text-xl text-blue-600 font-semibold">
                    {selectedJob.company}
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>📍 {selectedJob.location}</span>
                <span>💼 {selectedJob.type}</span>
                <span>📅 {selectedJob.postedDate}</span>
                {selectedJob.salary && <span>💰 {selectedJob.salary}</span>}
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Job Description
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {selectedJob.description}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Requirements
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedJob.requirements.map((req, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
                    >
                      {req}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Upload Resume Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-gray-900 text-center">
                📄 Upload Your Resume to Apply
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResumeUpload
                jobId={jobId || undefined}
                onMatchComplete={(results) => {
                  console.log("Match analysis completed:", results);
                  // Handle match results if needed
                }}
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
