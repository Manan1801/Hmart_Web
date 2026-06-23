import { AdminSectionPage } from "@/src/components/admin/admin-section-page";

export default function AdminInventoryPage() {
  return (
    <AdminSectionPage
      columns={["SKU", "Product", "Available", "Reserved", "Status"]}
      description="Monitor current stock, reservations, and reorder exceptions across HMART inventory locations."
      rows={[
        ["HK-FC-010", "Floor Cleaner 5L", "18", "5", "Low stock"],
        ["SF-HE-004", "Industrial Safety Helmet", "11", "2", "Low stock"],
        ["ST-NB-112", "A4 Spiral Notebook", "24", "8", "Low stock"],
      ]}
      title="Inventory"
    />
  );
}
