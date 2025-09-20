"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { memo } from "react";
import { GradientButton, OutlineButton } from "@/components/AnimatedButton";

const Hero = memo(function Hero() {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      {/* Animated Background Option 1: Glowing Gradient */}
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
        <motion.div
          className="absolute top-3/4 left-1/2 w-64 h-64 bg-pink-300/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.4, 0.3],
          }}
          transition={{
            duration: 7,
            ease: "easeInOut",
            repeat: Infinity,
            delay: 4,
          }}
        />
      </div>

      {/* Animated Background Option 2: SVG Grid */}
      <div className="absolute inset-0 opacity-40">
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id="grid"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <motion.path
                d="M 10 0 L 0 0 0 10"
                fill="none"
                stroke="rgba(99, 102, 241, 0.1)"
                strokeWidth="0.5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: [0, 0.5, 0] }}
                transition={{
                  duration: 4,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "loop",
                }}
              />
            </pattern>
            <pattern
              id="dots"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <motion.circle
                cx="10"
                cy="10"
                r="1"
                fill="rgba(147, 51, 234, 0.2)"
                animate={{
                  r: [0.5, 1.5, 0.5],
                  opacity: [0.1, 0.4, 0.1],
                }}
                transition={{
                  duration: 3,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "loop",
                }}
              />
            </pattern>
          </defs>

          <motion.rect
            width="100"
            height="100"
            fill="url(#grid)"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{
              duration: 5,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          />
          <motion.rect
            width="100"
            height="100"
            fill="url(#dots)"
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{
              duration: 6,
              ease: "easeInOut",
              repeat: Infinity,
              delay: 1,
            }}
          />
        </svg>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => {
          // Generate stable positions based on index to avoid re-renders
          const left = (i * 23 + 17) % 100; // Pseudo-random but stable
          const top = (i * 37 + 29) % 100; // Pseudo-random but stable

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
                duration: (i % 3) + 4, // Stable duration based on index
                ease: "easeOut",
                repeat: Infinity,
                delay: (i % 5) * 0.5, // Stable delay based on index
              }}
            />
          );
        })}
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20">
        <div className="grid lg:grid-cols-2 gap-0 items-center min-h-[600px]">
          {/* Left Content */}
          <div className="p-12 lg:p-16 space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Automated Resume
                <br />
                <span className="text-gray-800">Relevance Checker</span>
              </h1>

              <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
                AI-powered, consistent, and fast resume evaluation for job
                readiness.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <GradientButton
                gradient="from-gray-800 to-gray-900"
                href="/student"
                size="lg"
                className="text-center"
              >
                📄 Upload Resume
              </GradientButton>

              <OutlineButton
                href="/recruiter"
                size="lg"
                className="border-2 border-red-500 text-red-500 hover:bg-red-50 text-center"
              >
                💼 Upload JD
              </OutlineButton>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="relative p-12 bg-gray-50">
            <motion.div
              className="relative w-full h-[500px] flex items-center justify-center"
              animate={{
                y: [0, -10, 0],
                rotate: [0, 2, 0, -2, 0],
              }}
              transition={{
                duration: 4,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "loop",
              }}
            >
              {/* Document Stack (Left) */}
              <motion.div
                style={{ position: "absolute", left: "0", top: "4rem" }}
                animate={{
                  y: [0, -8, 0],
                  x: [0, 2, 0],
                }}
                transition={{
                  duration: 3.5,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "loop",
                  delay: 0.5,
                }}
              >
                <div className="relative">
                  {/* Multiple document papers stacked */}
                  <div className="w-24 h-32 bg-white border border-gray-300 rounded-lg shadow-md transform -rotate-6">
                    <div className="p-3 flex flex-col gap-1">
                      <div className="w-4 h-4 bg-orange-400 rounded-full"></div>
                      <div className="flex flex-col gap-1">
                        <div className="h-1 bg-gray-300 rounded-sm w-full"></div>
                        <div className="h-1 bg-gray-300 rounded-sm w-3/4"></div>
                        <div
                          style={{
                            height: "0.25rem",
                            backgroundColor: "#d1d5db",
                            borderRadius: "0.125rem",
                            width: "100%",
                          }}
                        ></div>
                        <div
                          style={{
                            height: "0.25rem",
                            backgroundColor: "#d1d5db",
                            borderRadius: "0.125rem",
                            width: "50%",
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Second paper behind */}
                  <div className="absolute top-2 left-2 w-24 h-32 bg-white border border-gray-300 rounded-lg shadow-md transform rotate-3">
                    <div className="p-3 flex flex-col gap-1">
                      <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
                      <div className="flex flex-col gap-1">
                        <div className="h-1 bg-gray-300 rounded-sm w-full"></div>
                        <div className="h-1 bg-gray-300 rounded-sm w-3/4"></div>
                        <div className="h-1 bg-gray-300 rounded-sm w-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Central AI Circuit */}
              <motion.div
                style={{ position: "relative", zIndex: "10" }}
                animate={{
                  rotate: [0, 3, 0, -3, 0],
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  duration: 5,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "loop",
                }}
              >
                <div
                  style={{
                    width: "10rem",
                    height: "10rem",
                    backgroundColor: "#111827",
                    borderRadius: "1rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* AI Text */}
                  <div
                    style={{
                      position: "relative",
                      zIndex: "10",
                      color: "white",
                      fontSize: "2.5rem",
                      fontWeight: "bold",
                    }}
                  >
                    AI
                  </div>

                  {/* Connection points */}
                  <div
                    style={{
                      position: "absolute",
                      top: "-0.5rem",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "1rem",
                      height: "1rem",
                      backgroundColor: "#ef4444",
                      borderRadius: "50%",
                    }}
                  ></div>
                  <div
                    style={{
                      position: "absolute",
                      bottom: "-0.5rem",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "1rem",
                      height: "1rem",
                      backgroundColor: "#ef4444",
                      borderRadius: "50%",
                    }}
                  ></div>
                  <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-red-500 rounded-full"></div>
                  <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-red-500 rounded-full"></div>
                </div>

                {/* Floating elements around AI */}
                <motion.div
                  className="absolute -top-8 -left-8 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center border border-gray-300"
                  animate={{
                    y: [0, -5, 0],
                    rotate: [0, 5, 0],
                  }}
                  transition={{
                    duration: 2.8,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "loop",
                    delay: 0.2,
                  }}
                >
                  <div
                    style={{
                      width: "1.5rem",
                      height: "1.5rem",
                      backgroundColor: "#9ca3af",
                      borderRadius: "50%",
                    }}
                  ></div>
                </motion.div>
                <motion.div
                  style={{
                    position: "absolute",
                    top: "-2rem",
                    right: "-2rem",
                    width: "3rem",
                    height: "3rem",
                    backgroundColor: "white",
                    borderRadius: "50%",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid #e5e7eb",
                  }}
                  animate={{
                    y: [0, -4, 0],
                    x: [0, 2, 0],
                  }}
                  transition={{
                    duration: 3.2,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "loop",
                    delay: 0.8,
                  }}
                >
                  <div
                    style={{
                      width: "1.5rem",
                      height: "1.5rem",
                      backgroundColor: "#9ca3af",
                      borderRadius: "50%",
                    }}
                  ></div>
                </motion.div>
                <motion.div
                  style={{
                    position: "absolute",
                    bottom: "-2rem",
                    left: "-2rem",
                    width: "3rem",
                    height: "3rem",
                    backgroundColor: "white",
                    borderRadius: "50%",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid #e5e7eb",
                  }}
                  animate={{
                    y: [0, -3, 0],
                    rotate: [0, -4, 0],
                  }}
                  transition={{
                    duration: 2.5,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "loop",
                    delay: 1.2,
                  }}
                >
                  <div
                    style={{
                      width: "1.5rem",
                      height: "1.5rem",
                      backgroundColor: "#9ca3af",
                      borderRadius: "50%",
                    }}
                  ></div>
                </motion.div>
                <motion.div
                  style={{
                    position: "absolute",
                    bottom: "-2rem",
                    right: "-2rem",
                    width: "3rem",
                    height: "3rem",
                    backgroundColor: "white",
                    borderRadius: "50%",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid #e5e7eb",
                  }}
                  animate={{
                    y: [0, -6, 0],
                    x: [0, -2, 0],
                  }}
                  transition={{
                    duration: 3.8,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "loop",
                    delay: 0.6,
                  }}
                >
                  <div
                    style={{
                      width: "1.5rem",
                      height: "1.5rem",
                      backgroundColor: "#9ca3af",
                      borderRadius: "50%",
                    }}
                  ></div>
                </motion.div>
              </motion.div>

              {/* Dashboard Cards (Right) */}
              <motion.div
                style={{
                  position: "absolute",
                  right: "0",
                  top: "2rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
                animate={{
                  y: [0, -6, 0],
                  x: [0, -3, 0],
                }}
                transition={{
                  duration: 4.2,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "loop",
                  delay: 1,
                }}
              >
                {/* Top Dashboard */}
                <div
                  style={{
                    width: "8rem",
                    height: "6rem",
                    backgroundColor: "white",
                    borderRadius: "0.5rem",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    border: "1px solid #e5e7eb",
                    padding: "0.75rem",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Dashboard
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                    }}
                  >
                    <div
                      style={{
                        width: "1rem",
                        height: "1rem",
                        backgroundColor: "#d1d5db",
                        borderRadius: "50%",
                      }}
                    ></div>
                    <div
                      style={{
                        flex: "1",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.25rem",
                      }}
                    >
                      <div
                        style={{
                          height: "0.25rem",
                          backgroundColor: "#e5e7eb",
                          borderRadius: "0.125rem",
                        }}
                      ></div>
                      <div
                        style={{
                          height: "0.25rem",
                          backgroundColor: "#e5e7eb",
                          borderRadius: "0.125rem",
                          width: "75%",
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Analytics Dashboard */}
                <div
                  style={{
                    width: "8rem",
                    height: "7rem",
                    backgroundColor: "#111827",
                    borderRadius: "0.5rem",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    padding: "0.75rem",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: "600",
                      color: "white",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Analytics
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.25rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-end",
                        gap: "0.25rem",
                      }}
                    >
                      <div
                        style={{
                          width: "0.5rem",
                          height: "1rem",
                          backgroundColor: "#ef4444",
                          borderRadius: "0.125rem",
                        }}
                      ></div>
                      <div
                        style={{
                          width: "0.5rem",
                          height: "1.5rem",
                          backgroundColor: "#ef4444",
                          borderRadius: "0.125rem",
                        }}
                      ></div>
                      <div
                        style={{
                          width: "0.5rem",
                          height: "0.75rem",
                          backgroundColor: "#ef4444",
                          borderRadius: "0.125rem",
                        }}
                      ></div>
                      <div
                        style={{
                          width: "0.5rem",
                          height: "1.25rem",
                          backgroundColor: "#ef4444",
                          borderRadius: "0.125rem",
                        }}
                      ></div>
                    </div>
                    <div
                      style={{
                        width: "100%",
                        height: "0.25rem",
                        backgroundColor: "#374151",
                        borderRadius: "0.125rem",
                      }}
                    ></div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Hero;
