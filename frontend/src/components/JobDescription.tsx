"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "./AuthProvider";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";

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

  // Load job descriptions on component mount
  useEffect(() => {
    loadJobDescriptions();
  }, []);

  const loadJobDescriptions = async () => {
    setIsLoadingJobs(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const mockJobs: JobDescription[] = [
        {
          id: "1",
          title: "Frontend Developer",
          company: "Tech Solutions Inc.",
          location: "Remote",
          type: "Full-time",
          postedDate: "2 days ago",
          salary: "$75,000 - $95,000",
          description: "Join our dynamic team as a Frontend Developer where you'll create amazing user experiences using modern web technologies. You'll work on cutting-edge projects and collaborate with a talented team of designers and developers to build responsive web applications that serve millions of users.",
          requirements: ["React.js", "TypeScript", "Tailwind CSS", "Next.js", "3+ years experience", "Git", "Responsive Design"]
        },
        {
          id: "2",
          title: "Data Scientist",
          company: "DataCorp Analytics",
          location: "San Francisco, CA",
          type: "Full-time",
          postedDate: "1 week ago",
          salary: "$110,000 - $140,000",
          description: "We're looking for a passionate Data Scientist to help us extract insights from large datasets and drive business decisions through advanced analytics and machine learning models. You'll work with cutting-edge tools and technologies to solve complex business problems.",
          requirements: ["Python", "Machine Learning", "SQL", "Statistics", "TensorFlow", "Pandas", "PhD preferred"]
        },
        {
          id: "3",
          title: "Product Manager",
          company: "StartupXYZ",
          location: "New York, NY",
          type: "Full-time",
          postedDate: "3 days ago",
          salary: "$90,000 - $120,000",
          description: "Lead product strategy and execution for our growing fintech platform. Work closely with engineering, design, and business stakeholders to deliver exceptional user experiences that drive business growth and customer satisfaction.",
          requirements: ["Product Management", "Agile", "Analytics", "Roadmap Planning", "5+ years experience", "Fintech experience"]
        },
        {
          id: "4",
          title: "Backend Engineer",
          company: "CloudTech Systems",
          location: "Austin, TX",
          type: "Full-time",
          postedDate: "5 days ago",
          salary: "$85,000 - $115,000",
          description: "Design and implement scalable backend systems that power our cloud infrastructure. Work with microservices, APIs, and distributed systems at scale while ensuring high performance and reliability.",
          requirements: ["Node.js", "AWS", "Docker", "MongoDB", "Microservices", "REST APIs", "System Design"]
        },
        {
          id: "5",
          title: "UX/UI Designer",
          company: "Design Studio Pro",
          location: "Los Angeles, CA",
          type: "Full-time",
          postedDate: "1 day ago",
          salary: "$70,000 - $90,000",
          description: "Create beautiful and intuitive user interfaces for web and mobile applications. Collaborate with product managers and developers to translate user needs into engaging digital experiences.",
          requirements: ["Figma", "Adobe Creative Suite", "User Research", "Prototyping", "Design Systems", "3+ years experience"]
        },
        {
          id: "6",
          title: "DevOps Engineer",
          company: "Infrastructure Inc.",
          location: "Seattle, WA",
          type: "Full-time",
          postedDate: "4 days ago",
          salary: "$95,000 - $125,000",
          description: "Build and maintain robust CI/CD pipelines and cloud infrastructure. Work with development teams to streamline deployment processes and ensure system reliability and scalability.",
          requirements: ["AWS/Azure", "Kubernetes", "Docker", "Jenkins", "Terraform", "Linux", "4+ years experience"]
        }
      ];
      
      setJobDescriptions(mockJobs);
      setIsLoadingJobs(false);
    }, 1000);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

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

  const handleFileUpload = async (file: File) => {
    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file only.");
      return;
    }

    setIsUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      setUploadedFile(file);
      setIsUploading(false);
      setShowSuccessMessage(true);
    }, 2000);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  if (selectedJob) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header with Back Button and Logout */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={handleBackToJobs}
                className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              >
                <span className="mr-2">←</span>
                Back to all jobs
              </button>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Welcome, {user?.user_metadata?.name || user?.email}
                </span>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="text-gray-600 hover:text-gray-800"
                >
                  Logout
                </Button>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Apply for {selectedJob.title}
            </h1>
            <p className="text-lg text-gray-600">
              at {selectedJob.company}
            </p>
          </motion.div>

          {/* Job Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100"
          >
            <div className="mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedJob.title}</h2>
                  <p className="text-xl text-blue-600 font-semibold">{selectedJob.company}</p>
                  <div className="flex items-center space-x-4 mt-2 text-gray-600">
                    <span>📍 {selectedJob.location}</span>
                    <span>💼 {selectedJob.type}</span>
                    <span>📅 {selectedJob.postedDate}</span>
                    {selectedJob.salary && <span>💰 {selectedJob.salary}</span>}
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Job Description</h3>
                <p className="text-gray-700 leading-relaxed">{selectedJob.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h3>
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
            </div>
          </motion.div>

          {/* Upload Resume Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
              📄 Upload Your Resume to Apply
            </h2>
            
            {!uploadedFile ? (
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                  isDragging
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
                }`}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onDragEnter={() => setIsDragging(true)}
                onDragLeave={() => setIsDragging(false)}
              >
                {isUploading ? (
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-lg font-medium text-blue-600">Uploading your resume...</p>
                    <p className="text-sm text-gray-500 mt-2">Please wait while we process your application</p>
                  </div>
                ) : (
                  <>
                    <div className="text-6xl mb-4">📁</div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      Drop your resume here
                    </h3>
                    <p className="text-gray-500 mb-4">
                      or click to browse files (PDF only)
                    </p>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileInput}
                      className="hidden"
                      id="resume-upload"
                    />
                    <label
                      htmlFor="resume-upload"
                      className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                    >
                      Choose Resume File
                    </label>
                  </>
                )}
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <div className="text-center">
                  <div className="text-5xl mb-4">🎉</div>
                  <h3 className="text-2xl font-bold text-green-800 mb-2">Application Submitted!</h3>
                  <p className="text-green-700 mb-4">
                    Your resume has been successfully uploaded for the <strong>{selectedJob.title}</strong> position.
                  </p>
                  <div className="bg-white border border-green-300 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-center">
                      <div className="text-2xl mr-3">📄</div>
                      <div>
                        <p className="font-semibold text-gray-900">{uploadedFile.name}</p>
                        <p className="text-sm text-gray-600">
                          {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-green-600 mb-4">
                    The hiring team at {selectedJob.company} will review your application and get back to you soon.
                  </p>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={handleBackToJobs}
                      className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Apply to More Jobs
                    </button>
                    <button
                      onClick={() => setUploadedFile(null)}
                      className="px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Upload Different Resume
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex justify-between items-center mb-4">
            <div></div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.user_metadata?.name || user?.email}
              </span>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="text-gray-600 hover:text-gray-800"
              >
                Logout
              </Button>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎯 Available Job Opportunities
          </h1>
          <p className="text-lg text-gray-600">
            Browse and select the positions that interest you
          </p>
        </motion.div>

        {/* Job Listings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
        >
          {isLoadingJobs ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-200 h-6 w-3/4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 w-1/2 rounded mb-2"></div>
                  <div className="bg-gray-200 h-20 w-full rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-6">
              {jobDescriptions.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-300 cursor-pointer"
                  onClick={() => handleJobSelect(job)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-1 hover:text-blue-600 transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-blue-600 font-medium text-lg">{job.company}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                        <span>📍 {job.location}</span>
                        <span>💼 {job.type}</span>
                        <span>📅 {job.postedDate}</span>
                        {job.salary && <span>💰 {job.salary}</span>}
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors ml-4"
                    >
                      View Details
                    </motion.button>
                  </div>

                  <p className="text-gray-700 mb-4 leading-relaxed line-clamp-3">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {job.requirements.slice(0, 4).map((req, reqIndex) => (
                      <span
                        key={reqIndex}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
                      >
                        {req}
                      </span>
                    ))}
                    {job.requirements.length > 4 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
                        +{job.requirements.length - 4} more
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

