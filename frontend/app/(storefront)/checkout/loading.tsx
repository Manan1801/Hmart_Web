export default function CheckoutLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="h-9 w-44 rounded-md bg-zinc-200" />
        <div className="mt-3 h-5 w-full max-w-xl rounded-md bg-zinc-200" />
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <div className="h-24 rounded-lg border border-zinc-200 bg-white p-5">
            <div className="h-5 w-44 rounded-md bg-zinc-200" />
            <div className="mt-4 h-4 w-72 rounded-md bg-zinc-200" />
          </div>
          <div className="h-72 rounded-lg border border-zinc-200 bg-white p-5">
            <div className="h-6 w-48 rounded-md bg-zinc-200" />
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {[0, 1, 2, 3, 4, 5].map((item) => (
                <div className="h-10 rounded-md bg-zinc-200" key={item} />
              ))}
            </div>
          </div>
        </div>

        <div className="h-80 rounded-lg border border-zinc-200 bg-white p-5">
          <div className="h-6 w-36 rounded-md bg-zinc-200" />
          <div className="mt-6 space-y-4">
            {[0, 1, 2, 3, 4].map((item) => (
              <div className="h-4 rounded-md bg-zinc-200" key={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
