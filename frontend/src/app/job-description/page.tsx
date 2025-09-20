import MainLayout from "@/components/layouts/MainLayout";
import JobDescription from "@/components/JobDescription";

export default function JobDescriptionPage() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <JobDescription />
      </div>
    </MainLayout>
  );
}

