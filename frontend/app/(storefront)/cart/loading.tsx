export default function CartLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="h-9 w-56 rounded-md bg-zinc-200" />
        <div className="mt-3 h-5 w-full max-w-xl rounded-md bg-zinc-200" />
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-4">
          {[0, 1, 2].map((item) => (
            <div
              className="grid gap-4 rounded-lg border border-zinc-200 bg-white p-4 sm:grid-cols-[112px_minmax(0,1fr)_170px]"
              key={item}
            >
              <div className="aspect-square rounded-md bg-zinc-200" />
              <div className="space-y-3">
                <div className="h-4 w-24 rounded-md bg-zinc-200" />
                <div className="h-5 w-2/3 rounded-md bg-zinc-200" />
                <div className="h-4 w-40 rounded-md bg-zinc-200" />
              </div>
              <div className="space-y-3 sm:justify-self-end">
                <div className="h-5 w-24 rounded-md bg-zinc-200" />
                <div className="h-10 w-36 rounded-md bg-zinc-200" />
              </div>
            </div>
          ))}
        </div>

        <div className="h-56 rounded-lg border border-zinc-200 bg-white p-5">
          <div className="h-6 w-32 rounded-md bg-zinc-200" />
          <div className="mt-5 space-y-4">
            <div className="h-4 rounded-md bg-zinc-200" />
            <div className="h-4 rounded-md bg-zinc-200" />
            <div className="h-5 rounded-md bg-zinc-200" />
          </div>
        </div>
      </div>
    </div>
  );
}
