"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { memo } from "react";
import {
  ArrowRight,
  Sparkles,
  Zap,
  Target,
  TrendingUp,
  Shield,
  Brain,
} from "lucide-react";

const TalentMatchHero = memo(function TalentMatchHero() {
  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Analysis",
      description:
        "Advanced LLM technology analyzes resumes against job descriptions with precision",
    },
    {
      icon: TrendingUp,
      title: "Instant Scoring",
      description:
        "Get comprehensive match scores and detailed skill gap analysis in seconds",
    },
    {
      icon: Shield,
      title: "Smart Recommendations",
      description:
        "Receive actionable insights and improvement suggestions powered by AI",
    },
  ];

  const stats = [
    { value: "95%", label: "Accuracy Rate" },
    { value: "<10s", label: "Analysis Time" },
    { value: "100+", label: "Skills Tracked" },
  ];

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      {/* Logo - Top Left */}
      <div className="absolute top-0 left-0 z-20 px-4 sm:px-6 lg:px-8 pt-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl blur-xl opacity-30"></div>
            <div className="relative bg-gradient-to-br from-red-600 to-red-700 p-3 rounded-2xl">
              <Brain className="w-8 h-8 text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">TalentMatch</h2>
            <p className="text-sm text-red-600 font-medium">
              AI-Powered Hiring
            </p>
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 pt-20 pb-16">
        {/* Central Hero Section */}
        <div className="text-center max-w-6xl mx-auto">
          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-full mb-8">
              <Zap className="w-4 h-4 text-red-600" />
              <span className="text-sm font-semibold text-red-600">
                Powered by Advanced AI
              </span>
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-gray-900 leading-[0.95] mb-8 tracking-tight">
              Match Resumes to Jobs
              <br />
              <span className="text-red-600">with AI Precision</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed font-medium max-w-4xl mx-auto">
              Leverage cutting-edge AI to analyze resumes, identify skill gaps,
              and get actionable recommendations in seconds. Transform your
              hiring and career development process.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto mb-20"
          >
            <Link href="/analyze" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-red-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:bg-red-700 hover:shadow-lg flex items-center justify-center gap-2"
              >
                Try AI Analyzer
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mb-20"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-red-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Three simple steps to get comprehensive AI-powered resume analysis
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + i * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-red-600 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="max-w-4xl mx-auto mt-24 text-center"
        >
          <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-3xl p-12 text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Hiring?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of recruiters and candidates using AI-powered
              analysis
            </p>
            <Link href="/analyze">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-red-600 px-10 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-300 inline-flex items-center gap-2"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
});

export default TalentMatchHero;
