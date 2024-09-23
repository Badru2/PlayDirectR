import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getLog = createAsyncThunk("appLog/getLog", async () => {
  const response = await axios.get("/api/logs");
  return response.data;
});

export const createLog = createAsyncThunk(
  "appLog/createLog",
  async (formData) => {
    const response = await axios.post("/api/logs", formData);
    return response.data;
  }
);

const appLogSlice = createSlice({
  name: "appLog",
  initialState: {
    logs: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getLog.fulfilled, (state, action) => {
        state.logs = action.payload;
      })
      .addCase(createLog.fulfilled, (state, action) => {
        state.logs.push(action.payload);
      });
  },
});

export default appLogSlice.reducer;
