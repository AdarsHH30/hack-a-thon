"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAuth } from "./AuthProvider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import JDupload from "./JDupload";
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
}

export default function JobList() {
  const [jobDescriptions, setJobDescriptions] = useState<JobDescription[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { user } = useAuth();

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

  const loadJobDescriptions = async () => {
    setIsLoadingJobs(true);
    setHasError(false);

    try {
      const response = await fetch(`${API_BASE_URL}/api/get-jobs`);

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
        // Set empty array if API returns no jobs
        setJobDescriptions([]);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setHasError(true);
      // Use mock data only if there's an error, not if there are simply no jobs
      setJobDescriptions(mockJobs);
    } finally {
      setIsLoadingJobs(false);
    }
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <Card key={index} className="animate-pulse border-2">
          <CardHeader className="pb-4">
            <div className="bg-muted rounded-lg h-6 w-3/4 mb-2"></div>
            <div className="bg-muted rounded-md h-4 w-1/2"></div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-muted rounded-md h-3 w-20"></div>
              <div className="bg-muted rounded-md h-3 w-16"></div>
              <div className="bg-muted rounded-md h-3 w-24"></div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="bg-muted rounded-md h-3 w-full"></div>
              <div className="bg-muted rounded-md h-3 w-4/5"></div>
              <div className="bg-muted rounded-md h-3 w-3/5"></div>
            </div>
            <div className="flex space-x-2 mb-4">
              <div className="bg-muted rounded-full h-6 w-16"></div>
              <div className="bg-muted rounded-full h-6 w-20"></div>
              <div className="bg-muted rounded-full h-6 w-14"></div>
            </div>
            <div className="flex justify-between items-center">
              <div className="bg-muted rounded-md h-3 w-20"></div>
              <div className="bg-muted rounded-lg h-8 w-24"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // No jobs available component
  const NoJobsAvailable = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16 px-4"
    >
      <div className="max-w-md mx-auto">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-innomatics-blue/10 to-innomatics-purple/10 rounded-full flex items-center justify-center"
        >
          <div className="text-6xl">💼</div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-2xl font-bold text-foreground mb-4">
            No Job Opportunities Yet
          </h3>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            We&apos;re constantly working to bring you the best career
            opportunities. New positions are posted regularly, so check back
            soon or be the first to post a job opening!
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={loadJobDescriptions}
              className="px-6 py-3 bg-innomatics-blue text-background font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
            >
              <span>🔄</span>
              Refresh Jobs
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowUploadModal(true)}
              className="px-6 py-3 bg-innomatics-red text-background font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
            >
              <span>➕</span>
              Post First Job
            </motion.button>
          </div>
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-innomatics-blue/20 rounded-full animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-innomatics-purple/20 rounded-full animate-pulse delay-500"></div>
          <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-innomatics-red/30 rounded-full animate-pulse delay-1000"></div>
        </div>
      </div>
    </motion.div>
  );

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
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors group"
            >
              <span className="mr-2 group-hover:-translate-x-1 transition-transform">
                ←
              </span>
              Back to home
            </Link>
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-innomatics-blue/10 rounded-full flex items-center justify-center">
                    <span className="text-innomatics-blue font-semibold text-sm">
                      {(user?.user_metadata?.name ||
                        user?.email ||
                        "U")[0].toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {user?.user_metadata?.name || user?.email}
                  </span>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Link href="/student-login">
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover:bg-innomatics-blue/10"
                    >
                      Student Login
                    </Button>
                  </Link>
                  <Link href="/admin-login">
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover:bg-innomatics-purple/10"
                    >
                      Admin Login
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
            <span className="text-3xl">💼</span>
            Available Job Opportunities
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover amazing career opportunities from top companies and take
            the next step in your professional journey
          </p>
        </motion.div>

        {/* Stats Bar */}
        {!isLoadingJobs && jobDescriptions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border rounded-xl p-4 mb-6 flex items-center justify-between"
          >
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-innomatics-blue">
                  {jobDescriptions.length}
                </div>
                <div className="text-sm text-muted-foreground">Active Jobs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-innomatics-purple">
                  {new Set(jobDescriptions.map((job) => job.company)).size}
                </div>
                <div className="text-sm text-muted-foreground">Companies</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-innomatics-red">
                  {new Set(jobDescriptions.map((job) => job.location)).size}
                </div>
                <div className="text-sm text-muted-foreground">Locations</div>
              </div>
            </div>

            {/* Post Job Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowUploadModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-innomatics-red to-innomatics-red/90 text-background font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-center gap-2">
                <span>➕</span>
                <span>Post Job</span>
              </div>
            </motion.button>
          </motion.div>
        )}

        {/* Post Job Button (when no jobs) */}
        {!isLoadingJobs && jobDescriptions.length === 0 && !hasError && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex justify-center mb-6"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowUploadModal(true)}
              className="px-8 py-4 bg-gradient-to-r from-innomatics-red to-innomatics-red/90 text-background font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-center gap-2">
                <span>➕</span>
                <span>Post Your First Job</span>
              </div>
            </motion.button>
          </motion.div>
        )}

        {/* Content Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          {isLoadingJobs ? (
            <LoadingSkeleton />
          ) : jobDescriptions.length === 0 ? (
            <NoJobsAvailable />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobDescriptions.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:border-innomatics-blue/50 hover:-translate-y-1 group">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl font-bold text-foreground line-clamp-2 group-hover:text-innomatics-blue transition-colors">
                        {job.title}
                      </CardTitle>
                      <CardDescription className="text-lg font-semibold text-innomatics-blue">
                        {job.company}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center space-x-4 mb-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <span>📍</span>
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <span>💼</span>
                          {job.type}
                        </span>
                        {job.salary && (
                          <span className="flex items-center gap-1">
                            <span>💰</span>
                            {job.salary}
                          </span>
                        )}
                      </div>

                      <p className="text-foreground mb-4 leading-relaxed line-clamp-3">
                        {job.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-6">
                        {job.requirements.slice(0, 3).map((req, reqIndex) => (
                          <span
                            key={reqIndex}
                            className="px-3 py-1 bg-innomatics-blue/10 text-innomatics-blue text-xs font-medium rounded-full hover:bg-innomatics-blue/20 transition-colors"
                          >
                            {req}
                          </span>
                        ))}
                        {job.requirements.length > 3 && (
                          <span className="px-3 py-1 bg-muted text-muted-foreground text-xs font-medium rounded-full">
                            +{job.requirements.length - 3} more
                          </span>
                        )}
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <span>📅</span>
                          {job.postedDate}
                        </span>
                        <Link href={`/job-description?id=${job.id}`}>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-6 py-2 bg-gradient-to-r from-innomatics-blue to-innomatics-blue/90 text-background font-semibold rounded-lg hover:shadow-lg transition-all duration-300 text-sm"
                          >
                            View Details →
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
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => setShowUploadModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-card border rounded-2xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-foreground">
                    Upload New Job Description
                  </h2>
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ✕
                  </button>
                </div>

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
                    Cancel
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
