import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const initialState = {
  cartItems: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { _id, selectedOption } = action.payload;

      // Check if the item with the selected variant already exists in the cart
      const item = state.cartItems.find(
        (cartItem) =>
          cartItem._id === _id &&
          cartItem.selectedOption?._id === selectedOption?._id
      );

      if (item) {
        // If the item exists, increase its quantity
        toast.error("This item is already in your cart!");
      } else {
        // Add the new item with the selected variant
        toast.success("Added to cart");
        state.cartItems.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromCart: (state, action) => {
      const { _id, selectedOption } = action.payload;

      // Remove the item with the specific selected variant
      state.cartItems = state.cartItems.filter(
        (cartItem) =>
          cartItem._id !== _id ||
          cartItem.selectedOption?._id !== selectedOption?._id
      );
    },
    increaseQuantity: (state, action) => {
      const { _id, selectedOption } = action.payload;

      const item = state.cartItems.find(
        (cartItem) =>
          cartItem._id === _id &&
          cartItem.selectedOption?._id === selectedOption?._id
      );

      if (item) {
        item.quantity += 1;
      }
    },
    decreaseQuantity: (state, action) => {
      const { _id, selectedOption } = action.payload;

      const item = state.cartItems.find(
        (cartItem) =>
          cartItem._id === _id &&
          cartItem.selectedOption?._id === selectedOption?._id
      );

      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },
    increaseOpen: (state, action) => {
      const { _id, selectedOption } = action.payload;
      const item = state.cartItems.find(
        (item) =>
          item._id === _id && item.selectedOption?._id === selectedOption?._id
      );
      if (item) {
        item.orderItemOpenRequestNumber += 1;
      }
    },
    decreaseOpen: (state, action) => {
      const { _id, selectedOption } = action.payload;
      const item = state.cartItems.find(
        (item) =>
          item._id === _id && item.selectedOption?._id === selectedOption?._id
      );
      if (item) {
        item.orderItemOpenRequestNumber -= 1;
      }
    },
    clearCart: (state) => {
      state.cartItems = [];
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
  increaseOpen,
  decreaseOpen,
} = cartSlice.actions;

export const selectCartItems = (state) => state.cart.cartItems;

export default cartSlice.reducer;
