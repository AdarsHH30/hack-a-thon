import type React from "react";
import Link from "next/link";

interface MainLayoutProps {
  children: React.ReactNode;
}

const InnomaticsLogo = () => {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 hover:opacity-80 transition-opacity"
    >
      {/* Logo Icon */}
      <div className="relative w-8 h-8">
        <div className="absolute inset-0 bg-gradient-to-br from-innomatics-red to-innomatics-purple rounded-lg"></div>
        <div className="absolute inset-1 bg-background rounded-md flex items-center justify-center">
          <div className="w-3 h-3 bg-gradient-to-br from-innomatics-blue to-innomatics-purple rounded-full"></div>
        </div>
      </div>

      {/* Logo Text */}
      <div className="flex flex-col">
        <span className="text-lg font-black text-foreground leading-none tracking-tight">
          INNOMATICS
        </span>
        <span className="text-xs font-medium text-innomatics-red leading-none tracking-wider">
          RESEARCH LABS
        </span>
      </div>
    </Link>
  );
};

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <InnomaticsLogo />

          {/* Navigation Items */}
          <div className="flex items-center gap-6">
            <Link
              href="/job-list"
              className="text-foreground hover:text-innomatics-blue transition-colors font-medium"
            >
              Jobs
            </Link>
            <Link
              href="/recruiter"
              className="text-foreground hover:text-innomatics-blue transition-colors font-medium"
            >
              For Employers
            </Link>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <Link href="/login">
                <button className="text-foreground hover:text-innomatics-blue transition-colors font-medium">
                  Sign In
                </button>
              </Link>
              <Link href="/signup">
                <button className="bg-innomatics-blue text-white px-4 py-2 rounded-lg font-medium hover:bg-innomatics-blue/90 transition-colors">
                  Sign Up
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-background border-t border-border mt-auto">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="md:col-span-1">
              <InnomaticsLogo />
              <p className="text-muted-foreground mt-4 text-sm">
                Empowering careers and connecting talent with opportunities
                through innovative technology and AI-driven matching.
              </p>
              <div className="flex gap-4 mt-4">
                <a
                  href="#"
                  className="text-muted-foreground hover:text-innomatics-blue transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-innomatics-blue transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* For Job Seekers */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">
                For Job Seekers
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/job-list"
                    className="text-muted-foreground hover:text-innomatics-blue transition-colors"
                  >
                    Browse Jobs
                  </Link>
                </li>
                <li>
                  <Link
                    href="/student"
                    className="text-muted-foreground hover:text-innomatics-blue transition-colors"
                  >
                    Student Portal
                  </Link>
                </li>
                <li>
                  <Link
                    href="/job-description"
                    className="text-muted-foreground hover:text-innomatics-blue transition-colors"
                  >
                    Career Advice
                  </Link>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-innomatics-blue transition-colors"
                  >
                    Resume Builder
                  </a>
                </li>
              </ul>
            </div>

            {/* For Employers */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">
                For Employers
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/recruiter"
                    className="text-muted-foreground hover:text-innomatics-blue transition-colors"
                  >
                    Post Jobs
                  </Link>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-innomatics-blue transition-colors"
                  >
                    Talent Search
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-innomatics-blue transition-colors"
                  >
                    Hiring Solutions
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-innomatics-blue transition-colors"
                  >
                    Enterprise
                  </a>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-innomatics-blue transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-innomatics-blue transition-colors"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-innomatics-blue transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-innomatics-blue transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">
              © 2025 Innomatics Research Labs. All rights reserved.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a
                href="#"
                className="text-muted-foreground hover:text-innomatics-blue transition-colors text-sm"
              >
                Help Center
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-innomatics-blue transition-colors text-sm"
              >
                Support
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-innomatics-blue transition-colors text-sm"
              >
                Accessibility
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
