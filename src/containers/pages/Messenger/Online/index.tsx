import { Box } from "@mui/material";
import { BoxProps } from "@mui/system";
import { theme } from "@theme";
import React from "react";

const Online = ({ ...props }: BoxProps) => {
  return (
    <Box {...props} p={1} borderLeft={`1px solid ${theme.palette.grey[100]}`}>
      Online
    </Box>
  );
};

export default Online;
