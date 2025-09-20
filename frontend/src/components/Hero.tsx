import Link from "next/link";

export default function Hero() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-7xl w-full bg-white rounded-3xl shadow-xl overflow-hidden">
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

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/student"
                className="inline-flex items-center justify-center px-8 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
              >
                Upload Resume
              </Link>
              <Link
                href="/recruiter"
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-red-500 text-red-500 bg-white font-semibold rounded-lg hover:bg-red-50 transition-colors"
              >
                Upload JD
              </Link>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="relative p-8 lg:p-12 bg-gray-50">
            <div className="relative w-full h-[500px] flex items-center justify-center">
              
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
