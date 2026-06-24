import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/src/lib/auth/session";
import { getBuyerOrderById } from "@/src/lib/orders/orders";
import { formatCurrency } from "@/src/lib/storefront/format";

export const dynamic = "force-dynamic";

type OrderDetailPageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Order Details | HMART",
  description: "Review HMART order information, purchased items, and totals.",
};

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

function formatAttributes(attributes: Record<string, unknown> | null) {
  if (!attributes || Object.keys(attributes).length === 0) {
    return "Standard";
  }

  return Object.entries(attributes)
    .map(([key, value]) => `${key}: ${String(value)}`)
    .join(", ");
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const user = await requireUser(`/orders/${id}`);
  const { order, error } = await getBuyerOrderById(user.id, id);

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-red-900">
          <h1 className="text-base font-semibold">Unable to load order</h1>
          <p className="mt-2 text-sm leading-6">{error}</p>
        </div>
      </div>
    );
  }

  if (!order) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-zinc-500">
        <Link className="hover:text-zinc-950" href="/orders">
          Orders
        </Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-950">{order.orderNumber}</span>
      </nav>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
            {order.orderNumber}
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            Placed {formatDate(order.createdAt)}
          </p>
        </div>
        <span className="w-fit rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-700">
          {formatStatus(order.status)}
        </span>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section className="space-y-6">
          <div className="rounded-lg border border-zinc-200 bg-white p-5">
            <h2 className="text-lg font-semibold text-zinc-950">Shipping snapshot</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-6 text-zinc-600">
              {order.notes ?? "Shipping address snapshot was not stored for this order."}
            </p>
          </div>

          <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
            <div className="border-b border-zinc-200 px-5 py-4">
              <h2 className="text-lg font-semibold text-zinc-950">Items purchased</h2>
            </div>
            <div className="divide-y divide-zinc-200">
              {order.items.map((item) => (
                <article className="p-5" key={item.id}>
                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                    <div>
                      <h3 className="font-medium text-zinc-950">
                        {item.productNameSnapshot}
                      </h3>
                      <p className="mt-1 text-sm text-zinc-600">
                        {item.skuSnapshot} · {formatAttributes(item.variantAttributesSnapshot)}
                      </p>
                      <p className="mt-1 text-sm text-zinc-600">
                        Qty {item.quantity} × {formatCurrency(item.unitPrice)}
                      </p>
                    </div>
                    <p className="font-semibold text-zinc-950">
                      {formatCurrency(item.lineTotal)}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <aside className="h-fit rounded-lg border border-zinc-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-zinc-950">Totals</h2>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-zinc-600">Subtotal</dt>
              <dd className="font-medium text-zinc-950">
                {formatCurrency(order.subtotal)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-zinc-600">Discount</dt>
              <dd className="font-medium text-zinc-950">
                -{formatCurrency(order.discountTotal)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-zinc-600">Tax</dt>
              <dd className="font-medium text-zinc-950">
                {formatCurrency(order.taxTotal)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-zinc-600">Shipping</dt>
              <dd className="font-medium text-zinc-950">
                {formatCurrency(order.shippingTotal)}
              </dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-zinc-200 pt-3">
              <dt className="font-semibold text-zinc-950">Grand total</dt>
              <dd className="font-semibold text-zinc-950">
                {formatCurrency(order.grandTotal)}
              </dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}
