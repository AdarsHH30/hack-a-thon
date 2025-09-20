"use client";

import AnimatedButton, { 
  PrimaryButton, 
  SecondaryButton, 
  OutlineButton, 
  GradientButton 
} from "@/components/AnimatedButton";

export default function ButtonDemo() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            Animated Gradient Buttons
          </h1>
          <p className="text-lg text-gray-600">
            Shadcn/ui style buttons with animated gradients and glow effects
          </p>
        </div>

        {/* Basic Variants */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Basic Variants</h2>
          <div className="flex flex-wrap gap-4 items-center justify-center">
            
            <PrimaryButton onClick={() => alert("Primary clicked!")}>
              Primary Button
            </PrimaryButton>

            <SecondaryButton onClick={() => alert("Secondary clicked!")}>
              Secondary Button
            </SecondaryButton>

            <OutlineButton onClick={() => alert("Outline clicked!")}>
              Outline Button
            </OutlineButton>

          </div>
        </section>

        {/* Sizes */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Button Sizes</h2>
          <div className="flex flex-wrap gap-4 items-center justify-center">
            
            <AnimatedButton variant="primary" size="sm">
              Small Button
            </AnimatedButton>

            <AnimatedButton variant="primary" size="md">
              Medium Button
            </AnimatedButton>

            <AnimatedButton variant="primary" size="lg">
              Large Button
            </AnimatedButton>

          </div>
        </section>

        {/* Custom Gradient Buttons */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Custom Gradient Buttons</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            
            <GradientButton gradient="from-blue-500 to-purple-600">
              Blue to Purple
            </GradientButton>

            <GradientButton gradient="from-pink-500 to-rose-600">
              Pink to Rose
            </GradientButton>

            <GradientButton gradient="from-green-500 to-teal-600">
              Green to Teal
            </GradientButton>

            <GradientButton gradient="from-orange-500 to-red-600">
              Orange to Red
            </GradientButton>

            <GradientButton gradient="from-indigo-500 to-purple-600">
              Indigo to Purple
            </GradientButton>

            <GradientButton gradient="from-cyan-500 to-blue-600">
              Cyan to Blue
            </GradientButton>

          </div>
        </section>

        {/* Buttons with Icons */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Buttons with Icons</h2>
          <div className="flex flex-wrap gap-4 items-center justify-center">
            
            <PrimaryButton>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Item
            </PrimaryButton>

            <SecondaryButton>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </SecondaryButton>

            <GradientButton gradient="from-green-500 to-emerald-600">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Success
            </GradientButton>

          </div>
        </section>

        {/* Special Effects Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Special Effects</h2>
          <div className="bg-gray-900 p-8 rounded-2xl">
            <div className="flex flex-wrap gap-6 items-center justify-center">
              
              <GradientButton 
                gradient="from-purple-500 via-pink-500 to-red-500"
                className="text-lg px-10 py-4"
              >
                ✨ Magic Button
              </GradientButton>

              <GradientButton 
                gradient="from-yellow-400 via-red-500 to-pink-500"
                className="text-lg px-10 py-4"
              >
                🔥 Fire Effect
              </GradientButton>

              <GradientButton 
                gradient="from-green-400 via-blue-500 to-purple-600"
                className="text-lg px-10 py-4"
              >
                🌈 Rainbow
              </GradientButton>

            </div>
          </div>
        </section>

        {/* Interactive Demo */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Interactive Demo</h2>
          <div className="bg-white p-8 rounded-2xl shadow-lg border">
            <div className="text-center space-y-6">
              <p className="text-gray-600">
                Hover over the buttons to see the animated gradient overlay, glow effect, and shimmer animation
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center">
                <AnimatedButton 
                  variant="primary" 
                  size="lg"
                  onClick={() => alert("Uploaded!")}
                >
                  Upload Resume
                </AnimatedButton>

                <AnimatedButton 
                  variant="outline" 
                  size="lg"
                  onClick={() => alert("Job Description uploaded!")}
                >
                  Upload JD
                </AnimatedButton>
              </div>

              <div className="pt-4">
                <GradientButton 
                  gradient="from-blue-600 via-purple-600 to-pink-600"
                  className="text-xl px-12 py-5"
                  onClick={() => alert("Processing started!")}
                >
                  🚀 Start Analysis
                </GradientButton>
              </div>
            </div>
          </div>
        </section>

        {/* Usage Instructions */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Usage</h2>
          <div className="bg-gray-100 p-6 rounded-lg">
            <pre className="text-sm text-gray-700 overflow-x-auto">
{`// Import the components
import AnimatedButton, { 
  PrimaryButton, 
  GradientButton 
} from "@/components/AnimatedButton";

// Basic usage
<PrimaryButton onClick={() => handleClick()}>
  Click Me
</PrimaryButton>

// Custom gradient
<GradientButton gradient="from-blue-500 to-purple-600">
  Custom Gradient
</GradientButton>

// With size and custom styling
<AnimatedButton 
  variant="primary" 
  size="lg"
  className="w-full"
>
  Full Width Button
</AnimatedButton>`}
            </pre>
          </div>
        </section>

      </div>
    </div>
  );
}