import MainLayout from "@/components/layouts/MainLayout";
import JobList from "@/components/JobList";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function JobListPage() {
  return (
    <ProtectedRoute userType="student" redirectTo="/student-login">
      <MainLayout>
        <div className="min-h-screen bg-gray-50 py-8">
          <JobList />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
