import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/src/lib/auth/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Profile | HMART",
  description: "View and manage your HMART account.",
};

export default async function AccountPage() {
  const user = await requireUser("/account");
  const displayName =
    typeof user.user_metadata.full_name === "string"
      ? user.user_metadata.full_name
      : user.email?.split("@")[0] ?? "HMART User";
  const phone = user.user_metadata.phone ?? user.phone ?? null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-950">My Profile</h1>
        <p className="mt-1 text-sm text-zinc-500">
          View and manage your account information.
        </p>
      </div>

      {/* Profile card */}
      <section className="rounded-2xl border border-zinc-200 bg-white p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-xl font-bold text-green-700">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-lg font-semibold text-zinc-950">{displayName}</p>
            <p className="text-sm text-zinc-500">Buyer</p>
          </div>
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-zinc-50 p-4">
            <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">Email</dt>
            <dd className="mt-1 text-sm font-medium text-zinc-950">{user.email ?? "Not available"}</dd>
          </div>
          <div className="rounded-lg bg-zinc-50 p-4">
            <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">Phone</dt>
            <dd className="mt-1 text-sm font-medium text-zinc-950">{phone ?? "Not set"}</dd>
          </div>
          <div className="rounded-lg bg-zinc-50 p-4">
            <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">Full Name</dt>
            <dd className="mt-1 text-sm font-medium text-zinc-950">{displayName}</dd>
          </div>
          <div className="rounded-lg bg-zinc-50 p-4">
            <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">Account Status</dt>
            <dd className="mt-1">
              <span className="inline-flex rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
                Active
              </span>
            </dd>
          </div>
        </dl>
      </section>

      {/* Quick links */}
      <section className="mt-6 grid gap-3 sm:grid-cols-3">
        <Link className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-4 transition-colors hover:border-green-300" href="/orders">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
            <svg className="size-5 text-green-600" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-950">My Orders</p>
            <p className="text-xs text-zinc-500">Track & manage</p>
          </div>
        </Link>
        <Link className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-4 transition-colors hover:border-green-300" href="/contact">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
            <svg className="size-5 text-green-600" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" /></svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-950">Contact Support</p>
            <p className="text-xs text-zinc-500">Get help</p>
          </div>
        </Link>
        <Link className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-4 transition-colors hover:border-green-300" href="/refund-policy">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
            <svg className="size-5 text-green-600" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" /></svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-950">Refund Policy</p>
            <p className="text-xs text-zinc-500">Returns & refunds</p>
          </div>
        </Link>
      </section>
    </div>
  );
}
