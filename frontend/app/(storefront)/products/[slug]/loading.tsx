export default function ProductDetailLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 h-4 w-64 animate-pulse rounded bg-zinc-100" />
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="aspect-square animate-pulse rounded-2xl bg-zinc-100" />
        <div className="space-y-4">
          <div className="h-4 w-24 animate-pulse rounded bg-zinc-100" />
          <div className="h-10 w-3/4 animate-pulse rounded bg-zinc-200" />
          <div className="h-6 w-32 animate-pulse rounded bg-zinc-100" />
          <div className="h-24 w-full animate-pulse rounded bg-zinc-100" />
        </div>
      </div>
      <div className="mt-12 h-48 animate-pulse rounded-2xl bg-zinc-100" />
    </div>
  );
}
