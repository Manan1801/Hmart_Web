type AdminPageHeaderProps = {
  title: string;
  description: string;
};

export function AdminPageHeader({ title, description }: AdminPageHeaderProps) {
  return (
    <div className="mb-6">
      <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
        Admin
      </p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
        {title}
      </h1>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-600">
        {description}
      </p>
    </div>
  );
}
