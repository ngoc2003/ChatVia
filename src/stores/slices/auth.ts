import {
  CaseReducer,
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

import {
  AuthResponse,
  LoginParams,
  SignUpParams,
  LoginResponse,
} from "../../typing/auth";
import { CAConnectionInstance } from "@pages/api/hello";

export interface AuthState {
  id: string | null;
  accessToken: string | null;
}

const initialState: AuthState = {
  id: null,
  accessToken: null,
};
export interface PayloadActionType {}

const setAuth: CaseReducer<AuthState, PayloadAction<AuthState>> = (
  state,
  { payload }
) => {
  state.id = payload.id;
  state.accessToken = payload.accessToken;
};

export const handleLogin = createAsyncThunk<LoginResponse, LoginParams>(
  "auth/login",
  async (body, { dispatch }) => {
    try {
      const { data } = await CAConnectionInstance.post<AuthResponse>(
        "/auth/login",
        body
      );

      dispatch(
        authActions.setAuth({
          id: data.id,
          accessToken: data.token.accessToken,
        })
      );

      return { token: data.token.accessToken };
    } catch (error: any) {
      throw new Error(error);
    }
  }
);

export const handleSignUp = createAsyncThunk<void, SignUpParams>(
  "auth/register",
  async (body) => {
    try {
      await CAConnectionInstance.post<AuthResponse>("/auth/register", body);
    } catch (error: any) {
      throw new Error(error);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth,
  },
});

export const authReducer = authSlice.reducer;
export const authActions = authSlice.actions;
export const { caseReducers } = authSlice;
