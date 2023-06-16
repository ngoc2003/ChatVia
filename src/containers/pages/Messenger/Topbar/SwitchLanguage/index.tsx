import { Box, Menu, MenuItem, Typography } from "@mui/material";
import React from "react";
import LanguageIcon from "@mui/icons-material/Language";
import { useRouter } from "next/router";
import Image from "next/image";
import { useSelector } from "react-redux";
import { AppState } from "@stores";
import { theme } from "@theme";
import useResponsive from "@hooks/useResponsive";
import { IconWrapper } from "../IconWrapper";

const SwitchLanguage = () => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { darkMode } = useSelector((state: AppState) => state.darkMode);
  const { isTablet } = useResponsive();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const switchToEnglish = () => {
    router.push(router.pathname, router.asPath, { locale: "en" });
  };

  const switchToVietnamese = () => {
    router.push(router.pathname, router.asPath, { locale: "vi" });
  };

  return (
    <Box>
      <IconWrapper onClick={handleClick} ml={isTablet ? 3 : 2}>
        <LanguageIcon />
      </IconWrapper>
      <Menu
        sx={{
          ".MuiMenu-paper": {
            ...(darkMode && {
              bgcolor: theme.palette.darkTheme.dark,
              "*": {
                color: theme.palette.text.secondary,
              },
            }),
          },
        }}
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={handleClose}
      >
        <MenuItem onClick={switchToEnglish}>
          <Image src="/images/eng.jpeg" width={16} height={10} alt="english" />
          <Typography ml={1}>English</Typography>
        </MenuItem>
        <MenuItem onClick={switchToVietnamese}>
          <Image
            src="/images/vietnam.png"
            width={16}
            height={10}
            alt="vietnam"
          />
          <Typography ml={1}>Tiếng Việt</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default SwitchLanguage;
