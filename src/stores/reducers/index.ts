import { combineReducers } from "@reduxjs/toolkit";
import baseRtkApi from "../services";
import { authReducer } from "../slices/auth";

const rootReducer = combineReducers({
  auth: authReducer,
  [baseRtkApi.reducerPath]: baseRtkApi.reducer,
});

export default rootReducer;
