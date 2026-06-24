"use client";

import { useQuery } from "@tanstack/react-query";
import { deliveryApi } from "@/src/lib/api/endpoints";

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5">
      <p className="text-sm font-medium text-zinc-500">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <div className="h-24 animate-pulse rounded-xl bg-zinc-200" key={i} />
      ))}
    </div>
  );
}

export default function DeliveryDashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["delivery", "dashboard"],
    queryFn: deliveryApi.getDashboard,
  });

  const stats = data?.data;

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-950">Delivery Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-500">Your delivery performance at a glance.</p>
      </div>

      {isLoading ? (
        <DashboardSkeleton />
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-800">
          Failed to load dashboard. Ensure you are logged in as a delivery partner.
        </div>
      ) : stats ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard color="text-zinc-950" label="Total Assigned" value={stats.totalAssigned} />
          <StatCard color="text-amber-600" label="Pending" value={stats.pending} />
          <StatCard color="text-blue-600" label="In Transit" value={stats.inTransit} />
          <StatCard color="text-green-600" label="Delivered" value={stats.delivered} />
        </div>
      ) : null}
    </>
  );
}
