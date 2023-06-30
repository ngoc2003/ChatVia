import { Box, MenuItem, SelectChangeEvent, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { darkModeActions } from "@stores/slices/darkMode";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "@stores";
import { theme } from "@theme";
import CASelect from "@components/Select";

enum DarkThemeValue {
  Dark = "Dark",
  Light = "Light",
}

const SwitchTheme = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { darkMode } = useSelector((state: AppState) => state.darkMode);

  const handleChange = (event: SelectChangeEvent) => {
    dispatch(
      darkModeActions.changeDarkMode({
        darkMode: event.target.value === "Dark",
      })
    );
  };

  return (
    <Box display="flex" mt={3} alignItems="center">
      <Typography
        flex={1}
        color={darkMode ? theme.palette.common.white : undefined}
      >
        {t("theme")}
      </Typography>

      <CASelect
        handleChange={handleChange}
        value={darkMode ? DarkThemeValue.Dark : DarkThemeValue.Light}
      >
        <MenuItem
          sx={{
            display: "flex",
            alignItems: "center",
          }}
          value={DarkThemeValue.Dark}
        >
          <Typography
            ml={1}
            color={darkMode ? theme.palette.common.white : undefined}
          >
            {t("darkMode")}
          </Typography>
        </MenuItem>
        <MenuItem
          value={DarkThemeValue.Light}
          sx={{ display: "flex", alignItems: "center" }}
        >
          <Typography
            ml={1}
            color={darkMode ? theme.palette.common.white : undefined}
          >
            {t("lightMode")}
          </Typography>
        </MenuItem>
      </CASelect>
    </Box>
  );
};

export default SwitchTheme;
