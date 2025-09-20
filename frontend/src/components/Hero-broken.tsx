import Link from "next/link";

export default function Hero() {
  return (
    <div style={{ 
      minHeight: "100vh", 
      backgroundColor: "#f3f4f6", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      padding: "1rem" 
    }}>
      <div style={{ 
        maxWidth: "80rem", 
        width: "100%", 
        backgroundColor: "white", 
        borderRadius: "1.5rem", 
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)", 
        overflow: "hidden" 
      }}>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "1fr 1fr", 
          gap: "0", 
          alignItems: "center", 
          minHeight: "600px" 
        }}>
          {/* Left Content */}
          <div style={{ padding: "4rem", display: "flex", flexDirection: "column", gap: "2rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <h1 style={{ 
                fontSize: "3.5rem", 
                fontWeight: "bold", 
                color: "#111827", 
                lineHeight: "1.1",
                margin: "0"
              }}>
                Automated Resume
                <br />
                <span style={{ color: "#374151" }}>Relevance Checker</span>
              </h1>

              <p style={{ 
                fontSize: "1.125rem", 
                color: "#6b7280", 
                maxWidth: "32rem", 
                lineHeight: "1.6",
                margin: "0"
              }}>
                AI-powered, consistent, and fast resume evaluation for job
                readiness.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <Link
                href="/student"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0.75rem 2rem",
                  backgroundColor: "#111827",
                  color: "white",
                  fontWeight: "600",
                  borderRadius: "0.5rem",
                  textDecoration: "none",
                  transition: "background-color 0.2s",
                  border: "none",
                  cursor: "pointer"
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = "#1f2937"}
                onMouseOut={(e) => e.target.style.backgroundColor = "#111827"}
              >
                Upload Resume
              </Link>
              <Link
                href="/recruiter"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0.75rem 2rem",
                  border: "2px solid #ef4444",
                  color: "#ef4444",
                  backgroundColor: "white",
                  fontWeight: "600",
                  borderRadius: "0.5rem",
                  textDecoration: "none",
                  transition: "background-color 0.2s",
                  cursor: "pointer"
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = "#fef2f2"}
                onMouseOut={(e) => e.target.style.backgroundColor = "white"}
              >
                Upload JD
              </Link>
            </div>
          </div>

          {/* Right Illustration */}
          <div style={{ 
            position: "relative", 
            padding: "3rem", 
            backgroundColor: "#f9fafb" 
          }}>
            <div style={{ 
              position: "relative", 
              width: "100%", 
              height: "500px", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center" 
            }}>
              
              {/* Document Stack (Left) */}
              <div style={{ position: "absolute", left: "0", top: "4rem" }}>
                <div style={{ position: "relative" }}>
                  {/* Multiple document papers stacked */}
                  <div style={{ 
                    width: "6rem", 
                    height: "8rem", 
                    backgroundColor: "white", 
                    border: "1px solid #e5e7eb", 
                    borderRadius: "0.5rem", 
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)", 
                    transform: "rotate(-6deg)" 
                  }}>
                    <div style={{ padding: "0.75rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                      <div style={{ width: "1rem", height: "1rem", backgroundColor: "#fb923c", borderRadius: "50%" }}></div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                        <div style={{ height: "0.25rem", backgroundColor: "#d1d5db", borderRadius: "0.125rem", width: "100%" }}></div>
                        <div style={{ height: "0.25rem", backgroundColor: "#d1d5db", borderRadius: "0.125rem", width: "75%" }}></div>
                        <div style={{ height: "0.25rem", backgroundColor: "#d1d5db", borderRadius: "0.125rem", width: "100%" }}></div>
                        <div style={{ height: "0.25rem", backgroundColor: "#d1d5db", borderRadius: "0.125rem", width: "50%" }}></div>
                      </div>
                    </div>
                  </div>
                  <div style={{ 
                    position: "absolute", 
                    top: "0.5rem", 
                    left: "0.5rem", 
                    width: "6rem", 
                    height: "8rem", 
                    backgroundColor: "white", 
                    border: "1px solid #e5e7eb", 
                    borderRadius: "0.5rem", 
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)", 
                    transform: "rotate(-3deg)" 
                  }}>
                    <div style={{ padding: "0.75rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                      <div style={{ width: "1rem", height: "1rem", backgroundColor: "#60a5fa", borderRadius: "50%" }}></div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                        <div style={{ height: "0.25rem", backgroundColor: "#d1d5db", borderRadius: "0.125rem", width: "100%" }}></div>
                        <div style={{ height: "0.25rem", backgroundColor: "#d1d5db", borderRadius: "0.125rem", width: "75%" }}></div>
                        <div style={{ height: "0.25rem", backgroundColor: "#d1d5db", borderRadius: "0.125rem", width: "100%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Central AI Circuit */}
              <div style={{ position: "relative", zIndex: "10" }}>
                <div style={{ 
                  width: "10rem", 
                  height: "10rem", 
                  backgroundColor: "#111827", 
                  borderRadius: "1rem", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  position: "relative", 
                  overflow: "hidden" 
                }}>
                  {/* AI Text */}
                  <div style={{ 
                    position: "relative", 
                    zIndex: "10", 
                    color: "white", 
                    fontSize: "2.5rem", 
                    fontWeight: "bold" 
                  }}>AI</div>
                  
                  {/* Connection points */}
                  <div style={{ 
                    position: "absolute", 
                    top: "-0.5rem", 
                    left: "50%", 
                    transform: "translateX(-50%)", 
                    width: "1rem", 
                    height: "1rem", 
                    backgroundColor: "#ef4444", 
                    borderRadius: "50%" 
                  }}></div>
                  <div style={{ 
                    position: "absolute", 
                    bottom: "-0.5rem", 
                    left: "50%", 
                    transform: "translateX(-50%)", 
                    width: "1rem", 
                    height: "1rem", 
                    backgroundColor: "#ef4444", 
                    borderRadius: "50%" 
                  }}></div>
                  <div style={{ 
                    position: "absolute", 
                    left: "-0.5rem", 
                    top: "50%", 
                    transform: "translateY(-50%)", 
                    width: "1rem", 
                    height: "1rem", 
                    backgroundColor: "#ef4444", 
                    borderRadius: "50%" 
                  }}></div>
                  <div style={{ 
                    position: "absolute", 
                    right: "-0.5rem", 
                    top: "50%", 
                    transform: "translateY(-50%)", 
                    width: "1rem", 
                    height: "1rem", 
                    backgroundColor: "#ef4444", 
                    borderRadius: "50%" 
                  }}></div>
                </div>

                {/* Floating elements around AI */}
                <div style={{ 
                  position: "absolute", 
                  top: "-2rem", 
                  left: "-2rem", 
                  width: "3rem", 
                  height: "3rem", 
                  backgroundColor: "white", 
                  borderRadius: "50%", 
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  border: "1px solid #e5e7eb" 
                }}>
                  <div style={{ width: "1.5rem", height: "1.5rem", backgroundColor: "#9ca3af", borderRadius: "50%" }}></div>
                </div>
                <div style={{ 
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
                  border: "1px solid #e5e7eb" 
                }}>
                  <div style={{ width: "1.5rem", height: "1.5rem", backgroundColor: "#9ca3af", borderRadius: "50%" }}></div>
                </div>
                <div style={{ 
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
                  border: "1px solid #e5e7eb" 
                }}>
                  <div style={{ width: "1.5rem", height: "1.5rem", backgroundColor: "#9ca3af", borderRadius: "50%" }}></div>
                </div>
                <div style={{ 
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
                  border: "1px solid #e5e7eb" 
                }}>
                  <div style={{ width: "1.5rem", height: "1.5rem", backgroundColor: "#9ca3af", borderRadius: "50%" }}></div>
                </div>
              </div>

              {/* Dashboard Cards (Right) */}
              <div style={{ position: "absolute", right: "0", top: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                {/* Top Dashboard */}
                <div style={{ 
                  width: "8rem", 
                  height: "6rem", 
                  backgroundColor: "white", 
                  borderRadius: "0.5rem", 
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)", 
                  border: "1px solid #e5e7eb", 
                  padding: "0.75rem" 
                }}>
                  <div style={{ fontSize: "0.75rem", fontWeight: "600", color: "#374151", marginBottom: "0.5rem" }}>Dashboard</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    <div style={{ width: "1rem", height: "1rem", backgroundColor: "#d1d5db", borderRadius: "50%" }}></div>
                    <div style={{ flex: "1", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                      <div style={{ height: "0.25rem", backgroundColor: "#e5e7eb", borderRadius: "0.125rem" }}></div>
                      <div style={{ height: "0.25rem", backgroundColor: "#e5e7eb", borderRadius: "0.125rem", width: "75%" }}></div>
                    </div>
                  </div>
                </div>

                {/* Analytics Dashboard */}
                <div style={{ 
                  width: "8rem", 
                  height: "7rem", 
                  backgroundColor: "#111827", 
                  borderRadius: "0.5rem", 
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)", 
                  padding: "0.75rem" 
                }}>
                  <div style={{ fontSize: "0.75rem", fontWeight: "600", color: "white", marginBottom: "0.5rem" }}>Analytics</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "0.25rem" }}>
                      <div style={{ width: "0.5rem", height: "1rem", backgroundColor: "#ef4444", borderRadius: "0.125rem" }}></div>
                      <div style={{ width: "0.5rem", height: "1.5rem", backgroundColor: "#ef4444", borderRadius: "0.125rem" }}></div>
                      <div style={{ width: "0.5rem", height: "0.75rem", backgroundColor: "#ef4444", borderRadius: "0.125rem" }}></div>
                      <div style={{ width: "0.5rem", height: "1.25rem", backgroundColor: "#ef4444", borderRadius: "0.125rem" }}></div>
                    </div>
                    <div style={{ width: "100%", height: "0.25rem", backgroundColor: "#374151", borderRadius: "0.125rem" }}></div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
              
              {/* Document Stack (Left) */}
              <div className="absolute left-0 top-16">
                <div className="relative">
                  {/* Multiple document papers stacked */}
                  <div className="w-24 h-32 bg-white border border-gray-200 rounded-lg shadow-md transform -rotate-6">
                    <div className="p-3 space-y-1">
                      <div className="w-4 h-4 bg-orange-400 rounded-full"></div>
                      <div className="space-y-1">
                        <div className="h-1 bg-gray-300 rounded w-full"></div>
                        <div className="h-1 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-1 bg-gray-300 rounded w-full"></div>
                        <div className="h-1 bg-gray-300 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-2 left-2 w-24 h-32 bg-white border border-gray-200 rounded-lg shadow-md transform -rotate-3">
                    <div className="p-3 space-y-1">
                      <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
                      <div className="space-y-1">
                        <div className="h-1 bg-gray-300 rounded w-full"></div>
                        <div className="h-1 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-1 bg-gray-300 rounded w-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Central AI Circuit */}
              <div className="relative z-10">
                <div className="w-40 h-40 bg-gray-900 rounded-2xl flex items-center justify-center relative overflow-hidden">
                  {/* Circuit pattern background */}
                  <div className="absolute inset-0 opacity-30">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <pattern id="circuit" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M0 10 L20 10 M10 0 L10 20" stroke="#4ade80" strokeWidth="0.5" fill="none"/>
                        <circle cx="10" cy="10" r="1" fill="#4ade80"/>
                      </pattern>
                      <rect width="100" height="100" fill="url(#circuit)"/>
                    </svg>
                  </div>
                  
                  {/* AI Text */}
                  <div className="relative z-10 text-white text-4xl font-bold">AI</div>
                  
                  {/* Connection points */}
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-red-500 rounded-full"></div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-red-500 rounded-full"></div>
                  <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-red-500 rounded-full"></div>
                  <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-red-500 rounded-full"></div>
                </div>

                {/* Floating elements around AI */}
                <div className="absolute -top-8 -left-8 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center border">
                  <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
                </div>
                <div className="absolute -top-8 -right-8 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center border">
                  <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
                </div>
                <div className="absolute -bottom-8 -left-8 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center border">
                  <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
                </div>
                <div className="absolute -bottom-8 -right-8 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center border">
                  <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
                </div>
              </div>

              {/* Dashboard Cards (Right) */}
              <div className="absolute right-0 top-8 space-y-4">
                {/* Top Dashboard */}
                <div className="w-32 h-24 bg-white rounded-lg shadow-lg border p-3">
                  <div className="text-xs font-semibold text-gray-700 mb-2">Dashboard</div>
                  <div className="flex items-center space-x-1">
                    <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                    <div className="flex-1 space-y-1">
                      <div className="h-1 bg-gray-200 rounded"></div>
                      <div className="h-1 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                </div>

                {/* Analytics Dashboard */}
                <div className="w-32 h-28 bg-gray-900 rounded-lg shadow-lg p-3">
                  <div className="text-xs font-semibold text-white mb-2">Analytics</div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-end space-x-1">
                      <div className="w-2 h-4 bg-red-500 rounded-sm"></div>
                      <div className="w-2 h-6 bg-red-500 rounded-sm"></div>
                      <div className="w-2 h-3 bg-red-500 rounded-sm"></div>
                      <div className="w-2 h-5 bg-red-500 rounded-sm"></div>
                    </div>
                    <div className="w-full h-1 bg-gray-700 rounded"></div>
                  </div>
                </div>
              </div>

              {/* Additional floating documents */}
              <div className="absolute top-4 left-1/4 w-20 h-26 bg-white rounded-lg shadow-md transform rotate-12 border">
                <div className="p-2 space-y-1">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <div className="space-y-1">
                    <div className="h-0.5 bg-gray-300 rounded w-full"></div>
                    <div className="h-0.5 bg-gray-300 rounded w-2/3"></div>
                    <div className="h-0.5 bg-gray-300 rounded w-full"></div>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-16 left-1/4 w-20 h-26 bg-white rounded-lg shadow-md transform -rotate-6 border">
                <div className="p-2 space-y-1">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <div className="space-y-1">
                    <div className="h-0.5 bg-gray-300 rounded w-full"></div>
                    <div className="h-0.5 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-0.5 bg-gray-300 rounded w-full"></div>
                  </div>
                </div>
              </div>

              {/* Connection lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 400">
                <defs>
                  <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.6"/>
                    <stop offset="100%" stopColor="#f97316" stopOpacity="0.3"/>
                  </linearGradient>
                </defs>
                <path d="M100 100 Q200 200 300 100" stroke="url(#lineGrad)" strokeWidth="2" fill="none" strokeDasharray="5,5"/>
                <path d="M100 300 Q200 200 300 300" stroke="url(#lineGrad)" strokeWidth="2" fill="none" strokeDasharray="5,5"/>
                <path d="M50 200 Q200 150 350 200" stroke="url(#lineGrad)" strokeWidth="2" fill="none" strokeDasharray="5,5"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
