import { combineReducers } from "@reduxjs/toolkit";
import counterReducer from "./features/counterSlice";
import cartReducer from "./features/cartSlice";
import favoriteReducer from "./features/favoriteSlice";
import boxReducer from "./features/boxSlice";
const rootReducer = combineReducers({
  user: counterReducer,
  cart: cartReducer,
  favorite: favoriteReducer,
  boxes: boxReducer,  
});

export default rootReducer;
