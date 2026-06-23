export function AdminTopNav() {
  return (
    <header className="sticky top-0 z-20 hidden h-16 items-center justify-between border-b border-zinc-200 bg-white/95 px-6 backdrop-blur lg:flex">
      <div>
        <p className="text-sm font-medium text-zinc-500">Admin Console</p>
        <p className="text-lg font-semibold tracking-tight text-zinc-950">
          HMART Operations
        </p>
      </div>

      <div className="flex items-center gap-4">
        <label className="relative hidden xl:block">
          <span className="sr-only">Search admin records</span>
          <input
            className="h-10 w-80 rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-950"
            placeholder="Search products, orders, users"
            type="search"
          />
        </label>
        <div className="flex items-center gap-3 rounded-md border border-zinc-200 px-3 py-2">
          <div className="flex size-8 items-center justify-center rounded-full bg-zinc-950 text-xs font-semibold text-white">
            AD
          </div>
          <div>
            <p className="text-sm font-medium leading-4 text-zinc-950">Admin</p>
            <p className="text-xs leading-4 text-zinc-500">Enterprise access</p>
          </div>
        </div>
      </div>
    </header>
  );
}
