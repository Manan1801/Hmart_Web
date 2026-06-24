export const ORDER_STATUS_OPTIONS = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUS_OPTIONS)[number];

export type BuyerOrderListItem = {
  id: string;
  orderNumber: string;
  status: string;
  currency: string;
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  shippingTotal: number;
  grandTotal: number;
  createdAt: string;
};

export type BuyerOrderItem = {
  id: string;
  variantId: string;
  skuSnapshot: string;
  productNameSnapshot: string;
  variantAttributesSnapshot: Record<string, unknown> | null;
  quantity: number;
  unitPrice: number;
  discountAmount: number;
  taxAmount: number;
  lineTotal: number;
};

export type BuyerOrderDetail = BuyerOrderListItem & {
  buyerId: string;
  notes: string | null;
  items: BuyerOrderItem[];
};
