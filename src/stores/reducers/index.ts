import { combineReducers } from "@reduxjs/toolkit";
import baseRtkApi from "../services";
import { authReducer } from "../slices/auth";
import { darkModeReducer } from "../slices/darkMode";

const rootReducer = combineReducers({
  auth: authReducer,
  darkMode: darkModeReducer,
  [baseRtkApi.reducerPath]: baseRtkApi.reducer,
});

export default rootReducer;
