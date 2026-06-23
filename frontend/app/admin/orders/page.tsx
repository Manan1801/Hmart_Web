import { AdminSectionPage } from "@/src/components/admin/admin-section-page";

export default function AdminOrdersPage() {
  return (
    <AdminSectionPage
      columns={["Order", "Customer", "Status", "Total", "Placed"]}
      description="Track HMART order activity from checkout through payment, fulfillment, and delivery."
      rows={[
        ["HM-10492", "Sterling Facilities", "Processing", "Rs. 18,420", "Today"],
        ["HM-10491", "Northline Offices", "Confirmed", "Rs. 7,850", "Today"],
        [
          "HM-10490",
          "Greenpark School",
          "Out for delivery",
          "Rs. 24,600",
          "Yesterday",
        ],
      ]}
      title="Orders"
    />
  );
}
