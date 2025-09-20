"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { memo } from "react";

const HeroPage = memo(function HeroPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20"
          animate={{
            background: [
              "linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1), rgba(236, 72, 153, 0.1))",
              "linear-gradient(45deg, rgba(147, 51, 234, 0.15), rgba(236, 72, 153, 0.15), rgba(59, 130, 246, 0.15))",
              "linear-gradient(45deg, rgba(236, 72, 153, 0.1), rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))",
              "linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1), rgba(236, 72, 153, 0.1))",
            ],
          }}
          transition={{
            duration: 8,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "loop",
          }}
        />

        {/* Glowing orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 6,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-300/30 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 8,
            ease: "easeInOut",
            repeat: Infinity,
            delay: 2,
          }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => {
          const left = (i * 23 + 17) % 100;
          const top = (i * 37 + 29) % 100;

          return (
            <motion.div
              key={i}
              className={`absolute w-2 h-2 rounded-full ${
                i % 3 === 0
                  ? "bg-blue-300/30"
                  : i % 3 === 1
                  ? "bg-purple-300/30"
                  : "bg-pink-300/30"
              }`}
              style={{
                left: `${left}%`,
                top: `${top}%`,
              }}
              animate={{
                y: [-20, -100],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: (i % 3) + 4,
                ease: "easeOut",
                repeat: Infinity,
                delay: (i % 5) * 0.5,
              }}
            />
          );
        })}
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20 p-12 text-center">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 mb-12"
          >
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Welcome to
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Career Portal
              </span>
            </h1>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Connect students with opportunities and help placements find the
              perfect candidates
            </p>
          </motion.div>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-md mx-auto"
          >
            {/* Student Login Button */}
            <Link href="/student-login" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-out hover:from-blue-700 hover:to-purple-700 border-2 border-transparent hover:border-white/20"
              >
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl">🎓</span>
                  <span className="text-lg">Login as Student</span>
                </div>
              </motion.button>
            </Link>

            {/* Placement Login Button */}
            <Link href="/placement-login" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-out hover:from-purple-700 hover:to-pink-700 border-2 border-transparent hover:border-white/20"
              >
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl">💼</span>
                  <span className="text-lg">Login as Placement</span>
                </div>
              </motion.button>
            </Link>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 pt-8 border-t border-gray-200"
          >
            <p className="text-sm text-gray-500">
              New to our platform? Contact your administrator for access
              credentials
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
});

export default HeroPage;
