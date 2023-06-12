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

const toggleDarkMode: CaseReducer<DarkModeState, PayloadAction<void>> = (
  state
) => {
  const isDarkMode = state.darkMode;
  state.darkMode = !isDarkMode;
  setLocalDarkMode(isDarkMode ? "light" : "dark");
};

const darkModeSlice = createSlice({
  name: "darkMode",
  initialState,
  reducers: {
    toggleDarkMode,
  },
});

export const darkModeReducer = darkModeSlice.reducer;
export const darkModeActions = darkModeSlice.actions;
export const { caseReducers } = darkModeSlice;
