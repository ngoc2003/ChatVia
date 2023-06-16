import React from "react";
import Image from "next/image";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();
import { useRouter } from "next/router";
import { Avatar, Box, Menu, MenuItem } from "@mui/material";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import MarkChatUnreadOutlinedIcon from "@mui/icons-material/MarkChatUnreadOutlined";
import { useTranslation } from "next-i18next";
import useGetCookieData from "@hooks/useGetCookieData";
import { theme } from "@theme";
import SwitchLanguage from "./SwitchLanguage";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "@stores";
import { darkModeActions } from "@stores/slices/darkMode";
import PersonIcon from "@mui/icons-material/Person";
import useResponsive from "@hooks/useResponsive";
import { IconWrapper } from "./IconWrapper";
const topLink = [
  {
    icon: <PersonIcon />,
    path: "/me",
  },
  {
    icon: <MarkChatUnreadOutlinedIcon />,
    path: "/",
  },
  {
    icon: <ContactsOutlinedIcon />,
    path: "/contact",
  },
];

const Topbar = ({ setTabActive, tabActive }) => {
  const router = useRouter();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const user = useSelector((state: AppState) => state.auth);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { isDesktopLg, isTablet } = useResponsive();
  const { clearCookieData } = useGetCookieData();
  const { darkMode } = useSelector((state: AppState) => state.darkMode);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    router.push("/auth");
    clearCookieData(publicRuntimeConfig.ACCESS_TOKEN_SECRET as string);
  };

  return (
    <Box
      px={2}
      py={1}
      width="100%"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      bgcolor={
        darkMode ? theme.palette.darkTheme.light : theme.palette.common.white
      }
      sx={{
        borderBottom: 1,
        borderColor: darkMode ? "transparent" : theme.palette.grey[200],
      }}
    >
      {isDesktopLg && (
        <Image src="/images/Logo.png" width={30} height={30} alt="logo" />
      )}
      <Box display="flex">
        {topLink.map((link, index) => (
          <IconWrapper
            bgcolor={
              link.path === tabActive
                ? darkMode
                  ? theme.palette.darkTheme.lighter
                  : theme.palette.primary.light
                : "transparent"
            }
            {...(link.path === tabActive && {
              color: theme.palette.primary.main,
            })}
            ml={index == 0 ? 0 : isTablet ? 3 : 2}
            key={link.path}
            onClick={() => {
              setTabActive(link.path);
            }}
          >
            {link.icon}
          </IconWrapper>
        ))}
      </Box>
      <Box display="flex" alignItems="center">
        <SwitchLanguage />
        <IconWrapper
          ml={isTablet ? 3 : 2}
          onClick={() => dispatch(darkModeActions.toggleDarkMode())}
        >
          <DarkModeOutlinedIcon />
        </IconWrapper>
        <Box ml={3}>
          <Avatar
            onClick={handleClick}
            src={user?.avatar ?? "/images/avatar-default.svg"}
            sx={{ cursor: "pointer", width: 30, height: 30 }}
          />
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
            <MenuItem onClick={handleLogout}>{t("logout")}</MenuItem>
          </Menu>
        </Box>
      </Box>
    </Box>
  );
};

export default Topbar;
