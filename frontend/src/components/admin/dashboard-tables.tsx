import Link from "next/link";
import {
  lowStockProducts,
  quickActions,
  recentOrders,
} from "@/src/lib/admin/placeholder-data";

export function RecentOrdersTable() {
  return (
    <section className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
      <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
        <h2 className="text-base font-semibold text-zinc-950">Recent Orders</h2>
        <Link className="text-sm font-medium text-zinc-950 underline" href="/admin/orders">
          View all
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-zinc-200 text-sm">
          <thead className="bg-zinc-50 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-5 py-3" scope="col">Order</th>
              <th className="px-5 py-3" scope="col">Customer</th>
              <th className="px-5 py-3" scope="col">Status</th>
              <th className="px-5 py-3" scope="col">Total</th>
              <th className="px-5 py-3" scope="col">Placed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {recentOrders.map((order) => (
              <tr className="text-zinc-700" key={order.id}>
                <td className="px-5 py-4 font-medium text-zinc-950">{order.id}</td>
                <td className="px-5 py-4">{order.customer}</td>
                <td className="px-5 py-4">
                  <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
                    {order.status}
                  </span>
                </td>
                <td className="px-5 py-4">{order.total}</td>
                <td className="px-5 py-4">{order.placedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function LowStockProductsTable() {
  return (
    <section className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
      <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
        <h2 className="text-base font-semibold text-zinc-950">
          Low Stock Products
        </h2>
        <Link
          className="text-sm font-medium text-zinc-950 underline"
          href="/admin/inventory"
        >
          Inventory
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-zinc-200 text-sm">
          <thead className="bg-zinc-50 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-5 py-3" scope="col">SKU</th>
              <th className="px-5 py-3" scope="col">Product</th>
              <th className="px-5 py-3" scope="col">Category</th>
              <th className="px-5 py-3" scope="col">Stock</th>
              <th className="px-5 py-3" scope="col">Reorder</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {lowStockProducts.map((product) => (
              <tr className="text-zinc-700" key={product.sku}>
                <td className="px-5 py-4 font-medium text-zinc-950">{product.sku}</td>
                <td className="px-5 py-4">{product.name}</td>
                <td className="px-5 py-4">{product.category}</td>
                <td className="px-5 py-4">{product.stock}</td>
                <td className="px-5 py-4">{product.reorderLevel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function QuickActionsPanel() {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-5">
      <h2 className="text-base font-semibold text-zinc-950">Quick Actions</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {quickActions.map((action) => (
          <Link
            className="flex h-12 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-950 hover:text-zinc-950"
            href={action.href}
            key={action.href}
          >
            {action.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
