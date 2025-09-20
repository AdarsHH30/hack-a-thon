import type React from "react";
import Link from "next/link";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-card shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-accent rounded-sm flex items-center justify-center">
                <div className="w-5 h-5 bg-white transform rotate-45"></div>
              </div>
              <div>
                <div className="font-bold text-lg text-foreground">
                  Innomatics
                </div>
                <div className="text-xs text-muted-foreground -mt-1 tracking-wider">
                  RESEARCH LABS
                </div>
              </div>
            </Link>

            {/* Dashboard Button */}
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-foreground">
                Dashboard
              </span>
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
