import type { ReactNode } from "react";
import { AdminSidebar } from "@/src/components/admin/admin-sidebar";
import { AdminTopNav } from "@/src/components/admin/admin-top-nav";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950">
      <AdminSidebar />
      <div className="lg:pl-72">
        <AdminTopNav />
        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
