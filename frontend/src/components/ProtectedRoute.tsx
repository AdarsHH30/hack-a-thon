"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { motion } from 'framer-motion';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'student' | 'admin';
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  requiredRole,
  redirectTo 
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      const redirectPath = redirectTo || (requiredRole === 'admin' ? '/admin-login' : '/student-login');
      router.push(redirectPath);
    } else if (!loading && user && requiredRole) {
      // Check if user has the required role
      const userRole = user.user_metadata?.role || (user.email?.includes('admin') ? 'admin' : 'student');
      
      if (userRole !== requiredRole) {
        // User doesn't have the required role
        if (requiredRole === 'admin') {
          router.push('/student-login?error=admin_required');
        } else {
          router.push('/admin-login?error=student_required');
        }
      }
    }
  }, [user, loading, router, requiredRole, redirectTo]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </motion.div>
      </div>
    );
  }

  // Don't render children if user is not authenticated
  if (!user) {
    return null;
  }

  // Check role if required
  if (requiredRole) {
    const userRole = user.user_metadata?.role || (user.email?.includes('admin') ? 'admin' : 'student');
    if (userRole !== requiredRole) {
      return null;
    }
  }

  return <>{children}</>;
}

