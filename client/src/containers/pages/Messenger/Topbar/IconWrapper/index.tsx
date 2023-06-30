import React from "react";
import { Box, BoxProps } from "@mui/material";
import { theme } from "@theme";
import { useSelector } from "react-redux";
import { AppState } from "@stores";

export const IconWrapper = ({ children, ...props }: BoxProps) => {
  const { darkMode } = useSelector((state: AppState) => state.darkMode);

  return (
    <Box
      display="grid"
      borderRadius={1}
      sx={{
        placeItems: "center",
        cursor: "pointer",
        "&:hover": {
          bgcolor: darkMode
            ? theme.palette.darkTheme.lighter
            : theme.palette.grey[100],
        },
      }}
      width={40}
      height={40}
      color={darkMode ? theme.palette.text.secondary : theme.palette.grey[600]}
      {...props}
    >
      {children}
    </Box>
  );
};
