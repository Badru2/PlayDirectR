import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getUser = createAsyncThunk("user/getUser", async () => {
  const response = await axios.get("/api/auth/profile", {
    headers: {
      Authorization: localStorage.getItem("token"), // Or use cookies
    },
  });

  console.log(response.data);
  return response.data;
});

const userSlice = createSlice({
  name: "user",
  initialState: {
    isAuthenticated: false,
    user: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(getUser.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export default userSlice.reducer;
