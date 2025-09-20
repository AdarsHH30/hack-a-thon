"use client";

import Card3D, { ExampleCard3D, AdvancedCard3D } from "@/components/Card3D";

export default function Card3DDemo() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            3D Hover Cards Demo
          </h1>
          <p className="text-lg text-gray-600">
            Hover over the cards to see the 3D effects
          </p>
        </div>

        {/* Simple Test Cards */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Basic 3D Cards</h2>
          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Test Card 1 */}
            <Card3D>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-white text-2xl">🚀</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Test Card 1
                </h3>
                <p className="text-gray-600">
                  Hover me to see the 3D rotation effect!
                </p>
              </div>
            </Card3D>

            {/* Test Card 2 */}
            <Card3D>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-white text-2xl">✨</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Test Card 2
                </h3>
                <p className="text-gray-600">
                  I have smooth animations too!
                </p>
              </div>
            </Card3D>

            {/* Test Card 3 */}
            <Card3D>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-white text-2xl">🎯</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Test Card 3
                </h3>
                <p className="text-gray-600">
                  3D effects with Framer Motion!
                </p>
              </div>
            </Card3D>
          </div>
        </section>

        {/* Example Card */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Example Card Component</h2>
          <div className="flex justify-center">
            <ExampleCard3D />
          </div>
        </section>

        {/* Advanced Cards */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Advanced 3D Cards</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            <AdvancedCard3D 
              tiltX={-12} 
              tiltY={12} 
              scale={1.1} 
              duration={0.5}
            >
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl font-bold">AI</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Premium Plan</h3>
                    <p className="text-gray-600">Advanced features</p>
                  </div>
                </div>
                <p className="text-gray-700">
                  This card has enhanced 3D effects with shine animation on hover.
                </p>
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <span className="text-2xl font-bold text-gray-900">$29/mo</span>
                  <button className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 rounded-lg font-medium">
                    Get Started
                  </button>
                </div>
              </div>
            </AdvancedCard3D>

            <AdvancedCard3D 
              tiltX={-8} 
              tiltY={8} 
              scale={1.06} 
              duration={0.3}
            >
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl">📊</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Analytics</h3>
                    <p className="text-gray-600">Business insights</p>
                  </div>
                </div>
                <p className="text-gray-700">
                  Comprehensive analytics with real-time data and reporting.
                </p>
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <span className="text-2xl font-bold text-gray-900">$49/mo</span>
                  <button className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-4 py-2 rounded-lg font-medium">
                    Try Now
                  </button>
                </div>
              </div>
            </AdvancedCard3D>
          </div>
        </section>

        {/* Debug Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Debug Info</h2>
          <div className="bg-white p-6 rounded-lg border">
            <p className="text-sm text-gray-600">
              If you can see this section, the page is loading correctly. 
              The 3D effects should work when you hover over the cards above.
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Framer Motion version: Check console for any errors.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}