"use client";

import { motion } from "framer-motion";

interface JobDescription {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  postedDate: string;
  department?: string;
  salary?: string;
}

interface User {
  user_metadata?: {
    name?: string;
  };
  email?: string;
}

interface JobHeaderProps {
  selectedJob: JobDescription;
  user?: User;
}

export default function JobHeader({ selectedJob }: JobHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
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
  );
}
