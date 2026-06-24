"use client";

import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/src/lib/api/endpoints";
import { AdminPageHeader } from "@/src/components/admin/admin-page-header";

function StatCard({ label, value, detail }: { label: string; value: string | number; detail?: string }) {
  return (
    <article className="rounded-lg border border-zinc-200 bg-white p-5">
      <p className="text-sm font-medium text-zinc-500">{label}</p>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-zinc-950">{value}</p>
      {detail && <p className="mt-2 text-sm text-zinc-600">{detail}</p>}
    </article>
  );
}

function DashboardSkeleton() {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div className="h-28 animate-pulse rounded-lg bg-zinc-200" key={i} />
      ))}
    </section>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
}

export default function AdminDashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: adminApi.getDashboard,
  });

  const stats = data?.data;

  return (
    <>
      <AdminPageHeader
        description="Overview of HMART store performance — orders, revenue, customers, and inventory."
        title="Dashboard"
      />

      {isLoading ? (
        <DashboardSkeleton />
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-800">
          Failed to load dashboard data. Make sure the API server is running and you have admin access.
        </div>
      ) : stats ? (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total Revenue" value={formatCurrency(stats.totalRevenue)} detail="Lifetime" />
            <StatCard label="Total Orders" value={stats.totalOrders} detail={`${stats.pendingOrders} pending`} />
            <StatCard label="Total Products" value={stats.totalProducts} />
            <StatCard label="Total Customers" value={stats.totalCustomers} />
            <StatCard label="Categories" value={stats.totalCategories} />
            <StatCard label="Pending Orders" value={stats.pendingOrders} />
            <StatCard label="Completed Orders" value={stats.completedOrders} />
            <StatCard label="Cancelled Orders" value={stats.cancelledOrders} />
          </section>
        </>
      ) : null}
    </>
  );
}
