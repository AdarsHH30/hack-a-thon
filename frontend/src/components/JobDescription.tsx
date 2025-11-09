"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "./AuthProvider";
import { Button } from "@/components/ui/button";
import ResumeUpload from "./ResumeUpload";
import AnalysisResults from "./AnalysisResults";
import JobHeader from "./JobHeader";
import JobDetails from "./JobDetails";
import API_BASE_URL from "@/lib/api-config";

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
  responsibilities?: string[];
  preferredSkills?: string[];
  qualifications?: {
    education?: string[];
    experience?: string;
    certifications?: string[];
  };
  benefits?: string[];
  department?: string;
  contactInfo?: {
    email?: string;
    phone?: string;
    website?: string;
  };
  applicationDeadline?: string;
  // Additional dynamic fields from Groq API
  stipend?: string;
  bond?: string;
  internship_duration?: string;
  eligibility_criteria?: {
    qualification?: string;
    batch_eligibility?: string;
  };
  job_types?: string[];
  schedule?: string;
  role_overview?: string[];
  requirements_list?: string[];
  job_responsibilities?: string[];
  skills?: string[];
  job_name?: string;
}

interface AnalysisResult {
  score?: number;
  feedback?: string[];
  [key: string]: any; // For flexible analysis results
}

export default function JobDescription() {
  const [jobDescriptions, setJobDescriptions] = useState<JobDescription[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [selectedJob, setSelectedJob] = useState<JobDescription | null>(null);
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get("id");

  // Analysis results state
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(
    null
  );

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
      const response = await fetch(`${API_BASE_URL}/api/get-jobs`);

      if (!response.ok) {
        throw new Error(`Failed to fetch jobs: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success && data.jobs) {
        // Transform API data to match our JobDescription interface
        const transformedJobs: JobDescription[] = data.jobs.map((job: any) => {
          // Handle groq_structured_data as array - take first job if multiple
          const groqData =
            job.groq_structured_data && Array.isArray(job.groq_structured_data)
              ? job.groq_structured_data[0]
              : job.groq_structured_data || {};

          return {
            id: job.id.toString(),
            title:
              groqData.job_title ||
              groqData.job_name ||
              job.filename ||
              "Untitled Position",
            company: groqData.company || "Company Not Specified",
            location: groqData.location || "Location Not Specified",
            type: groqData.employment_type || "Full-time",
            department: groqData.department || "",
            postedDate: new Date(job.uploaded_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }),
            description:
              groqData.job_summary ||
              job.full_text?.substring(0, 500) + "..." ||
              "No description available",
            requirements: groqData.required_skills || groqData.skills || [],
            preferredSkills: groqData.preferred_skills || [],
            responsibilities:
              groqData.responsibilities ||
              groqData.role_overview ||
              groqData.job_responsibilities ||
              [],
            qualifications: groqData.qualifications || {},
            benefits: groqData.benefits || [],
            salary: groqData.salary_range || groqData.stipend || undefined,
            applicationDeadline: groqData.application_deadline || "",
            contactInfo: groqData.contact_info || {},
            // Additional dynamic fields
            stipend: groqData.stipend,
            bond: groqData.bond,
            internship_duration: groqData.internship_duration,
            eligibility_criteria: groqData.eligibility_criteria,
            job_types: groqData.job_types,
            schedule: groqData.schedule,
            role_overview: groqData.role_overview,
            requirements_list: groqData.requirements,
            job_responsibilities: groqData.job_responsibilities,
            skills: groqData.skills,
            job_name: groqData.job_name,
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
  };

  const handleBackToJobs = () => {
    setSelectedJob(null);
  };

  if (isLoadingJobs) {
    return (
      <div
        className="min-h-screen p-6"
        style={{
          background:
            "linear-gradient(to bottom right, hsl(var(--gradient-primary-start)), hsl(var(--gradient-primary-middle)), hsl(var(--gradient-primary-end)))",
        }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div
              className="h-8 w-1/3 rounded mb-4"
              style={{ backgroundColor: "hsl(var(--gray-200))" }}
            ></div>
            <div
              className="h-6 w-1/2 rounded mb-8"
              style={{ backgroundColor: "hsl(var(--gray-200))" }}
            ></div>
            <div
              className="h-64 w-full rounded"
              style={{ backgroundColor: "hsl(var(--gray-200))" }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  // If no specific job selected, show a generic job posting page with resume upload
  if (!selectedJob) {
    const fallbackJob: JobDescription = {
      id: "general-application",
      title: "General Application",
      company: "Various Companies",
      location: "Multiple Locations",
      type: "Full-time / Part-time / Internship",
      postedDate: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      description:
        "We're always looking for talented individuals to join our team! Upload your resume and we'll match you with the best opportunities that align with your skills and experience. Our AI-powered system will analyze your profile and suggest positions from various companies in our network.",
      requirements: [
        "Strong communication skills",
        "Problem-solving abilities",
        "Teamwork and collaboration",
        "Adaptability and learning mindset",
        "Technical skills relevant to your field",
      ],
      responsibilities: [
        "Contribute to meaningful projects",
        "Collaborate with cross-functional teams",
        "Continuous learning and skill development",
        "Innovation and creative problem solving",
      ],
      benefits: [
        "Competitive compensation packages",
        "Professional development opportunities",
        "Flexible working arrangements",
        "Health and wellness benefits",
        "Career advancement paths",
      ],
      qualifications: {
        education: ["Bachelor's degree or equivalent experience"],
        experience: "Entry level to experienced professionals welcome",
        certifications: ["Industry-relevant certifications preferred"],
      },
    };

    setSelectedJob(fallbackJob);
  }

  return (
    <div
      className="min-h-screen p-6"
      style={{
        background:
          "linear-gradient(to bottom right, hsl(var(--gradient-primary-start)), hsl(var(--gradient-primary-middle)), hsl(var(--gradient-primary-end)))",
      }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header with Back Button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-start mb-6">
            <Link
              href="/job-list"
              className="flex items-center transition-colors font-medium"
              style={{ color: "hsl(var(--blue-600))" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "hsl(var(--blue-800))")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "hsl(var(--blue-600))")
              }
            >
              <span className="mr-2 text-xl">←</span>
              Back to all jobs
            </Link>
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center font-semibold"
                    style={{
                      backgroundColor: "hsl(var(--blue-500))",
                      color: "hsl(var(--white))",
                    }}
                  >
                    {(user?.user_metadata?.name ||
                      user?.email ||
                      "U")[0].toUpperCase()}
                  </div>
                </div>
              ) : (
                <div className="flex space-x-3">
                  <Link href="/student-login">
                    <Button variant="outline" size="sm" className="font-medium">
                      Student Login
                    </Button>
                  </Link>
                  <Link href="/admin-login">
                    <Button variant="outline" size="sm" className="font-medium">
                      Admin Login
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Job Header */}
          {selectedJob && (
            <JobHeader selectedJob={selectedJob} user={user || undefined} />
          )}

          {/* Job Details */}
          {selectedJob && <JobDetails selectedJob={selectedJob} />}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ResumeUpload
            jobId={jobId || undefined}
            onMatchComplete={(results) => {
              console.log("Match analysis completed:", results);
              setAnalysisResults(results);
            }}
          />
        </motion.div>

        {/* Analysis Results Section */}
        <AnalysisResults analysisResults={analysisResults} />
      </div>
    </div>
  );
}
