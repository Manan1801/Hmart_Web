"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { deliveryApi } from "@/src/lib/api/endpoints";

const statusOptions = [
  { value: "accepted", label: "Accept", color: "bg-blue-600" },
  { value: "picked_up", label: "Picked Up", color: "bg-indigo-600" },
  { value: "in_transit", label: "In Transit", color: "bg-amber-600" },
  { value: "delivered", label: "Delivered", color: "bg-green-600" },
];

function OrdersSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div className="h-32 animate-pulse rounded-xl bg-zinc-200" key={i} />
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    assigned: "bg-zinc-100 text-zinc-700",
    accepted: "bg-blue-50 text-blue-700",
    picked_up: "bg-indigo-50 text-indigo-700",
    in_transit: "bg-amber-50 text-amber-700",
    delivered: "bg-green-50 text-green-700",
    failed: "bg-red-50 text-red-700",
  };

  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${colors[status] ?? "bg-zinc-100 text-zinc-700"}`}>
      {status.replace("_", " ")}
    </span>
  );
}

export default function DeliveryOrdersPage() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["delivery", "orders"],
    queryFn: deliveryApi.getOrders,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      deliveryApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delivery"] });
    },
  });

  const orders = data?.data?.orders ?? [];

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-950">My Orders</h1>
        <p className="mt-1 text-sm text-zinc-500">Manage your assigned deliveries.</p>
      </div>

      {isLoading ? (
        <OrdersSkeleton />
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-800">
          Failed to load orders.
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-10 text-center">
          <p className="text-sm font-medium text-zinc-600">No active deliveries assigned to you.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((delivery: any) => {
            const order = delivery.orders;
            return (
              <div className="rounded-xl border border-zinc-200 bg-white p-5" key={delivery.id}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-zinc-950">
                      Order #{order?.order_number ?? "—"}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      Total: ₹{order?.grand_total?.toFixed(2) ?? "0.00"}
                    </p>
                    {delivery.tracking_number && (
                      <p className="mt-1 text-xs text-zinc-400">Tracking: {delivery.tracking_number}</p>
                    )}
                  </div>
                  <StatusBadge status={delivery.status} />
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {statusOptions
                    .filter((opt) => {
                      const order_map: Record<string, number> = {
                        assigned: 0, accepted: 1, picked_up: 2, in_transit: 3, delivered: 4,
                      };
                      return (order_map[opt.value] ?? 0) > (order_map[delivery.status] ?? 0);
                    })
                    .map((opt) => (
                      <button
                        className={`rounded-full px-4 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 ${opt.color}`}
                        disabled={updateMutation.isPending}
                        key={opt.value}
                        onClick={() => updateMutation.mutate({ id: delivery.id, status: opt.value })}
                      >
                        {opt.label}
                      </button>
                    ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
