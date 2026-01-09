import { combineReducers } from "@reduxjs/toolkit";
import { themeSlice } from "./slices/ThemeSlice";
import { campaignApiSlice } from "../api/campaignApi";


const rootReducer = combineReducers({
  //user: userSlice.reducer,
  theme: themeSlice.reducer, 
  [campaignApiSlice.reducerPath]: campaignApiSlice.reducer

});

export default rootReducer;