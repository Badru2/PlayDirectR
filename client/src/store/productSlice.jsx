import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk for getting all products
export const getProducts = createAsyncThunk("product/getProducts", async () => {
  const response = await axios.get("/api/product/show");

  console.log("this is the response", response.data.products);
  return response.data.products;
});

// Thunk for getting a single product
export const detailProduct = createAsyncThunk(
  "product/detailProduct",
  async (productId) => {
    const response = await axios.get(
      `/api/product/detail?productId=${productId}`
    );

    console.log("Fetching Detail Product: ", response.data.product);
    return response.data.product;
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
    console.log("Going to update", id, formData);
    const response = await axios.put(
      `/api/product/update/${id}`,
      { formData },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // console.log("Going to update", response.data);
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
    products: [], // Ensure this is an array
    productDetail: null, // Separate field for detailed product
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
        state.products = Array.isArray(action.payload) ? action.payload : []; // Ensure payload is an array
        console.log("this is the response", state.products);
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
        state.productDetail = action.payload;
        state.status = "succeeded";
        console.log("Detail Product", state.productDetail);
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
          state.products = [action.payload];
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
        if (Array.isArray(state.products)) {
          const index = state.products.findIndex(
            (product) => product.id === action.payload.id
          );
          if (index !== -1) {
            state.products[index] = action.payload;
          }
        } else {
          console.error("state.products is not an array");
        }
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
        // if (Array.isArray(state.products)) {
        state.products = state.products.filter(
          (product) => product.id !== action.payload
        );
        // } else {
        //   console.error("state.products is not an array");
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
