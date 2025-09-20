"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
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

export default function JobList() {
  const [jobDescriptions, setJobDescriptions] = useState<JobDescription[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newJobTitle, setNewJobTitle] = useState("");
  const [newJobCompany, setNewJobCompany] = useState("");
  const [newJobDescription, setNewJobDescription] = useState("");
  const [newJobRequirements, setNewJobRequirements] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { user } = useAuth();

  // Load job descriptions on component mount
  useEffect(() => {
    loadJobDescriptions();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

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
          description: "Join our dynamic team as a Frontend Developer where you'll create amazing user experiences using modern web technologies.",
          requirements: ["React.js", "TypeScript", "Tailwind CSS", "Next.js", "3+ years experience"]
        },
        {
          id: "2",
          title: "Data Scientist",
          company: "DataCorp Analytics",
          location: "San Francisco, CA",
          type: "Full-time",
          postedDate: "1 week ago",
          salary: "$110,000 - $140,000",
          description: "We're looking for a passionate Data Scientist to help us extract insights from large datasets and drive business decisions.",
          requirements: ["Python", "Machine Learning", "SQL", "Statistics", "TensorFlow"]
        },
        {
          id: "3",
          title: "Product Manager",
          company: "StartupXYZ",
          location: "New York, NY",
          type: "Full-time",
          postedDate: "3 days ago",
          salary: "$90,000 - $120,000",
          description: "Lead product strategy and execution for our growing fintech platform.",
          requirements: ["Product Management", "Agile", "Analytics", "Roadmap Planning", "5+ years experience"]
        }
      ];
      
      setJobDescriptions(mockJobs);
      setIsLoadingJobs(false);
    }, 1000);
  };

  const handleUploadJob = async () => {
    if (!newJobTitle || !newJobCompany || !newJobDescription) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      const newJob: JobDescription = {
        id: (jobDescriptions.length + 1).toString(),
        title: newJobTitle,
        company: newJobCompany,
        location: "Remote", // Default location
        type: "Full-time", // Default type
        postedDate: "Just now",
        description: newJobDescription,
        requirements: newJobRequirements.split(',').map(req => req.trim()).filter(req => req.length > 0)
      };

      setJobDescriptions(prev => [newJob, ...prev]);
      setIsUploading(false);
      setShowUploadModal(false);
      setNewJobTitle("");
      setNewJobCompany("");
      setNewJobDescription("");
      setNewJobRequirements("");
      setUploadedFile(null);
    }, 2000);
  };

  const handleFileUpload = async (file: File) => {
    if (file.type !== "application/pdf" && !file.type.includes("text")) {
      alert("Please upload a PDF or text file only.");
      return;
    }

    setUploadedFile(file);
    
    // If it's a text file, we could extract content here
    if (file.type.includes("text")) {
      const text = await file.text();
      // Simple parsing - in a real app, you'd have more sophisticated parsing
      const lines = text.split('\n').filter(line => line.trim());
      if (lines.length > 0) {
        setNewJobTitle(lines[0] || "");
        setNewJobCompany(lines[1] || "");
        setNewJobDescription(lines.slice(2).join('\n'));
      }
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-6">
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
            💼 Job Descriptions Management
          </h1>
          <p className="text-lg text-gray-600">
            Manage and upload job descriptions for placement opportunities
          </p>
          <div className="mt-4">
            <Link
              href="/"
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              ← Back to home
            </Link>
          </div>
        </motion.div>

        {/* Job Listings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Current Job Descriptions
            </h2>
            <span className="text-sm text-gray-500">
              {jobDescriptions.length} job{jobDescriptions.length !== 1 ? 's' : ''} posted
            </span>
          </div>

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
                  className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
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
                    <div className="flex space-x-2 ml-4">
                      <button className="px-4 py-2 bg-blue-100 text-blue-700 font-medium rounded-lg hover:bg-blue-200 transition-colors">
                        Edit
                      </button>
                      <button className="px-4 py-2 bg-red-100 text-red-700 font-medium rounded-lg hover:bg-red-200 transition-colors">
                        Delete
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {job.requirements.map((req, reqIndex) => (
                      <span
                        key={reqIndex}
                        className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full"
                      >
                        {req}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Upload Job Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowUploadModal(true)}
            className="px-8 py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl">📤</span>
              <span className="text-lg">Upload New Job</span>
            </div>
          </motion.button>
        </motion.div>

        {/* Upload Modal */}
        <AnimatePresence>
          {showUploadModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowUploadModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Upload New Job Description
                </h2>

                {/* File Upload Section */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Job Description File (PDF or Text)
                  </label>
                  <div
                    className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 ${
                      isDragging
                        ? "border-green-500 bg-green-50"
                        : "border-gray-300 hover:border-green-400 hover:bg-gray-50"
                    }`}
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onDragEnter={() => setIsDragging(true)}
                    onDragLeave={() => setIsDragging(false)}
                  >
                    {uploadedFile ? (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
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
                    ) : (
                      <>
                        <div className="text-4xl mb-4">📁</div>
                        <p className="text-gray-500 mb-4">
                          Drop your job description file here or click to browse
                        </p>
                        <input
                          type="file"
                          accept=".pdf,.txt,.doc,.docx"
                          onChange={handleFileInput}
                          className="hidden"
                          id="job-upload"
                        />
                        <label
                          htmlFor="job-upload"
                          className="inline-block px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
                        >
                          Choose File
                        </label>
                      </>
                    )}
                  </div>
                </div>

                {/* Manual Form Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Title *
                    </label>
                    <input
                      type="text"
                      value={newJobTitle}
                      onChange={(e) => setNewJobTitle(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., Frontend Developer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      value={newJobCompany}
                      onChange={(e) => setNewJobCompany(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., Tech Solutions Inc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Description *
                    </label>
                    <textarea
                      value={newJobDescription}
                      onChange={(e) => setNewJobDescription(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Describe the role, responsibilities, and what the candidate will be doing..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Requirements (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={newJobRequirements}
                      onChange={(e) => setNewJobRequirements(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., React.js, TypeScript, 3+ years experience"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 mt-8">
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleUploadJob}
                    disabled={isUploading}
                    className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploading ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Uploading...
                      </div>
                    ) : (
                      "Upload Job"
                    )}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
