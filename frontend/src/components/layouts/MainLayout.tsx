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
        <img
          src="/images/logo.png"
          alt="Innomatics Logo"
          className="w-full h-full object-contain"
        />
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
    </div>
  );
}
