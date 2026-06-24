import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { cartApi } from "../lib/api/endpoints";

interface CartItem {
  variantId: string;
  productName: string;
  productSlug: string;
  brand: string | null;
  sku: string;
  unit: string | null;
  price: number;
  quantity: number;
  availableStock: number;
  lineSubtotal: number;
}

interface CartState {
  items: CartItem[];
  itemCount: number;
  totalQuantity: number;
  subtotal: number;
  isLoading: boolean;
}

const initialState: CartState = {
  items: [],
  itemCount: 0,
  totalQuantity: 0,
  subtotal: 0,
  isLoading: false,
};

export const fetchCart = createAsyncThunk("cart/fetch", async () => {
  const res = await cartApi.get();
  return res.data.cart;
});

export const addToCart = createAsyncThunk(
  "cart/add",
  async ({ variantId, quantity }: { variantId: string; quantity: number }) => {
    const res = await cartApi.addItem(variantId, quantity);
    return res.data.cart;
  },
);

export const updateCartItem = createAsyncThunk(
  "cart/update",
  async ({ variantId, quantity }: { variantId: string; quantity: number }) => {
    const res = await cartApi.updateItem(variantId, quantity);
    return res.data.cart;
  },
);

export const removeCartItem = createAsyncThunk(
  "cart/remove",
  async (variantId: string) => {
    const res = await cartApi.removeItem(variantId);
    return res.data.cart;
  },
);

function applyCart(state: CartState, cart: any) {
  state.items = cart.items ?? [];
  state.itemCount = cart.summary?.itemCount ?? 0;
  state.totalQuantity = cart.summary?.totalQuantity ?? 0;
  state.subtotal = cart.summary?.subtotal ?? 0;
  state.isLoading = false;
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart(state) {
      state.items = [];
      state.itemCount = 0;
      state.totalQuantity = 0;
      state.subtotal = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => { state.isLoading = true; })
      .addCase(fetchCart.fulfilled, (state, action) => applyCart(state, action.payload))
      .addCase(fetchCart.rejected, (state) => { state.isLoading = false; })
      .addCase(addToCart.fulfilled, (state, action) => applyCart(state, action.payload))
      .addCase(updateCartItem.fulfilled, (state, action) => applyCart(state, action.payload))
      .addCase(removeCartItem.fulfilled, (state, action) => applyCart(state, action.payload));
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
