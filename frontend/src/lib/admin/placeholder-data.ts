export const PRODUCT_STATUS_OPTIONS = ["draft", "active", "inactive", "archived"] as const;

export type AdminMetric = {
  label: string;
  value: string;
  detail: string;
};

export type RecentOrder = {
  id: string;
  customer: string;
  status: string;
  total: string;
  placedAt: string;
};

export type LowStockProduct = {
  sku: string;
  name: string;
  category: string;
  stock: number;
  reorderLevel: number;
};

export const adminMetrics: AdminMetric[] = [
  {
    label: "Total Products",
    value: "12,480",
    detail: "Active catalog SKUs",
  },
  {
    label: "Total Categories",
    value: "42",
    detail: "Across 6 departments",
  },
  {
    label: "Total Orders",
    value: "86,214",
    detail: "Lifetime orders",
  },
  {
    label: "Total Revenue",
    value: "Rs. 4.82Cr",
    detail: "Confirmed revenue",
  },
  {
    label: "Low Stock Products",
    value: "128",
    detail: "Below reorder level",
  },
];

export const recentOrders: RecentOrder[] = [
  {
    id: "HM-10492",
    customer: "Sterling Facilities",
    status: "Processing",
    total: "Rs. 18,420",
    placedAt: "Today, 10:42 AM",
  },
  {
    id: "HM-10491",
    customer: "Northline Offices",
    status: "Confirmed",
    total: "Rs. 7,850",
    placedAt: "Today, 9:18 AM",
  },
  {
    id: "HM-10490",
    customer: "Greenpark School",
    status: "Out for delivery",
    total: "Rs. 24,600",
    placedAt: "Yesterday, 5:04 PM",
  },
  {
    id: "HM-10489",
    customer: "Apex Security Co.",
    status: "Delivered",
    total: "Rs. 13,290",
    placedAt: "Yesterday, 2:35 PM",
  },
];

export const lowStockProducts: LowStockProduct[] = [
  {
    sku: "HK-FC-010",
    name: "Floor Cleaner 5L",
    category: "Housekeeping",
    stock: 18,
    reorderLevel: 40,
  },
  {
    sku: "SF-HE-004",
    name: "Industrial Safety Helmet",
    category: "Safety",
    stock: 11,
    reorderLevel: 30,
  },
  {
    sku: "ST-NB-112",
    name: "A4 Spiral Notebook",
    category: "Stationery",
    stock: 24,
    reorderLevel: 75,
  },
  {
    sku: "SC-CCTV-020",
    name: "Indoor CCTV Camera",
    category: "Security",
    stock: 7,
    reorderLevel: 20,
  },
];

export const quickActions = [
  {
    label: "Add product",
    href: "/admin/products",
  },
  {
    label: "Review orders",
    href: "/admin/orders",
  },
  {
    label: "Update inventory",
    href: "/admin/inventory",
  },
  {
    label: "Export report",
    href: "/admin/reports",
  },
];
