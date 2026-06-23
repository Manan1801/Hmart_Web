import { AdminSectionPage } from "@/src/components/admin/admin-section-page";

export default function AdminProductsPage() {
  return (
    <AdminSectionPage
      columns={["Product", "Category", "SKU Count", "Status"]}
      description="Review the HMART product catalog structure before product management workflows are added."
      rows={[
        ["Floor Cleaner 5L", "Housekeeping", "4", "Active"],
        ["Industrial Safety Helmet", "Safety", "3", "Active"],
        ["Indoor CCTV Camera", "Security", "2", "Draft"],
      ]}
      title="Products"
    />
  );
}
