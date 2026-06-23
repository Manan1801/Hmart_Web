export const LOCAL_CART_STORAGE_KEY = "hmart.localCart.v1";
export const CART_MAX_QUANTITY = 999;

export type CartStorageItem = {
  variantId: string;
  quantity: number;
};

export type CartDisplayItem = {
  variantId: string;
  productId: string;
  productName: string;
  productSlug: string;
  brand: string | null;
  categoryName: string;
  sku: string;
  unit: string | null;
  price: number;
  quantity: number;
  availableStock: number;
  imageUrl: string | null;
  imageAlt: string | null;
  lineSubtotal: number;
  isAvailable: boolean;
};

export type CartSummary = {
  itemCount: number;
  totalQuantity: number;
  subtotal: number;
};

export type StorefrontCart = {
  items: CartDisplayItem[];
  summary: CartSummary;
};

export type CartActionResult = {
  status: "success" | "error";
  message: string;
  cart?: StorefrontCart;
};
