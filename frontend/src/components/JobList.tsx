"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import JDupload from "./JDupload";

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
  const { user } = useAuth();

  // Check if user is admin (you can implement proper role checking later)
  const isAdmin =
    user?.user_metadata?.role === "admin" || user?.email?.includes("admin");

  // Load job descriptions on component mount
  useEffect(() => {
    loadJobDescriptions();
  }, []);

  // Logout function removed for testing
  // const handleLogout = async () => {
  //   await supabase.auth.signOut();
  // };

  const loadJobDescriptions = async () => {
    setIsLoadingJobs(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get-jobs`);
      
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
            title: structuredData.job_title || job.filename || "Untitled Position",
            company: structuredData.company || "Company Not Specified",
            location: structuredData.location || "Location Not Specified",
            type: structuredData.employment_type || "Full-time",
            postedDate: new Date(job.uploaded_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            }),
            description: structuredData.job_summary || job.full_text?.substring(0, 300) + "..." || "No description available",
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
            <Link
              href="/"
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              ← Back to home
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            💼 Available Job Opportunities
          </h1>
          <p className="text-lg text-gray-600">
            Discover amazing career opportunities from top companies
          </p>
        </motion.div>

        {/* Admin Upload Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-end mb-6"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowUploadModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-center gap-2">
              <span className="text-xl">📤</span>
              <span>Upload Job</span>
            </div>
          </motion.button>
        </motion.div>

        {/* Job Listings Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          {isLoadingJobs ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <CardHeader>
                    <div className="bg-gray-200 h-6 w-3/4 rounded mb-2"></div>
                    <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-200 h-20 w-full rounded mb-4"></div>
                    <div className="flex space-x-2">
                      <div className="bg-gray-200 h-6 w-16 rounded"></div>
                      <div className="bg-gray-200 h-6 w-20 rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobDescriptions.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:border-blue-300">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-gray-900 line-clamp-2">
                        {job.title}
                      </CardTitle>
                      <CardDescription className="text-lg font-semibold text-blue-600">
                        {job.company}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                        <span>📍 {job.location}</span>
                        <span>💼 {job.type}</span>
                        {job.salary && <span>💰 {job.salary}</span>}
                      </div>

                      <p className="text-gray-700 mb-4 leading-relaxed line-clamp-3">
                        {job.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.requirements.slice(0, 3).map((req, reqIndex) => (
                          <span
                            key={reqIndex}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                          >
                            {req}
                          </span>
                        ))}
                        {job.requirements.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                            +{job.requirements.length - 3} more
                          </span>
                        )}
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          📅 {job.postedDate}
                        </span>
                        <Link href={`/job-description?id=${job.id}`}>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-sm"
                          >
                            View Details
                          </motion.button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
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

                <JDupload
                  onUploadSuccess={(data) => {
                    console.log("Upload successful:", data);
                    // Refresh job descriptions after successful upload
                    loadJobDescriptions();
                    // Close modal after successful upload
                    setTimeout(() => {
                      setShowUploadModal(false);
                    }, 2000);
                  }}
                  onUploadError={(error) => {
                    console.error("Upload error:", error);
                    // Keep modal open on error so user can try again
                  }}
                />

                {/* Close Button */}
                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
