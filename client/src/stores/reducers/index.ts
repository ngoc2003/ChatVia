import { combineReducers } from "@reduxjs/toolkit";
import baseRtkApi from "../services";
import { authReducer } from "../slices/auth";
import { darkModeReducer } from "../slices/darkMode";
import { commonReducer } from "@stores/slices/common";

const rootReducer = combineReducers({
  auth: authReducer,
  darkMode: darkModeReducer,
  common: commonReducer,
  [baseRtkApi.reducerPath]: baseRtkApi.reducer,
});

export default rootReducer;
