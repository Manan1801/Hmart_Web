"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/src/lib/api/client";
import { AdminPageHeader } from "@/src/components/admin/admin-page-header";

const statusColors: Record<string, string> = {
  open: "bg-amber-50 text-amber-700",
  in_progress: "bg-blue-50 text-blue-700",
  resolved: "bg-green-50 text-green-700",
  closed: "bg-zinc-100 text-zinc-600",
};

export default function AdminInquiriesPage() {
  const [filter, setFilter] = useState<string>("");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "inquiries", filter],
    queryFn: () =>
      api
        .get("/admin/inquiries", { params: filter ? { status: filter } : undefined })
        .then((r) => r.data),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch(`/admin/inquiries/${id}/status`, { status }).then((r) => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "inquiries"] }),
  });

  const inquiries = data?.data?.inquiries ?? [];
  const totalCount = data?.data?.totalCount ?? 0;

  return (
    <>
      <AdminPageHeader
        description="Customer inquiries, complaints, and feedback from the Contact Us form."
        title="Inquiries & Complaints"
      />

      {/* Filters */}
      <div className="mb-4 flex items-center gap-2">
        {["", "open", "in_progress", "resolved", "closed"].map((s) => (
          <button
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === s ? "bg-zinc-950 text-white" : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
            }`}
            key={s}
            onClick={() => setFilter(s)}
          >
            {s === "" ? "All" : s.replace("_", " ")}
          </button>
        ))}
        <span className="ml-auto text-xs text-zinc-500">{totalCount} total</span>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div className="h-28 animate-pulse rounded-lg bg-zinc-200" key={i} />
          ))}
        </div>
      ) : inquiries.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-10 text-center">
          <p className="text-sm text-zinc-600">No inquiries found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {inquiries.map((inquiry: any) => (
            <div className="rounded-lg border border-zinc-200 bg-white p-5" key={inquiry.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${statusColors[inquiry.status] ?? statusColors.open}`}>
                      {inquiry.status.replace("_", " ")}
                    </span>
                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-600">
                      {inquiry.type}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-zinc-950">{inquiry.name}</p>
                  <p className="text-xs text-zinc-500">{inquiry.email}{inquiry.phone ? ` · ${inquiry.phone}` : ""}</p>
                  {inquiry.order_reference && (
                    <p className="mt-1 text-xs text-zinc-400">Order ref: {inquiry.order_reference}</p>
                  )}
                  <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-700">{inquiry.message}</p>
                  {inquiry.image_url && (
                    <a className="mt-2 inline-block text-xs text-green-700 underline" href={inquiry.image_url} rel="noopener" target="_blank">
                      View attachment
                    </a>
                  )}
                  <p className="mt-2 text-[10px] text-zinc-400">
                    {new Date(inquiry.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                  </p>
                </div>

                {/* Status actions */}
                <div className="flex flex-col gap-1">
                  {inquiry.status !== "resolved" && (
                    <button
                      className="rounded-md bg-green-600 px-2.5 py-1 text-[10px] font-semibold text-white hover:bg-green-700"
                      onClick={() => updateStatus.mutate({ id: inquiry.id, status: "resolved" })}
                    >
                      Resolve
                    </button>
                  )}
                  {inquiry.status === "open" && (
                    <button
                      className="rounded-md bg-blue-600 px-2.5 py-1 text-[10px] font-semibold text-white hover:bg-blue-700"
                      onClick={() => updateStatus.mutate({ id: inquiry.id, status: "in_progress" })}
                    >
                      In Progress
                    </button>
                  )}
                  {inquiry.status !== "closed" && (
                    <button
                      className="rounded-md bg-zinc-200 px-2.5 py-1 text-[10px] font-semibold text-zinc-700 hover:bg-zinc-300"
                      onClick={() => updateStatus.mutate({ id: inquiry.id, status: "closed" })}
                    >
                      Close
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
