"use client";

import { useActionState } from "react";
import {
  deleteProductAction,
  initialProductActionState,
} from "@/src/lib/admin/product-actions";
import { ProductActionMessage } from "./product-action-message";
import { ProductSubmitButton } from "./product-submit-button";

export function ProductDeleteForm({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const [state, formAction] = useActionState(
    deleteProductAction,
    initialProductActionState,
  );

  return (
    <form
      action={formAction}
      className="space-y-3"
      onSubmit={(event) => {
        if (!confirm(`Delete ${productName}?`)) {
          event.preventDefault();
        }
      }}
    >
      <ProductActionMessage state={state} />
      <input name="id" type="hidden" value={productId} />
      <ProductSubmitButton
        label="Delete product"
        pendingLabel="Deleting..."
        variant="danger"
      />
    </form>
  );
}
