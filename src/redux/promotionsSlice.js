import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
};

const promotionsSlice = createSlice({
  name: "promotions",
  initialState,
  reducers: {
    setPromotions: (state, action) => {
      state.list = action.payload;
    },
    addPromotion: (state, action) => {
      state.list.push(action.payload);
    },
    updatePromotion: (state, action) => {
      const index = state.list.findIndex((promo) => promo.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
      console.log("State==>>>", state.list[index]);
      console.log("action==>>>", action.payload.id);
    },
    deletePromotion: (state, action) => {
      state.list = state.list.filter((promo) => promo.id !== action.payload);
    },
  },
});

export const { setPromotions, addPromotion, updatePromotion, deletePromotion } = promotionsSlice.actions;
export default promotionsSlice.reducer;