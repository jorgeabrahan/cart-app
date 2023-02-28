import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { openModal } from '../modal/modalSlice';

const url = 'https://course-api.com/react-useReducer-cart-project';

const initialState = {
  cartItems: [],
  amount: 0,
  total: 0,
  isLoading: false,
};

export const getCartItems = createAsyncThunk('cart/getCartItems', async (name, thunkAPI) => {
  try {
    const resp = await axios(url);
    return resp.data;
  } catch (error) {
    return thunkAPI.rejectWithValue('something went wrong');
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => ({ ...state, cartItems: [], amount: 0 }),
    removeItem: (state, action) => {
      const id = action.payload;
      state.cartItems = state.cartItems.filter((item) => item.id !== id);
      state.amount = state.amount - 1;
    },
    increase: (state, { payload }) => {
      const item = state.cartItems.find((item) => item.id === payload.id);
      item.amount = item.amount + 1;
      state.amount = state.amount + 1;
    },
    decrease: (state, { payload }) => {
      const item = state.cartItems.find((item) => item.id === payload.id);
      item.amount = item.amount - 1;
      state.amount = state.amount - 1;
    },
    calculateTotals: (state) => {
      let total = 0;
      state.cartItems.forEach(({ amount, price }) => (total += amount * price));
      state.total = total;
    },
  },
  extraReducers: {
    [getCartItems.pending]: (state) => {
      state.isLoading = true;
    },
    [getCartItems.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.cartItems = action.payload;
      state.amount = action.payload.length;
    },
    [getCartItems.rejected]: (state) => {
      state.isLoading = false;
    },
  },
});

export const { clearCart, removeItem, increase, decrease, calculateTotals } = cartSlice.actions;

export default cartSlice.reducer;
