"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navigationItems = [
  { label: "Dashboard", href: "/admin", marker: "D" },
  { label: "Products", href: "/admin/products", marker: "P" },
  { label: "Categories", href: "/admin/categories", marker: "C" },
  { label: "Inventory", href: "/admin/inventory", marker: "I" },
  { label: "Orders", href: "/admin/orders", marker: "O" },
  { label: "Inquiries", href: "/admin/inquiries", marker: "Q" },
  { label: "Users", href: "/admin/users", marker: "U" },
  { label: "Reports", href: "/admin/reports", marker: "R" },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/admin") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-zinc-950 text-white">
      <div className="border-b border-white/10 px-5 py-5">
        <Link className="block" href="/admin" onClick={onNavigate}>
          <span className="text-lg font-semibold tracking-tight">HMART</span>
          <span className="mt-1 block text-xs font-medium uppercase tracking-wide text-zinc-400">
            Admin Console
          </span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigationItems.map((item) => {
          const active = isActivePath(pathname, item.href);

          return (
            <Link
              className={`flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors ${
                active
                  ? "bg-white text-zinc-950"
                  : "text-zinc-300 hover:bg-white/10 hover:text-white"
              }`}
              href={item.href}
              key={item.href}
              onClick={onNavigate}
            >
              <span
                className={`flex size-7 shrink-0 items-center justify-center rounded border text-xs ${
                  active
                    ? "border-zinc-300 bg-zinc-100 text-zinc-950"
                    : "border-white/10 bg-white/5 text-zinc-300"
                }`}
              >
                {item.marker}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="rounded-md bg-white/5 p-3">
          <p className="text-sm font-medium text-white">Operations</p>
          <p className="mt-1 text-xs leading-5 text-zinc-400">
            Catalog, orders, inventory, and reporting.
          </p>
        </div>
      </div>
    </div>
  );
}

export function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-zinc-200 bg-white px-4 lg:hidden">
        <Link className="font-semibold tracking-tight text-zinc-950" href="/admin">
          HMART Admin
        </Link>
        <button
          aria-expanded={isOpen}
          aria-label="Open admin navigation"
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700"
          onClick={() => setIsOpen(true)}
          type="button"
        >
          Menu
        </button>
      </div>

      <aside className="fixed inset-y-0 left-0 hidden w-72 lg:block">
        <SidebarContent />
      </aside>

      {isOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close admin navigation"
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsOpen(false)}
            type="button"
          />
          <aside className="relative h-full w-72 max-w-[85vw] shadow-xl">
            <SidebarContent onNavigate={() => setIsOpen(false)} />
          </aside>
        </div>
      ) : null}
    </>
  );
}
