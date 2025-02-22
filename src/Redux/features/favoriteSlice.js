import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const initialState = {
  favorites: [],
};

const favoriteSlice = createSlice({
  name: "favorite",
  initialState,
  reducers: {
    addToFavorite: (state, action) => {
      const { boxId } = action.payload;

      const item = state.favorites.find((favor) => favor.boxId === boxId);

      if (item) {
        toast.error("This item is already in your favorite list");
      } else {
        state.favorites.push({ ...action.payload });
        toast.success("Added to favorite list");
      }
    },
    removeFromFavorite: (state, action) => {
      const { boxId } = action.payload;

      // Remove the item with the specific boxId
      state.favorites = state.favorites.filter(
        (favor) => favor.boxId !== boxId
      );
      toast.success("Removed from favorite list");
    },
    clearFavorite: (state) => {
      state.favorites = [];
      toast.success("Cleared favorite list");
    },
  },
});

export const { addToFavorite, removeFromFavorite, clearFavorite } =
  favoriteSlice.actions;

export const selectFavoriteItems = (state) => state.favorite.favorites;

export default favoriteSlice.reducer;
