import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk for getting all products
export const getProducts = createAsyncThunk("product/getProducts", async () => {
  const response = await axios.get("/api/product/show");
  return response.data;
});

// Thunk for getting a single product
export const detailProduct = createAsyncThunk(
  "product/detailProduct",
  async (productId) => {
    const response = await axios.get(
      `/api/product/detail?productId=${productId}`
    );

    console.log(response.data);
    return response.data;
  }
);

// Thunk for adding a product
export const addProduct = createAsyncThunk(
  "product/addProduct",
  async (formData) => {
    const response = await axios.post("/api/product/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }
);

// Thunk for updating a product
export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async ({ id, formData }) => {
    const response = await axios.put(`/api/product/update/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }
);

// Thunk for deleting a product
export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (id) => {
    await axios.delete(`/api/product/delete/${id}`);
    return id; // Return only the ID to simplify filtering
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [], // Ensure this is initialized as an array
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.products = action.payload;
        state.status = "succeeded";
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(detailProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(detailProduct.fulfilled, (state, action) => {
        state.products = action.payload;
        state.status = "succeeded";
      })
      .addCase(detailProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        if (Array.isArray(state.products)) {
          state.products.push(action.payload);
        } else {
          state.products = [action.payload]; // Reset if somehow it was not an array
        }
        state.status = "succeeded";
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        // if (Array.isArray(state.products)) {
        // if (index !== -1) {
        //   state.products[index] = action.payload;
        // }
        // const index =
        // } else {
        //   console.error("Products state is not an array");
        // }
        state.products.findIndex((product) => product.id === action.payload.id);
        state.status = "succeeded";
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(
          (product) => product.id !== action.payload // Using the id directly
        );
        // if (Array.isArray(state.products)) {
        // } else {
        //   console.error("Products state is not an array");
        // }
        state.status = "succeeded";
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default productSlice.reducer;
