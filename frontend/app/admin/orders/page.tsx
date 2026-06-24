import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader } from "@/src/components/admin/admin-page-header";
import { OrderStatusForm } from "@/src/components/admin/orders/order-status-form";
import { getAdminOrdersFiltered } from "@/src/lib/admin/orders";
import { ORDER_STATUS_OPTIONS } from "@/src/lib/orders/types";
import { formatCurrency } from "@/src/lib/storefront/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Orders | HMART Admin",
  description: "Search, filter, and update HMART order status.",
};

type AdminOrdersPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getSearchParam(
  searchParams: Record<string, string | string[] | undefined>,
  key: string,
) {
  const value = searchParams[key];

  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatStatus(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default async function AdminOrdersPage({
  searchParams,
}: AdminOrdersPageProps) {
  const params = await searchParams;
  const search = getSearchParam(params, "q").trim();
  const status = getSearchParam(params, "status").trim();
  const { orders, error } = await getAdminOrdersFiltered({ search, status });

  return (
    <>
      <AdminPageHeader
        description="Search orders, filter by fulfillment status, and update order status."
        title="Orders"
      />

      <form
        action="/admin/orders"
        className="mb-6 grid gap-4 rounded-lg border border-zinc-200 bg-white p-5 md:grid-cols-[minmax(0,1fr)_220px_auto]"
      >
        <label className="block">
          <span className="text-sm font-medium text-zinc-800">Order number</span>
          <input
            className="mt-2 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none transition-colors focus:border-zinc-950"
            defaultValue={search}
            name="q"
            placeholder="Search order number"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-zinc-800">Status</span>
          <select
            className="mt-2 h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none transition-colors focus:border-zinc-950"
            defaultValue={status}
            name="status"
          >
            <option value="">All statuses</option>
            {ORDER_STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {formatStatus(option)}
              </option>
            ))}
          </select>
        </label>
        <div className="flex items-end gap-2">
          <button
            className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-950 px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
            type="submit"
          >
            Apply
          </button>
          {(search || status) ? (
            <Link
              className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
              href="/admin/orders"
            >
              Clear
            </Link>
          ) : null}
        </div>
      </form>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-red-900">
          <h2 className="text-base font-semibold">Unable to load orders</h2>
          <p className="mt-2 text-sm leading-6">{error}</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-10 text-center">
          <h2 className="text-lg font-semibold text-zinc-950">No orders found</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-600">
            Try changing the search or status filter.
          </p>
        </div>
      ) : (
        <section className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-200 text-sm">
              <thead className="bg-zinc-50 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                <tr>
                  <th className="px-5 py-3" scope="col">Order</th>
                  <th className="px-5 py-3" scope="col">Buyer</th>
                  <th className="px-5 py-3" scope="col">Status</th>
                  <th className="px-5 py-3" scope="col">Total</th>
                  <th className="px-5 py-3" scope="col">Placed</th>
                  <th className="px-5 py-3" scope="col">Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {orders.map((order) => (
                  <tr className="align-top text-zinc-700" key={order.id}>
                    <td className="px-5 py-4 font-medium text-zinc-950">
                      {order.orderNumber}
                    </td>
                    <td className="px-5 py-4">{order.buyerId.slice(0, 8)}</td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
                        {formatStatus(order.status)}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-medium text-zinc-950">
                      {formatCurrency(order.grandTotal)}
                    </td>
                    <td className="px-5 py-4">{formatDate(order.createdAt)}</td>
                    <td className="px-5 py-4">
                      <OrderStatusForm orderId={order.id} status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </>
  );
}
