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

  // Mock job data for fallback
  const mockJobs: JobDescription[] = [
    {
      id: "mock-1",
      title: "Frontend Developer",
      company: "TechCorp Solutions",
      location: "Hyderabad, India",
      type: "Full-time",
      postedDate: "Sep 15, 2025",
      description:
        "Join our dynamic team as a Frontend Developer! We're looking for passionate developers to build amazing user experiences with modern web technologies. You'll work on cutting-edge projects and collaborate with talented designers and engineers.",
      requirements: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Git"],
      salary: "₹8-12 LPA",
    },
    {
      id: "mock-2",
      title: "Data Scientist",
      company: "AI Innovations Ltd",
      location: "Bangalore, India",
      type: "Full-time",
      postedDate: "Sep 18, 2025",
      description:
        "Are you passionate about turning data into insights? We're seeking a talented Data Scientist to join our AI research team. You'll work on machine learning models, analyze complex datasets, and drive data-driven decision making.",
      requirements: [
        "Python",
        "Machine Learning",
        "TensorFlow",
        "SQL",
        "Statistics",
      ],
      salary: "₹15-20 LPA",
    },
    {
      id: "mock-3",
      title: "Backend Engineer",
      company: "CloudTech Systems",
      location: "Pune, India",
      type: "Full-time",
      postedDate: "Sep 12, 2025",
      description:
        "Build scalable backend systems that power millions of users! We're looking for a skilled Backend Engineer to design and implement robust APIs, manage databases, and ensure high-performance server-side applications.",
      requirements: ["Node.js", "Express", "MongoDB", "AWS", "Docker"],
      salary: "₹10-15 LPA",
    },
    {
      id: "mock-4",
      title: "UI/UX Designer",
      company: "Design Studio Pro",
      location: "Mumbai, India",
      type: "Full-time",
      postedDate: "Sep 20, 2025",
      description:
        "Create beautiful and intuitive user experiences! We're seeking a creative UI/UX Designer to craft stunning interfaces, conduct user research, and transform ideas into visually appealing designs that users love.",
      requirements: [
        "Figma",
        "Adobe Creative Suite",
        "User Research",
        "Prototyping",
        "Design Systems",
      ],
      salary: "₹6-10 LPA",
    },
    {
      id: "mock-5",
      title: "DevOps Engineer",
      company: "Infrastructure Inc",
      location: "Delhi NCR, India",
      type: "Full-time",
      postedDate: "Sep 10, 2025",
      description:
        "Automate, deploy, and scale! Join our DevOps team to build robust CI/CD pipelines, manage cloud infrastructure, and ensure seamless deployment processes. Help us maintain 99.9% uptime for our critical systems.",
      requirements: ["Kubernetes", "Docker", "Jenkins", "AWS", "Terraform"],
      salary: "₹12-18 LPA",
    },
    {
      id: "mock-6",
      title: "Mobile App Developer",
      company: "MobileTech Solutions",
      location: "Chennai, India",
      type: "Full-time",
      postedDate: "Sep 14, 2025",
      description:
        "Build the next generation of mobile applications! We're looking for a skilled Mobile App Developer to create stunning iOS and Android apps that delight users and drive business growth.",
      requirements: ["React Native", "Flutter", "iOS", "Android", "Firebase"],
      salary: "₹9-14 LPA",
    },
    {
      id: "mock-7",
      title: "Product Manager",
      company: "Innovation Labs",
      location: "Gurgaon, India",
      type: "Full-time",
      postedDate: "Sep 16, 2025",
      description:
        "Drive product strategy and execution! We're seeking an experienced Product Manager to lead cross-functional teams, define product roadmaps, and deliver innovative solutions that meet customer needs and business objectives.",
      requirements: [
        "Product Strategy",
        "Agile",
        "Analytics",
        "User Research",
        "Leadership",
      ],
      salary: "₹18-25 LPA",
    },
    {
      id: "mock-8",
      title: "Cybersecurity Analyst",
      company: "SecureNet Technologies",
      location: "Kolkata, India",
      type: "Full-time",
      postedDate: "Sep 11, 2025",
      description:
        "Protect our digital assets! Join our cybersecurity team to monitor threats, implement security measures, and ensure the safety of our systems and data. Be at the forefront of defending against cyber attacks.",
      requirements: [
        "Network Security",
        "Penetration Testing",
        "SIEM",
        "Risk Assessment",
        "Compliance",
      ],
      salary: "₹11-16 LPA",
    },
  ];

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
              job.full_text?.substring(0, 300) + "..." ||
              "No description available",
            requirements: structuredData.required_skills || [],
            salary: structuredData.salary_range || undefined,
          };
        });

        setJobDescriptions(transformedJobs);
      } else {
        console.error("API response unsuccessful:", data);
        // Fallback to mock data if API fails
        setJobDescriptions(mockJobs);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      // Fallback to mock data if fetch fails
      setJobDescriptions(mockJobs);
    } finally {
      setIsLoadingJobs(false);
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-innomatics-blue/5 via-background to-innomatics-purple/5" />
      <div className="relative z-10 max-w-7xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex justify-between items-center mb-4">
            <Link
              href="/"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
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
              <Link href="/recruiter">
                <Button className="bg-innomatics-blue hover:bg-innomatics-blue/90 text-background font-semibold px-6 py-2">
                  Post Job
                </Button>
              </Link>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            💼 Available Job Opportunities
          </h1>
          <p className="text-lg text-muted-foreground">
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
            className="px-6 py-3 bg-gradient-to-r from-innomatics-red to-innomatics-purple text-background font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
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
                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:border-innomatics-blue/50">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-foreground line-clamp-2">
                        {job.title}
                      </CardTitle>
                      <CardDescription className="text-lg font-semibold text-innomatics-blue">
                        {job.company}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-4 mb-4 text-sm text-muted-foreground">
                        <span>📍 {job.location}</span>
                        <span>💼 {job.type}</span>
                        {job.salary && <span>💰 {job.salary}</span>}
                      </div>

                      <p className="text-foreground mb-4 leading-relaxed line-clamp-3">
                        {job.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.requirements.slice(0, 3).map((req, reqIndex) => (
                          <span
                            key={reqIndex}
                            className="px-2 py-1 bg-innomatics-blue/10 text-innomatics-blue text-xs font-medium rounded-full"
                          >
                            {req}
                          </span>
                        ))}
                        {job.requirements.length > 3 && (
                          <span className="px-2 py-1 bg-muted text-muted-foreground text-xs font-medium rounded-full">
                            +{job.requirements.length - 3} more
                          </span>
                        )}
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">
                          📅 {job.postedDate}
                        </span>
                        <Link href={`/job-description?id=${job.id}`}>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 bg-innomatics-blue text-background font-semibold rounded-lg hover:bg-innomatics-blue/90 transition-colors text-sm"
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
                className="bg-card rounded-2xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-2xl font-bold text-foreground mb-6">
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
                    className="px-6 py-2 bg-muted text-foreground font-semibold rounded-lg hover:bg-muted/80 transition-colors"
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
