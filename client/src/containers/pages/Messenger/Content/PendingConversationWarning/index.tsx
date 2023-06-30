import { Box, Typography } from "@mui/material";
import { AppState } from "@stores";
import { theme } from "@theme";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const PendingConversationWarning = () => {
  const { t } = useTranslation();
  const { darkMode } = useSelector((state: AppState) => state.darkMode);
  return (
    <Box
      p={2}
      bgcolor={theme.palette.primary.main}
      borderTop={`0.5px solid ${
        darkMode ? theme.palette.darkTheme.light : theme.palette.grey[400]
      }`}
    >
      <Typography
        variant="body2"
        fontStyle="italic"
        textAlign="center"
        color={theme.palette.common.white}
      >
        {t("pendingConversationWarning")}
      </Typography>
    </Box>
  );
};

export default PendingConversationWarning;
