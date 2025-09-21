"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { memo } from "react";
import { ArrowRight, Building2, Zap, Target } from "lucide-react";

const InnomaticsHero = memo(function InnomaticsHero() {
  const features = [
    "AI-powered matching",
    "Automated screening",
    "Instant ranking",
    "Smart recommendations",
    "Data-driven decisions",
    "Placement efficiency",
  ];

  const partnerCompanies = [
    "Microsoft",
    "Google",
    "Amazon",
    "TCS",
    "Infosys",
    "Wipro",
    "Accenture",
    "Deloitte",
  ];

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-innomatics-blue/5 via-background to-innomatics-purple/5" />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 pt-20 pb-8">
        {/* Central Hero Section */}
        <div className="text-center max-w-6xl mx-auto">
          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12"
          >
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-foreground leading-[0.9] mb-6 tracking-tight text-balance">
              The fastest and most powerful
              <br />
              <span className="text-innomatics-red">
                platform for AI-powered
              </span>
              <br />
              resume evaluation
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-medium max-w-4xl mx-auto text-pretty">
              Transform your placement process with industry-leading AI models
              and tools. Serving teams across Hyderabad, Bangalore, Pune, and
              Delhi NCR.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto mb-16"
          >
            <Link href="/job-list">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-foreground text-background px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2"
              >
                Explore jobs
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>

            <Link href="/recruiter">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full border border-border bg-background text-foreground px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:bg-muted"
              >
                Post a job
              </motion.button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-20"
          >
            <p className="text-sm text-muted-foreground mb-8 font-medium tracking-wide uppercase">
              Trusted by placement teams at
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60">
              {partnerCompanies.map((company, i) => (
                <motion.div
                  key={company}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                  className="text-lg font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  {company}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Flagship Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Powerful AI models for resume evaluation with industry-leading
              accuracy and speed.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* AI Evaluation */}
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-card border border-border rounded-2xl p-8 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 bg-innomatics-red/10 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-innomatics-red" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                AI-Powered Evaluation
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Advanced AI models that analyze resumes with precision,
                extracting key skills, experience, and qualifications
                automatically.
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Resume parsing and analysis
              </div>
            </motion.div>

            {/* Smart Matching */}
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-card border border-border rounded-2xl p-8 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 bg-innomatics-purple/10 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-innomatics-purple" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Smart Job Matching
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Intelligent matching algorithm that connects the right
                candidates with the right opportunities based on comprehensive
                analysis.
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Candidate-job compatibility scoring
              </div>
            </motion.div>

            {/* Multi-City Support */}
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-card border border-border rounded-2xl p-8 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 bg-innomatics-blue/10 rounded-xl flex items-center justify-center mb-6">
                <Building2 className="w-6 h-6 text-innomatics-blue" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Multi-City Operations
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Seamlessly manage placement operations across Hyderabad,
                Bangalore, Pune, and Delhi NCR from a unified platform.
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Centralized team management
              </div>
            </motion.div>
          </div>
        </motion.div>

        <div className="relative mt-20 mb-20">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {features.map((feature, i) => {
              const delay = i * 0.2;
              const duration = 6 + (i % 3) * 2;
              const x = 10 + ((i * 25) % 80);
              const y = 20 + ((i * 30) % 60);

              return (
                <motion.div
                  key={feature}
                  className="absolute backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap shadow-lg border bg-card/80 text-card-foreground border-border/50"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                  }}
                  animate={{
                    y: [-5, -15, -5],
                    opacity: [0.6, 1, 0.6],
                  }}
                  transition={{
                    duration,
                    repeat: Number.POSITIVE_INFINITY,
                    delay,
                    ease: "easeInOut",
                  }}
                  whileHover={{
                    scale: 1.1,
                    opacity: 1,
                  }}
                >
                  {feature}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
});

export default InnomaticsHero;
