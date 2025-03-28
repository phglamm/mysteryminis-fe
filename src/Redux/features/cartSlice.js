import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

import Cookies from "js-cookie";
const initialState = {
  cartItems: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { boxId, selectedOption } = action.payload;
      if (Cookies.get("accessToken") === undefined) {
        toast.error("Please login to add to cart!");
        return;
      }
      // Check if the item with the selected variant already exists in the cart
      const item = state.cartItems.find(
        (cartItem) =>
          cartItem.boxId === boxId &&
          cartItem.selectedOption?.boxOptionId === selectedOption?.boxOptionId
      );

      if (item) {
        // If the item exists, increase its quantity
        toast.error("Box already exists in the cart!");
      } else {
        // Add the new item with the selected variant
        state.cartItems.push({ ...action.payload, quantity: 1 });
        toast.success("Box added to cart!");
      }
    },
    removeFromCart: (state, action) => {
      const { boxId, selectedOption } = action.payload;

      // Remove the item with the specific selected variant
      state.cartItems = state.cartItems.filter(
        (cartItem) =>
          cartItem.boxId !== boxId ||
          cartItem.selectedOption?.boxOptionId !== selectedOption?.boxOptionId
      );
    },
    increaseQuantity: (state, action) => {
      const { boxId, selectedOption } = action.payload;

      const item = state.cartItems.find(
        (cartItem) =>
          cartItem.boxId === boxId &&
          cartItem.selectedOption?.boxOptionId === selectedOption?.boxOptionId
      );

      if (item) {
        item.quantity += 1;
      }
    },
    decreaseQuantity: (state, action) => {
      console.log("Action payload:", action.payload);

      const { boxId, selectedOption } = action.payload;
      console.log(boxId, selectedOption);
      const item = state.cartItems.find(
        (cartItem) =>
          cartItem.boxId === boxId &&
          cartItem.selectedOption?.boxOptionId === selectedOption?.boxOptionId
      );

      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },

    increaseOpen: (state, action) => {
      const { boxId, selectedOption } = action.payload;
      const item = state.cartItems.find(
        (item) =>
          item.boxId === boxId &&
          item.selectedOption?.boxOptionId === selectedOption?.boxOptionId
      );
      if (item) {
        item.orderItemOpenRequestNumber += 1;
      }
    },
    decreaseOpen: (state, action) => {
      const { boxId, selectedOption } = action.payload;
      const item = state.cartItems.find(
        (item) =>
          item.boxId === boxId &&
          item.selectedOption?.boxOptionId === selectedOption?.boxOptionId
      );
      if (item) {
        item.orderItemOpenRequestNumber -= 1;
      }
    },

    clearCart: (state) => {
      state.cartItems = [];
    },

    addOnlineBoxToCart: (state, action) => {
      const { boxId, selectedOption } = action.payload;

      // Check if the item with the selected variant already exists in the cart
      const item = state.cartItems.find(
        (cartItem) =>
          cartItem.boxId === boxId &&
          cartItem.selectedOption?.boxOptionId === selectedOption?.boxOptionId
      );

      if (item) {
        // If the item exists, increase its quantity
      } else {
        // Add the new item with the selected variant
        state.cartItems.push({ ...action.payload, quantity: 1 });
        toast.success("Box added to cart!");
      }
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
  toggleItemChecked,
  increaseOpen,
  decreaseOpen,
  addOnlineBoxToCart,
} = cartSlice.actions;

export const selectCartItems = (state) => state.cart.cartItems;

export default cartSlice.reducer;
