import React, { Suspense } from "react";
import { getSubjectsData } from "@/lib/lessons";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const metadata = {
  title: "Admin Dashboard | គណិតវិទ្យាសាកលវិទ្យាល័យ",
};

async function AdminLoader() {
  const subjects = await getSubjectsData();
  return <AdminDashboard subjects={subjects} />;
}

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#fffafa] text-sm font-bold text-[#7e021f]">
          កំពុងផ្ទុកផ្ទាំងគ្រប់គ្រង Admin...
        </div>
      }
    >
      <AdminLoader />
    </Suspense>
  );
}
