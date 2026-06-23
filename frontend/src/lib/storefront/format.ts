const currencyFormatter = new Intl.NumberFormat("en-IN", {
  currency: "INR",
  maximumFractionDigits: 2,
  style: "currency",
});

export function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

export function formatPriceRange(minPrice: number | null, maxPrice: number | null) {
  if (minPrice === null || maxPrice === null) {
    return "Price unavailable";
  }

  if (minPrice === maxPrice) {
    return formatCurrency(minPrice);
  }

  return `${formatCurrency(minPrice)} – ${formatCurrency(maxPrice)}`;
}
