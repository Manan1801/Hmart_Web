"use client";

import { useState } from "react";
import type {
  StorefrontProductImage,
  StorefrontProductVariant,
} from "@/src/lib/storefront/types";
import { formatCurrency } from "@/src/lib/storefront/format";

export function ProductImageGallery({
  images,
  productName,
}: {
  images: StorefrontProductImage[];
  productName: string;
}) {
  const [selectedId, setSelectedId] = useState(
    images.find((image) => image.isPrimary)?.id ?? images[0]?.id ?? "",
  );
  const selectedImage =
    images.find((image) => image.id === selectedId) ?? images[0] ?? null;

  if (images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-100 text-sm text-zinc-500">
        No images available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100">
        {selectedImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            alt={selectedImage.altText ?? productName}
            className="aspect-square w-full object-cover"
            src={selectedImage.publicUrl}
          />
        ) : null}
      </div>

      {images.length > 1 ? (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {images.map((image) => (
            <button
              className={`overflow-hidden rounded-lg border ${
                image.id === selectedImage?.id
                  ? "border-zinc-950 ring-2 ring-zinc-950"
                  : "border-zinc-200"
              }`}
              key={image.id}
              onClick={() => setSelectedId(image.id)}
              type="button"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt={image.altText ?? productName}
                className="aspect-square w-full object-cover"
                src={image.publicUrl}
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function ProductVariantList({
  variants,
}: {
  variants: StorefrontProductVariant[];
}) {
  if (variants.length === 0) {
    return (
      <p className="text-sm text-zinc-600">No purchasable variants are available.</p>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200">
      <table className="min-w-full divide-y divide-zinc-200 text-sm">
        <thead className="bg-zinc-50 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
          <tr>
            <th className="px-4 py-3" scope="col">SKU</th>
            <th className="px-4 py-3" scope="col">Price</th>
            <th className="px-4 py-3" scope="col">Unit</th>
            <th className="px-4 py-3" scope="col">Availability</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 bg-white">
          {variants.map((variant) => (
            <tr className="text-zinc-700" key={variant.id}>
              <td className="px-4 py-3 font-medium text-zinc-950">{variant.sku}</td>
              <td className="px-4 py-3">{formatCurrency(variant.price)}</td>
              <td className="px-4 py-3">{variant.unit ?? "—"}</td>
              <td className="px-4 py-3">
                {variant.inStock ? (
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                    {variant.availableStock} available
                  </span>
                ) : (
                  <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600">
                    Out of stock
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ProductStockBadge({ inStock }: { inStock: boolean }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
        inStock
          ? "bg-emerald-50 text-emerald-700"
          : "bg-zinc-100 text-zinc-600"
      }`}
    >
      {inStock ? "In stock" : "Out of stock"}
    </span>
  );
}
