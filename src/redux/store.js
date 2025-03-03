import { configureStore } from "@reduxjs/toolkit";
import promotionsReducer from "./promotionsSlice";

const store = configureStore({
  reducer: {
    promotions: promotionsReducer,
  },
});

export default store;