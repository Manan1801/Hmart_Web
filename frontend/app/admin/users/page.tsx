import { AdminSectionPage } from "@/src/components/admin/admin-section-page";

export default function AdminUsersPage() {
  return (
    <AdminSectionPage
      columns={["User", "Role", "Status", "Last Activity"]}
      description="View HMART buyer, admin, and delivery partner accounts before account management workflows are added."
      rows={[
        ["Aarav Mehta", "Buyer", "Active", "Today"],
        ["Priya Shah", "Admin", "Active", "Today"],
        ["Rohan Singh", "Delivery Partner", "Active", "Yesterday"],
      ]}
      title="Users"
    />
  );
}
