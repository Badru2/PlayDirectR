import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createAdmin = createAsyncThunk(
  "admin/createAdmin",
  async (formData) => {
    try {
      const response = await axios.post(`/api/auth/register`, formData);
      return response.data;
    } catch (error) {
      console.error("Error creating admin:", error);
    }
  }
);

export const getAdmins = createAsyncThunk("admin/getAdmins", async () => {
  const response = await axios.get(`/api/auth/get/admin`);

  console.log(response.data);
  return response.data;
});

export const deleteAdmin = createAsyncThunk("admin/deleteAdmin", async (id) => {
  try {
    const response = await axios.delete(`/api/auth/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting admin:", error);
  }
});

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    admins: [],
    status: "idle",
    error: null,
  },
  reducers: {
    createAdmin: (state, action) => {
      state.admins.push(action.payload);
    },
    getAdmins: (state, action) => {
      state.admins = action.payload;
    },
    deleteAdmin: (state, action) => {
      state.admins = state.admins.filter(
        (admin) => admin._id !== action.payload
      );
    },
  },
});

export default adminSlice.reducer;
