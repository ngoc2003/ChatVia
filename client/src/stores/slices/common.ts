import { AlertColor } from "@mui/material";
import { CaseReducer, PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface MessageState {
  open: boolean;
  message: string;
  type: AlertColor;
}

const initialState: MessageState = {
  open: false,
  message: "",
  type: "error",
};

const showAlertMessage: CaseReducer<
  MessageState,
  PayloadAction<Omit<MessageState, "open">>
> = (state, { payload }) => {
  state.open = true;
  state.message = payload.message;
  state.type = payload.type;
};

const hideAlertMessage: CaseReducer<MessageState> = (state) => {
  state.open = false;
};

const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    showAlertMessage,
    hideAlertMessage,
  },
});

export const commonReducer = commonSlice.reducer;
export const commonActions = commonSlice.actions;
export const { caseReducers } = commonSlice;
