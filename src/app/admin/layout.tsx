import { Sidebar } from "@/components/admin/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col md:flex-row">
      <Sidebar />
      <main className="flex-1 md:pl-64 min-h-screen bg-muted/30">
        <div className="container mx-auto p-4 md:p-8 max-w-7xl animate-in fade-in duration-300">
          {children}
        </div>
      </main>
    </div>
  );
}
