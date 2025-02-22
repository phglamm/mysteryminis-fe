import { combineReducers } from "@reduxjs/toolkit";
import counterReducer from "./features/counterSlice";
import cartReducer from "./features/cartSlice";
import favoriteReducer from "./features/favoriteSlice";
const rootReducer = combineReducers({
  user: counterReducer,
  cart: cartReducer,
  favorite: favoriteReducer,
});

export default rootReducer;
