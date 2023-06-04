import { ThemeProvider } from "@mui/material/styles";
import { Box, CssBaseline, GlobalStyles } from "@mui/material";
import { theme } from "@/theme";
import React, { ReactNode, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { authActions } from "@/stores/slices/auth";

interface ThemeWrapperProviderProps {
  children: ReactNode;
  token: string | null;
  id: string | null;
}

const ThemeWrapperProvider = ({
  children,
  token,
  id,
}: ThemeWrapperProviderProps) => {
  const wrapperRef = useRef<HTMLElement>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token && id) {
      dispatch(
        authActions.setAuth({
          accessToken: token,
          id,
        })
      );
    }
  }, [dispatch, id, token]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          "::-webkit-scrollbar": {
            width: 10,
          },
          "::-webkit-scrollbar-thumb": {
            borderRight: `8px ${theme.palette.primary.main}  solid`,
            backgroundClip: "padding-box",
          },
        }}
      />
      <Box position="relative" ref={wrapperRef}>
        {children}
      </Box>
    </ThemeProvider>
  );
};

export default ThemeWrapperProvider;
