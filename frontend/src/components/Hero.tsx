import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <div className="bg-background">
      <div className="max-w-7xl mx-auto p-8">
        <div className="bg-card rounded-2xl shadow-lg p-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                  Automated Resume
                  <br />
                  Relevance Checker
                </h1>

                <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
                  AI-powered, consistent, and fast resume evaluation for job
                  readiness.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/student"
                  className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors text-lg"
                >
                  Upload Resume
                </Link>
                <Link
                  href="/recruiter"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-accent text-accent bg-card font-semibold rounded-lg hover:bg-accent/5 transition-colors text-lg"
                >
                  Upload JD
                </Link>
              </div>
            </div>

            {/* Right Illustration */}
            <div className="relative">
              <div className="relative w-full h-96 lg:h-[500px]">
                <Image
                  src="/images/ai-illustration.jpg"
                  alt="AI-powered resume processing illustration showing documents, AI chip, dashboards, and data visualization"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
