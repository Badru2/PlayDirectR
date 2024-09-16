import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getTransactions = createAsyncThunk(
  "transaction/getTransactions",
  async () => {
    const response = await axios.get(`/api/transaction/show`);
    return response.data;
  }
);

export const createTransaction = createAsyncThunk(
  "transaction/createTransaction",
  async (formData) => {
    const response = await axios.post(`/api/transaction/create`, formData);
    return response.data;
  }
);

export const updateTransaction = createAsyncThunk(
  "transaction/updateTransaction",
  async (formData) => {
    const response = await axios.put(
      `/api/transaction/update/${formData.id}`,
      formData
    );
    return response.data;
  }
);

export const deleteTransaction = createAsyncThunk(
  "transaction/deleteTransaction",
  async (id) => {
    await axios.delete(`/api/transaction/delete/${id}`);
    return id;
  }
);

const transactionSlice = createSlice({
  name: "transactions",
  initialState: {
    transactions: [],
    status: "idle",
    error: null,
  },
  reducers: {
    getTransactions: (state, action) => {
      state.transactions = action.payload;
    },
    createTransaction: (state, action) => {
      state.transactions.push(action.payload);
    },
    updateTransaction: (state, action) => {
      state.transactions = state.transactions.map((transaction) => {
        if (transaction.id === action.payload.id) {
          return action.payload;
        }
        return transaction;
      });
    },
    deleteTransaction: (state, action) => {
      state.transactions = state.transactions.filter(
        (transaction) => transaction.id !== action.payload
      );
    },
  },
});

export default transactionSlice;
