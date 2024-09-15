import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getCart = createAsyncThunk("cart/getCart", async (userId) => {
  const response = await axios.get(`/api/cart/show?userId=${userId}`);

  console.log(response.data);
  return response.data;
});

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/cart/add`, formData);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateCart = createAsyncThunk(
  "cart/updateCart",
  async ({ userId, productId, formData }) => {
    const response = await axios.put(
      `/api/cart/update/?userId=${userId}&productId=${productId}`,
      formData
    );
    return response.data;
  }
);

export const deleteFromCart = createAsyncThunk(
  "cart/deleteFromCart",
  async (id) => {
    await axios.delete(`/api/cart/delete/${id}`);
    return id;
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: [], // Ensure cart is an array
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getCart.fulfilled, (state, action) => {
        // state.cart = Array.isArray(action.payload) ? action.payload : []; // Ensure payload is an array
        state.cart = action.payload;
        state.status = "succeeded";
      })
      .addCase(getCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addToCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        if (Array.isArray(state.cart)) {
          state.cart.push(action.payload); // Push only if cart is an array
        }
        state.status = "succeeded";
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(updateCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateCart.fulfilled, (state, action) => {
        const updatedItem = action.payload;
        const index = state.cart.findIndex(
          (item) => item.id === updatedItem.id
        );
        if (index !== -1 && Array.isArray(state.cart)) {
          state.cart[index] = updatedItem;
        }
        state.status = "succeeded";
      })
      .addCase(updateCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deleteFromCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteFromCart.fulfilled, (state, action) => {
        state.cart = state.cart.filter((item) => item.id !== action.payload);
        state.status = "succeeded";
      })
      .addCase(deleteFromCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default cartSlice.reducer;
