import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getTransactions = createAsyncThunk(
  "transaction/getTransactions",
  async () => {
    const response = await axios.get(`/api/transaction/show`);
    return response.data;
  }
);

export const detailUserTransaction = createAsyncThunk(
  "transaction/detailUserTransaction",
  async ({ userId, transactionId }) => {
    const response = await axios.get(
      `/api/transaction/detail?userId=${userId}&transactionId=${transactionId}`
    );

    console.log(response.data);
    return response.data;
  }
);

export const getUserTransactions = createAsyncThunk(
  "transaction/getUserTransactions",
  async (userId) => {
    const response = await axios.get(`/api/transaction/get?userId=${userId}`);

    console.log(response.data);
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
  async ({ transactionId, status }) => {
    console.log(transactionId, status);

    const response = await axios.put(
      `/api/transaction/update/${transactionId}`,
      { status }
    );

    console.log(response.data);
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
    getUserTransactions: (state, action) => {
      state.transactions = action.payload;
    },
    detailUserTransaction: (state, action) => {
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
