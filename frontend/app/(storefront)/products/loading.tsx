export default function ProductsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-3">
        <div className="h-9 w-56 animate-pulse rounded bg-zinc-200" />
        <div className="h-4 w-96 max-w-full animate-pulse rounded bg-zinc-100" />
      </div>
      <div className="mb-8 h-36 animate-pulse rounded-2xl bg-zinc-100" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white" key={index}>
            <div className="aspect-square animate-pulse bg-zinc-100" />
            <div className="space-y-3 p-4">
              <div className="h-4 w-3/4 animate-pulse rounded bg-zinc-100" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-zinc-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
