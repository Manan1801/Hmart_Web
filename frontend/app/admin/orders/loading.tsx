export default function AdminOrdersLoading() {
  return (
    <>
      <div className="mb-6">
        <div className="h-4 w-20 rounded-md bg-zinc-200" />
        <div className="mt-2 h-8 w-40 rounded-md bg-zinc-200" />
        <div className="mt-3 h-5 w-full max-w-2xl rounded-md bg-zinc-200" />
      </div>

      <section className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
        <div className="space-y-0 divide-y divide-zinc-200">
          {[0, 1, 2, 3, 4].map((row) => (
            <div
              className="grid gap-4 px-5 py-4 md:grid-cols-[1fr_1.2fr_1fr_1fr_1fr_1.2fr]"
              key={row}
            >
              {[0, 1, 2, 3, 4, 5].map((cell) => (
                <div className="h-4 rounded-md bg-zinc-200" key={cell} />
              ))}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
