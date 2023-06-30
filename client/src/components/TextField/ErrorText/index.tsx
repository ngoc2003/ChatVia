import { Box, Typography } from "@mui/material";
import { theme } from "@theme";
import React from "react";

interface ErrorTextProps {
  content?: string;
  isError: boolean;
}

export const ErrorText = ({ content, isError }: ErrorTextProps) => {
  return isError ? (
    <Box textAlign="left" mt={0.5}>
      <Typography variant="body3" color={theme.palette.error.main}>
        {content}
      </Typography>
    </Box>
  ) : (
    <></>
  );
};
