import { combineReducers } from "@reduxjs/toolkit";
import { themeSlice } from "./slices/ThemeSlice";
import { campaignApiSlice } from "../api/campaignApi";
import { userSlice } from "./slices/UserSlice";


const rootReducer = combineReducers({
  user: userSlice.reducer,
  theme: themeSlice.reducer, 
  [campaignApiSlice.reducerPath]: campaignApiSlice.reducer

});

export default rootReducer;