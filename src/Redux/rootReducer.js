import { combineReducers } from "@reduxjs/toolkit";
import counterReducer from "./features/counterSlice";
import cartReducer from "./features/cartSlice";

const rootReducer = combineReducers({
  user: counterReducer,
  cart: cartReducer,
});

export default rootReducer;
