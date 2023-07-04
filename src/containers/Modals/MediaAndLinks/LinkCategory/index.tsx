import { Typography } from "@mui/material";
import { AppState } from "@stores";
import { theme } from "@theme";
import React from "react";
import { useSelector } from "react-redux";

const LinkCategory = () => {
  const { darkMode } = useSelector((state: AppState) => state.darkMode);

  return (
    <Typography
      mt={3}
      color={darkMode ? theme.palette.common.white : undefined}
      fontStyle="italic"
    >
      This feature has not supported yet
    </Typography>
  );
};

export default LinkCategory;
