"use client";

import Card3D, { ExampleCard3D, AdvancedCard3D } from "@/components/Card3D";

export default function Card3DDemo() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            3D Hover Cards with Framer Motion
          </h1>
          <p className="text-lg text-gray-600">
            Hover over the cards to see smooth 3D rotation and scaling effects
          </p>
        </div>

        {/* Basic 3D Card */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Basic 3D Card
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ExampleCard3D />

            <Card3D className="max-w-sm">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">✓</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Success Card
                </h3>
                <p className="text-gray-600">
                  This card demonstrates the basic 3D hover effect with green
                  accent.
                </p>
              </div>
            </Card3D>

            <Card3D className="max-w-sm">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">!</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Alert Card
                </h3>
                <p className="text-gray-600">
                  Another example with red accent and warning icon.
                </p>
              </div>
            </Card3D>
          </div>
        </section>

        {/* Advanced 3D Cards */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Advanced 3D Cards
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <AdvancedCard3D
              tiltX={-10}
              tiltY={10}
              scale={1.1}
              duration={0.5}
              className="max-w-md"
            >
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">AI</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      AI Assistant
                    </h3>
                    <p className="text-gray-600">Premium Package</p>
                  </div>
                </div>
                <p className="text-gray-700">
                  Advanced AI-powered features with enhanced 3D interactions and
                  shine effects.
                </p>
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <span className="text-3xl font-bold text-gray-900">
                    $29/mo
                  </span>
                  <button className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-shadow">
                    Get Started
                  </button>
                </div>
              </div>
            </AdvancedCard3D>

            <AdvancedCard3D
              tiltX={-6}
              tiltY={6}
              scale={1.06}
              duration={0.3}
              className="max-w-md"
            >
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl">📊</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Analytics Pro
                    </h3>
                    <p className="text-gray-600">Business Package</p>
                  </div>
                </div>
                <p className="text-gray-700">
                  Comprehensive analytics dashboard with real-time insights and
                  reporting.
                </p>
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <span className="text-3xl font-bold text-gray-900">
                    $49/mo
                  </span>
                  <button className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-shadow">
                    Try Now
                  </button>
                </div>
              </div>
            </AdvancedCard3D>
          </div>
        </section>

        {/* Custom Cards Grid */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Custom 3D Cards
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: "Resume Builder",
                icon: "📄",
                color: "from-orange-400 to-red-500",
              },
              {
                title: "Job Matcher",
                icon: "🎯",
                color: "from-green-400 to-blue-500",
              },
              {
                title: "Skill Analyzer",
                icon: "🧠",
                color: "from-purple-400 to-pink-500",
              },
              {
                title: "Career Path",
                icon: "🚀",
                color: "from-blue-400 to-indigo-500",
              },
            ].map((item, index) => (
              <Card3D key={index}>
                <div className="text-center space-y-4">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-full flex items-center justify-center mx-auto`}
                  >
                    <span className="text-2xl">{item.icon}</span>
                  </div>
                  <h4 className="font-semibold text-gray-900">{item.title}</h4>
                  <p className="text-sm text-gray-600">
                    Hover to see the 3D effect in action
                  </p>
                </div>
              </Card3D>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
