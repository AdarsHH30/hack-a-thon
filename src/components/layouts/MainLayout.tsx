'use client'

import type React from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

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

            {/* User Menu */}
            <div className="flex items-center space-x-3">
              {user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-foreground">
                    {user.email}
                  </span>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      Sign Out
                    </Button>
                  </motion.div>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link href="/student-login">
                    <Button variant="outline" size="sm">
                      Student Login
                    </Button>
                  </Link>
                  <Link href="/admin-login">
                    <Button variant="outline" size="sm">
                      Admin Login
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
