export default function OrdersLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="h-9 w-40 rounded-md bg-zinc-200" />
        <div className="mt-3 h-5 w-full max-w-xl rounded-md bg-zinc-200" />
      </div>
      <section className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
        {[0, 1, 2, 3, 4].map((row) => (
          <div className="grid gap-4 border-b border-zinc-200 px-5 py-4 md:grid-cols-5" key={row}>
            {[0, 1, 2, 3, 4].map((cell) => (
              <div className="h-4 rounded-md bg-zinc-200" key={cell} />
            ))}
          </div>
        ))}
      </section>
    </div>
  );
}
