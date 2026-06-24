"use client";

import { useActionState } from "react";
import {
  initialAdminOrderActionState,
  updateAdminOrderStatusAction,
} from "@/src/lib/admin/order-actions";
import { ORDER_STATUS_OPTIONS } from "@/src/lib/orders/types";

function formatStatus(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function OrderStatusForm({
  orderId,
  status,
}: {
  orderId: string;
  status: string;
}) {
  const [state, formAction, isPending] = useActionState(
    updateAdminOrderStatusAction,
    initialAdminOrderActionState,
  );

  return (
    <form action={formAction} className="flex min-w-56 flex-col gap-2">
      <input name="orderId" type="hidden" value={orderId} />
      <div className="flex gap-2">
        <select
          className="h-9 rounded-md border border-zinc-300 bg-white px-2 text-sm outline-none transition-colors focus:border-zinc-950"
          defaultValue={status}
          name="status"
        >
          {ORDER_STATUS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {formatStatus(option)}
            </option>
          ))}
        </select>
        <button
          className="inline-flex h-9 items-center justify-center rounded-md bg-zinc-950 px-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300"
          disabled={isPending}
          type="submit"
        >
          {isPending ? "Saving..." : "Save"}
        </button>
      </div>
      {state.status !== "idle" ? (
        <p
          className={`text-xs ${
            state.status === "success" ? "text-emerald-700" : "text-red-700"
          }`}
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
