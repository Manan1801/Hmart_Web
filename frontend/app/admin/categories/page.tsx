import { AdminSectionPage } from "@/src/components/admin/admin-section-page";

export default function AdminCategoriesPage() {
  return (
    <AdminSectionPage
      columns={["Category", "Parent", "Products", "Status"]}
      description="Organize HMART departments and subcategories for buyer browsing and product discovery."
      rows={[
        ["Housekeeping", "Root", "3,420", "Active"],
        ["Stationery", "Root", "1,860", "Active"],
        ["Safety", "Root", "980", "Active"],
        ["Security", "Root", "730", "Active"],
      ]}
      title="Categories"
    />
  );
}
