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
import { commonActions } from "./common";

export interface AuthState {
  id: string | null;
  accessToken: string | null;
  avatar: string;
}

const initialState: AuthState = {
  id: null,
  accessToken: null,
  avatar: "",
};

const setAuth: CaseReducer<AuthState, PayloadAction<AuthState>> = (
  state,
  { payload }
) => {
  state.id = payload.id;
  state.accessToken = payload.accessToken;
  state.avatar = payload.avatar;
};

const setAvatar: CaseReducer<
  AuthState,
  PayloadAction<Pick<AuthState, "avatar">>
> = (state, { payload }) => {
  state.avatar = payload.avatar;
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
          avatar: data?.avatar || "",
        })
      );

      return { token: data.token.accessToken };
    } catch (error: any) {
      if (error.response.status === 403) {
        dispatch(
          commonActions.showAlertMessage({
            type: "error",
            message: "Password does not match",
          })
        );
      }

      if (error.response.status === 401) {
        dispatch(
          commonActions.showAlertMessage({
            type: "error",
            message: "Email is wrong, please check again",
          })
        );
      }
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
    setAvatar,
  },
});

export const authReducer = authSlice.reducer;
export const authActions = authSlice.actions;
export const { caseReducers } = authSlice;
