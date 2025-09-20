import MainLayout from "@/components/layouts/MainLayout";
import JobList from "@/components/JobList";

export default function JobListPage() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <JobList />
      </div>
    </MainLayout>
  );
}
