import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import rootReducer from "./reducers";

import baseRtkApi from "./services";

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    const middleware = getDefaultMiddleware({
      thunk: true,
      serializableCheck: false,
      immutableCheck: false,
    }).concat(baseRtkApi.middleware);

    return middleware;
  },
  devTools: process.env.NODE_ENV === "development",
});

export type AppDispatch = typeof store.dispatch;
export type AppState = ReturnType<typeof rootReducer>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>;

declare module "react-redux" {
  type DefaultRootState = AppState;

  function useDispatch<TDispatch = AppDispatch>(): TDispatch;
}

export { store };
