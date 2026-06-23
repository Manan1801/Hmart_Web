import { AdminPageHeader } from "./admin-page-header";

type AdminSectionPageProps = {
  title: string;
  description: string;
  columns: string[];
  rows: string[][];
};

export function AdminSectionPage({
  title,
  description,
  columns,
  rows,
}: AdminSectionPageProps) {
  return (
    <>
      <AdminPageHeader description={description} title={title} />
      <section className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
        <div className="border-b border-zinc-200 px-5 py-4">
          <h2 className="text-base font-semibold text-zinc-950">{title}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-200 text-sm">
            <thead className="bg-zinc-50 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
              <tr>
                {columns.map((column) => (
                  <th className="px-5 py-3" key={column} scope="col">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {rows.map((row) => (
                <tr className="text-zinc-700" key={row.join("-")}>
                  {row.map((cell, index) => (
                    <td
                      className={`px-5 py-4 ${index === 0 ? "font-medium text-zinc-950" : ""}`}
                      key={`${cell}-${index}`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
