import { AdminSectionPage } from "@/src/components/admin/admin-section-page";

export default function AdminReportsPage() {
  return (
    <AdminSectionPage
      columns={["Report", "Frequency", "Owner", "Status"]}
      description="Prepare operational reporting areas for revenue, orders, customers, and inventory analytics."
      rows={[
        ["Revenue Summary", "Monthly", "Finance", "Ready"],
        ["Inventory Health", "Daily", "Operations", "Ready"],
        ["Customer Growth", "Weekly", "Admin", "Queued"],
      ]}
      title="Reports"
    />
  );
}
