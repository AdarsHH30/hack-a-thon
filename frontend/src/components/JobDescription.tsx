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

  if (!selectedJob) {
    return (
      <div
        className="min-h-screen p-6"
        style={{
          background:
            "linear-gradient(to bottom right, hsl(var(--gradient-primary-start)), hsl(var(--gradient-primary-middle)), hsl(var(--gradient-primary-end)))",
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1
            className="text-2xl font-bold mb-4"
            style={{ color: "hsl(var(--gray-900))" }}
          >
            Job Not Found
          </h1>
          <p className="mb-6" style={{ color: "hsl(var(--gray-600))" }}>
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

          {/* Job Title Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <h1
                  className="text-4xl font-bold mb-3"
                  style={{ color: "hsl(var(--gray-900))" }}
                >
                  {selectedJob.title}
                </h1>
                <p
                  className="text-xl font-semibold mb-2"
                  style={{ color: "hsl(var(--blue-600))" }}
                >
                  {selectedJob.company}
                </p>
                {selectedJob.department && (
                  <p
                    className="text-sm font-medium"
                    style={{ color: "hsl(var(--gray-600))" }}
                  >
                    {selectedJob.department} Department
                  </p>
                )}
              </div>
              <div className="flex flex-col space-y-2 text-sm">
                <div
                  className="flex items-center"
                  style={{ color: "hsl(var(--gray-600))" }}
                >
                  <span className="mr-2">📍</span>
                  {selectedJob.location}
                </div>
                <div
                  className="flex items-center"
                  style={{ color: "hsl(var(--gray-600))" }}
                >
                  <span className="mr-2">💼</span>
                  {selectedJob.type}
                </div>
                <div
                  className="flex items-center"
                  style={{ color: "hsl(var(--gray-600))" }}
                >
                  <span className="mr-2">📅</span>
                  Posted {selectedJob.postedDate}
                </div>
                {selectedJob.salary && (
                  <div
                    className="flex items-center font-semibold"
                    style={{ color: "hsl(var(--green-600))" }}
                  >
                    <span className="mr-2">💰</span>
                    {selectedJob.salary}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Job Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="shadow-xl">
            <CardHeader
              style={{
                background:
                  "linear-gradient(to right, hsl(var(--blue-50)), hsl(var(--gradient-primary-middle)))",
              }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle
                    className="text-3xl font-bold mb-2"
                    style={{ color: "hsl(var(--gray-900))" }}
                  >
                    {selectedJob.title}
                  </CardTitle>
                  <CardDescription
                    className="text-xl font-semibold mb-2"
                    style={{ color: "hsl(var(--blue-600))" }}
                  >
                    {selectedJob.company}
                  </CardDescription>
                  {selectedJob.department && (
                    <p
                      className="text-sm font-medium"
                      style={{ color: "hsl(var(--gray-600))" }}
                    >
                      📂 {selectedJob.department}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <div
                    className="flex flex-col space-y-1 text-sm"
                    style={{ color: "hsl(var(--gray-600))" }}
                  >
                    <span className="flex items-center">
                      📍 {selectedJob.location}
                    </span>
                    <span className="flex items-center">
                      💼 {selectedJob.type}
                    </span>
                    <span className="flex items-center">
                      📅 {selectedJob.postedDate}
                    </span>
                    {selectedJob.salary && (
                      <span className="flex items-center font-semibold text-green-600">
                        💰 {selectedJob.salary}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Job Summary */}
              <div>
                <h3
                  className="text-xl font-semibold mb-4 flex items-center"
                  style={{ color: "hsl(var(--gray-900))" }}
                >
                  📋 Job Summary
                </h3>
                <p
                  className="leading-relaxed text-base"
                  style={{ color: "hsl(var(--gray-700))" }}
                >
                  {selectedJob.description}
                </p>
              </div>

              {/* Responsibilities */}
              {selectedJob.responsibilities &&
                selectedJob.responsibilities.length > 0 && (
                  <div>
                    <h3
                      className="text-xl font-semibold mb-4 flex items-center"
                      style={{ color: "hsl(var(--gray-900))" }}
                    >
                      🎯 Key Responsibilities
                    </h3>
                    <ul className="space-y-3">
                      {selectedJob.responsibilities.map(
                        (responsibility, index) => (
                          <li key={index} className="flex items-start">
                            <span
                              className="mr-3 mt-1"
                              style={{ color: "hsl(var(--blue-500))" }}
                            >
                              •
                            </span>
                            <span
                              className="leading-relaxed"
                              style={{ color: "hsl(var(--gray-700))" }}
                            >
                              {responsibility}
                            </span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

              {/* Required Skills */}
              {selectedJob.requirements &&
                selectedJob.requirements.length > 0 && (
                  <div>
                    <h3
                      className="text-xl font-semibold mb-4 flex items-center"
                      style={{ color: "hsl(var(--gray-900))" }}
                    >
                      🛠️ Required Skills
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {selectedJob.requirements.map((skill, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 text-sm font-medium rounded-full border"
                          style={{
                            backgroundColor: "hsl(var(--red-100))",
                            color: "hsl(var(--red-800))",
                            borderColor: "hsl(var(--red-200))",
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {/* Preferred Skills */}
              {selectedJob.preferredSkills &&
                selectedJob.preferredSkills.length > 0 && (
                  <div>
                    <h3
                      className="text-xl font-semibold mb-4 flex items-center"
                      style={{ color: "hsl(var(--gray-900))" }}
                    >
                      ⭐ Preferred Skills
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {selectedJob.preferredSkills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 text-sm font-medium rounded-full border"
                          style={{
                            backgroundColor: "hsl(var(--green-100))",
                            color: "hsl(var(--green-800))",
                            borderColor: "hsl(var(--green-200))",
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {/* Qualifications */}
              {selectedJob.qualifications && (
                <div>
                  <h3
                    className="text-xl font-semibold mb-4 flex items-center"
                    style={{ color: "hsl(var(--gray-900))" }}
                  >
                    🎓 Qualifications
                  </h3>
                  <div className="space-y-4">
                    {selectedJob.qualifications.education &&
                      selectedJob.qualifications.education.length > 0 && (
                        <div>
                          <h4
                            className="font-medium mb-2"
                            style={{ color: "hsl(var(--gray-800))" }}
                          >
                            Education:
                          </h4>
                          <ul className="space-y-1">
                            {selectedJob.qualifications.education.map(
                              (edu, index) => (
                                <li
                                  key={index}
                                  className="flex items-start"
                                  style={{ color: "hsl(var(--gray-700))" }}
                                >
                                  <span
                                    className="mr-2"
                                    style={{ color: "hsl(var(--blue-500))" }}
                                  >
                                    •
                                  </span>
                                  {edu}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                    {selectedJob.qualifications.experience && (
                      <div>
                        <h4
                          className="font-medium mb-2"
                          style={{ color: "hsl(var(--gray-800))" }}
                        >
                          Experience:
                        </h4>
                        <p style={{ color: "hsl(var(--gray-700))" }}>
                          {selectedJob.qualifications.experience}
                        </p>
                      </div>
                    )}
                    {selectedJob.qualifications.certifications &&
                      selectedJob.qualifications.certifications.length > 0 && (
                        <div>
                          <h4
                            className="font-medium mb-2"
                            style={{ color: "hsl(var(--gray-800))" }}
                          >
                            Certifications:
                          </h4>
                          <ul className="space-y-1">
                            {selectedJob.qualifications.certifications.map(
                              (cert, index) => (
                                <li
                                  key={index}
                                  className="flex items-start"
                                  style={{ color: "hsl(var(--gray-700))" }}
                                >
                                  <span
                                    className="mr-2"
                                    style={{ color: "hsl(var(--blue-500))" }}
                                  >
                                    •
                                  </span>
                                  {cert}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                  </div>
                </div>
              )}

              {/* Benefits */}
              {selectedJob.benefits && selectedJob.benefits.length > 0 && (
                <div>
                  <h3
                    className="text-xl font-semibold mb-4 flex items-center"
                    style={{ color: "hsl(var(--gray-900))" }}
                  >
                    🎁 Benefits & Perks
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedJob.benefits.map((benefit, index) => (
                      <div
                        key={index}
                        className="flex items-start p-3 rounded-lg"
                        style={{ backgroundColor: "hsl(var(--gray-50))" }}
                      >
                        <span
                          className="mr-3 mt-1"
                          style={{ color: "hsl(var(--green-500))" }}
                        >
                          ✓
                        </span>
                        <span style={{ color: "hsl(var(--gray-700))" }}>
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Information */}
              {selectedJob.contactInfo && (
                <div>
                  <h3
                    className="text-xl font-semibold mb-4 flex items-center"
                    style={{ color: "hsl(var(--gray-900))" }}
                  >
                    📞 Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {selectedJob.contactInfo.email && (
                      <div
                        className="flex items-center p-3 rounded-lg"
                        style={{ backgroundColor: "hsl(var(--blue-50))" }}
                      >
                        <span
                          className="mr-3"
                          style={{ color: "hsl(var(--blue-500))" }}
                        >
                          📧
                        </span>
                        <span style={{ color: "hsl(var(--gray-700))" }}>
                          {selectedJob.contactInfo.email}
                        </span>
                      </div>
                    )}
                    {selectedJob.contactInfo.phone && (
                      <div
                        className="flex items-center p-3 rounded-lg"
                        style={{ backgroundColor: "hsl(var(--blue-50))" }}
                      >
                        <span
                          className="mr-3"
                          style={{ color: "hsl(var(--blue-500))" }}
                        >
                          📱
                        </span>
                        <span style={{ color: "hsl(var(--gray-700))" }}>
                          {selectedJob.contactInfo.phone}
                        </span>
                      </div>
                    )}
                    {selectedJob.contactInfo.website && (
                      <div
                        className="flex items-center p-3 rounded-lg"
                        style={{ backgroundColor: "hsl(var(--blue-50))" }}
                      >
                        <span
                          className="mr-3"
                          style={{ color: "hsl(var(--blue-500))" }}
                        >
                          🌐
                        </span>
                        <a
                          href={selectedJob.contactInfo.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline"
                          style={{ color: "hsl(var(--blue-600))" }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.color =
                              "hsl(var(--blue-800))")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.color =
                              "hsl(var(--blue-600))")
                          }
                        >
                          {selectedJob.contactInfo.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Application Deadline */}
              {selectedJob.applicationDeadline && (
                <div
                  className="rounded-lg p-4"
                  style={{
                    backgroundColor: "hsl(var(--yellow-50))",
                    borderColor: "hsl(var(--yellow-200))",
                    borderWidth: "1px",
                    borderStyle: "solid",
                  }}
                >
                  <h3
                    className="text-lg font-semibold mb-2 flex items-center"
                    style={{ color: "hsl(var(--yellow-800))" }}
                  >
                    ⏰ Application Deadline
                  </h3>
                  <p style={{ color: "hsl(var(--yellow-700))" }}>
                    {selectedJob.applicationDeadline}
                  </p>
                </div>
              )}

              {/* Dynamic Additional Fields */}
              <div>
                <h3
                  className="text-xl font-semibold mb-4 flex items-center"
                  style={{ color: "hsl(var(--gray-900))" }}
                >
                  📊 Additional Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Stipend */}
                  {selectedJob.stipend && (
                    <div
                      className="p-4 rounded-lg"
                      style={{
                        backgroundColor: "hsl(var(--green-50))",
                        borderColor: "hsl(var(--green-200))",
                        borderWidth: "1px",
                        borderStyle: "solid",
                      }}
                    >
                      <h4
                        className="font-semibold mb-2 flex items-center"
                        style={{ color: "hsl(var(--green-800))" }}
                      >
                        💰 Stipend
                      </h4>
                      <p
                        className="text-lg font-medium"
                        style={{ color: "hsl(var(--green-700))" }}
                      >
                        {selectedJob.stipend}
                      </p>
                    </div>
                  )}

                  {/* Bond */}
                  {selectedJob.bond && (
                    <div
                      className="p-4 rounded-lg"
                      style={{
                        backgroundColor: "hsl(var(--purple-50))",
                        borderColor: "hsl(var(--purple-200))",
                        borderWidth: "1px",
                        borderStyle: "solid",
                      }}
                    >
                      <h4
                        className="font-semibold mb-2 flex items-center"
                        style={{ color: "hsl(var(--purple-800))" }}
                      >
                        📋 Bond Period
                      </h4>
                      <p style={{ color: "hsl(var(--purple-700))" }}>
                        {selectedJob.bond}
                      </p>
                    </div>
                  )}

                  {/* Internship Duration */}
                  {selectedJob.internship_duration && (
                    <div
                      className="p-4 rounded-lg"
                      style={{
                        backgroundColor: "hsl(var(--blue-50))",
                        borderColor: "hsl(var(--blue-200))",
                        borderWidth: "1px",
                        borderStyle: "solid",
                      }}
                    >
                      <h4
                        className="font-semibold mb-2 flex items-center"
                        style={{ color: "hsl(var(--blue-800))" }}
                      >
                        ⏱️ Duration
                      </h4>
                      <p style={{ color: "hsl(var(--blue-700))" }}>
                        {selectedJob.internship_duration}
                      </p>
                    </div>
                  )}

                  {/* Schedule */}
                  {selectedJob.schedule && (
                    <div
                      className="p-4 rounded-lg"
                      style={{
                        backgroundColor: "hsl(var(--yellow-50))",
                        borderColor: "hsl(var(--yellow-200))",
                        borderWidth: "1px",
                        borderStyle: "solid",
                      }}
                    >
                      <h4
                        className="font-semibold mb-2 flex items-center"
                        style={{ color: "hsl(var(--yellow-800))" }}
                      >
                        🕒 Schedule
                      </h4>
                      <p style={{ color: "hsl(var(--yellow-700))" }}>
                        {selectedJob.schedule}
                      </p>
                    </div>
                  )}

                  {/* Eligibility Criteria */}
                  {selectedJob.eligibility_criteria && (
                    <div
                      className="p-4 rounded-lg md:col-span-2"
                      style={{
                        backgroundColor: "hsl(var(--gray-50))",
                        borderColor: "hsl(var(--gray-200))",
                        borderWidth: "1px",
                        borderStyle: "solid",
                      }}
                    >
                      <h4
                        className="font-semibold mb-3 flex items-center"
                        style={{ color: "hsl(var(--gray-800))" }}
                      >
                        🎯 Eligibility Criteria
                      </h4>
                      <div className="space-y-2">
                        {selectedJob.eligibility_criteria.qualification && (
                          <div>
                            <span
                              className="font-medium"
                              style={{ color: "hsl(var(--gray-700))" }}
                            >
                              Qualification:
                            </span>
                            <span
                              className="ml-2"
                              style={{ color: "hsl(var(--gray-600))" }}
                            >
                              {selectedJob.eligibility_criteria.qualification}
                            </span>
                          </div>
                        )}
                        {selectedJob.eligibility_criteria.batch_eligibility && (
                          <div>
                            <span
                              className="font-medium"
                              style={{ color: "hsl(var(--gray-700))" }}
                            >
                              Batch Eligibility:
                            </span>
                            <span
                              className="ml-2"
                              style={{ color: "hsl(var(--gray-600))" }}
                            >
                              {
                                selectedJob.eligibility_criteria
                                  .batch_eligibility
                              }
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Job Types */}
                  {selectedJob.job_types &&
                    selectedJob.job_types.length > 0 && (
                      <div
                        className="p-4 rounded-lg md:col-span-2"
                        style={{
                          backgroundColor: "hsl(var(--indigo-50))",
                          borderColor: "hsl(var(--indigo-200))",
                          borderWidth: "1px",
                          borderStyle: "solid",
                        }}
                      >
                        <h4
                          className="font-semibold mb-3 flex items-center"
                          style={{ color: "hsl(var(--indigo-800))" }}
                        >
                          💼 Job Types
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedJob.job_types.map((type, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 text-sm font-medium rounded-full"
                              style={{
                                backgroundColor: "hsl(var(--indigo-100))",
                                color: "hsl(var(--indigo-800))",
                              }}
                            >
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Requirements List */}
                  {selectedJob.requirements_list &&
                    selectedJob.requirements_list.length > 0 && (
                      <div
                        className="p-4 rounded-lg md:col-span-2"
                        style={{
                          backgroundColor: "hsl(var(--red-50))",
                          borderColor: "hsl(var(--red-200))",
                          borderWidth: "1px",
                          borderStyle: "solid",
                        }}
                      >
                        <h4
                          className="font-semibold mb-3 flex items-center"
                          style={{ color: "hsl(var(--red-800))" }}
                        >
                          📋 Requirements
                        </h4>
                        <ul className="space-y-2">
                          {selectedJob.requirements_list.map((req, index) => (
                            <li
                              key={index}
                              className="flex items-start"
                              style={{ color: "hsl(var(--red-700))" }}
                            >
                              <span
                                className="mr-2 mt-1"
                                style={{ color: "hsl(var(--red-500))" }}
                              >
                                •
                              </span>
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                  {/* Job Responsibilities (if different from main responsibilities) */}
                  {selectedJob.job_responsibilities &&
                    selectedJob.job_responsibilities.length > 0 &&
                    JSON.stringify(selectedJob.job_responsibilities) !==
                      JSON.stringify(selectedJob.responsibilities) && (
                      <div
                        className="p-4 rounded-lg md:col-span-2"
                        style={{
                          backgroundColor: "hsl(var(--teal-50))",
                          borderColor: "hsl(var(--teal-200))",
                          borderWidth: "1px",
                          borderStyle: "solid",
                        }}
                      >
                        <h4
                          className="font-semibold mb-3 flex items-center"
                          style={{ color: "hsl(var(--teal-800))" }}
                        >
                          📝 Job Responsibilities
                        </h4>
                        <ul className="space-y-2">
                          {selectedJob.job_responsibilities.map(
                            (resp, index) => (
                              <li
                                key={index}
                                className="flex items-start"
                                style={{ color: "hsl(var(--teal-700))" }}
                              >
                                <span
                                  className="mr-2 mt-1"
                                  style={{ color: "hsl(var(--teal-500))" }}
                                >
                                  •
                                </span>
                                {resp}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}

                  {/* Skills (if different from requirements) */}
                  {selectedJob.skills &&
                    selectedJob.skills.length > 0 &&
                    JSON.stringify(selectedJob.skills) !==
                      JSON.stringify(selectedJob.requirements) && (
                      <div
                        className="p-4 rounded-lg md:col-span-2"
                        style={{
                          backgroundColor: "hsl(var(--orange-50))",
                          borderColor: "hsl(var(--orange-200))",
                          borderWidth: "1px",
                          borderStyle: "solid",
                        }}
                      >
                        <h4
                          className="font-semibold mb-3 flex items-center"
                          style={{ color: "hsl(var(--orange-800))" }}
                        >
                          🛠️ Technical Skills
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedJob.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 text-sm font-medium rounded-full"
                              style={{
                                backgroundColor: "hsl(var(--orange-100))",
                                color: "hsl(var(--orange-800))",
                              }}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Role Overview (if different from responsibilities) */}
                  {selectedJob.role_overview &&
                    selectedJob.role_overview.length > 0 &&
                    JSON.stringify(selectedJob.role_overview) !==
                      JSON.stringify(selectedJob.responsibilities) && (
                      <div
                        className="p-4 rounded-lg md:col-span-2"
                        style={{
                          backgroundColor: "hsl(var(--cyan-50))",
                          borderColor: "hsl(var(--cyan-200))",
                          borderWidth: "1px",
                          borderStyle: "solid",
                        }}
                      >
                        <h4
                          className="font-semibold mb-3 flex items-center"
                          style={{ color: "hsl(var(--cyan-800))" }}
                        >
                          🎭 Role Overview
                        </h4>
                        <ul className="space-y-2">
                          {selectedJob.role_overview.map((overview, index) => (
                            <li
                              key={index}
                              className="flex items-start"
                              style={{ color: "hsl(var(--cyan-700))" }}
                            >
                              <span
                                className="mr-2 mt-1"
                                style={{ color: "hsl(var(--cyan-500))" }}
                              >
                                •
                              </span>
                              {overview}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
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
          <ResumeUpload
            jobId={jobId || undefined}
            onMatchComplete={(results) => {
              console.log("Match analysis completed:", results);
              // Handle match results if needed
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
