import { Box, MenuItem, SelectChangeEvent, Typography } from "@mui/material";
import React, { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { theme } from "@theme";
import { useSelector } from "react-redux";
import { AppState } from "@stores";
import CASelect from "@components/Select";

enum Languages {
  English = "English",
  Vietnamese = "Tiếng Việt",
}

const SwitchLanguage = () => {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { darkMode } = useSelector((state: AppState) => state.darkMode);

  const [language, setLanguage] = useState<Languages>(
    i18n.language === "vi" ? Languages.Vietnamese : Languages.English
  );

  const handleChange = (event: SelectChangeEvent) => {
    setLanguage(event.target.value as Languages);
  };

  const switchToEnglish = () => {
    router.push(router.pathname, router.asPath, { locale: "en" });
  };

  const switchToVietnamese = () => {
    router.push(router.pathname, router.asPath, { locale: "vi" });
  };

  return (
    <Box display="flex" mt={3} alignItems="center">
      <Typography
        color={darkMode ? theme.palette.common.white : undefined}
        flex={1}
      >
        {t("language")}
      </Typography>
      <CASelect value={language} handleChange={handleChange}>
        <MenuItem
          sx={{
            display: "flex",
            alignItems: "center",
          }}
          onClick={switchToEnglish}
          value={Languages.English}
        >
          <Image src="/images/eng.jpeg" width={16} height={10} alt="english" />
          <Typography
            color={darkMode ? theme.palette.common.white : undefined}
            ml={1}
          >
            {Languages.English}
          </Typography>
        </MenuItem>
        <MenuItem
          sx={{ display: "flex", alignItems: "center" }}
          onClick={switchToVietnamese}
          value={Languages.Vietnamese}
        >
          <Image
            src="/images/vietnam.png"
            width={16}
            height={10}
            alt="vietnam"
          />
          <Typography
            color={darkMode ? theme.palette.common.white : undefined}
            ml={1}
          >
            {Languages.Vietnamese}
          </Typography>
        </MenuItem>
      </CASelect>
    </Box>
  );
};

export default SwitchLanguage;
