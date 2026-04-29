import AdminHeader from "@/src/components/layout/AdminHeader";
import AdminSidebar from "@/src/components/layout/AdminSidebar";


// Note: Next 15+ may require returning standard body layout but here we are nested
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex bg-[#f8f9fa] dark:bg-black min-h-screen">
      <AdminSidebar />
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <AdminHeader />
        <main className="flex-1 p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

