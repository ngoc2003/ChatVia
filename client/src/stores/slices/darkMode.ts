import { CaseReducer, createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface DarkModeState {
  darkMode: boolean;
}

const setLocalDarkMode = (val: string) => {
  localStorage.setItem("chatMessageMode", val);
};

const getLocalDarkMode = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("chatMessageMode");
  }
  return "light";
};

const initializeState = () => {
  const localDarkMode = getLocalDarkMode();
  if (localDarkMode === "dark") {
    return true;
  }
  return false;
};

const initialState: DarkModeState = {
  darkMode: initializeState(),
};

const changeDarkMode: CaseReducer<
  DarkModeState,
  PayloadAction<DarkModeState>
> = (state, { payload }) => {
  state.darkMode = payload.darkMode;
  setLocalDarkMode(payload.darkMode ? "dark" : "light");
};

const darkModeSlice = createSlice({
  name: "darkMode",
  initialState,
  reducers: {
    changeDarkMode,
  },
});

export const darkModeReducer = darkModeSlice.reducer;
export const darkModeActions = darkModeSlice.actions;
export const { caseReducers } = darkModeSlice;
