import MainLayout from "@/components/layouts/MainLayout";
import JobDescription from "@/components/JobDescription";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function JobDescriptionPage() {
  return (
    <ProtectedRoute userType="student" redirectTo="/student-login">
      <MainLayout>
        <div className="min-h-screen bg-gray-50 py-8">
          <JobDescription />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}

