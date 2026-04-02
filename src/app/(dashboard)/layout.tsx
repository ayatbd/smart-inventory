import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* 1. Sidebar stays fixed on the left */}
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* 2. Top Navbar */}
        <Navbar />

        {/* 3. Main Content Area */}
        <main className="p-8 max-w-[1600px] mx-auto w-full">{children}</main>
      </div>
    </div>
  );
}
