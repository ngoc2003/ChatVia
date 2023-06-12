import React from "react";
import Image from "next/image";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();
import { useRouter } from "next/router";
import { Avatar, Box, BoxProps, Menu, MenuItem } from "@mui/material";
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

const topLink = [
  {
    icon: <MarkChatUnreadOutlinedIcon />,
    path: "/",
  },
  {
    icon: <ContactsOutlinedIcon />,
    path: "/contact",
  },
];

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
      color={theme.palette.grey[600]}
      {...props}
    >
      {children}
    </Box>
  );
};

const Topbar = ({ setTabActive, tabActive }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { clearCookieData } = useGetCookieData();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { darkMode } = useSelector((state: AppState) => state.darkMode);
  const dispatch = useDispatch();

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
      <Image src="/images/Logo.png" width={30} height={30} alt="logo" />
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
            color={
              link.path === tabActive
                ? theme.palette.primary.main
                : darkMode
                ? theme.palette.text.secondary
                : theme.palette.grey[600]
            }
            ml={index == 0 ? 0 : 3}
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
          ml={3}
          onClick={() => dispatch(darkModeActions.toggleDarkMode())}
        >
          <DarkModeOutlinedIcon />
        </IconWrapper>
        <Box ml={3}>
          <Avatar
            onClick={handleClick}
            src="/images/avatar-default.svg"
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
            <MenuItem>{t("myProfile")}</MenuItem>
            <MenuItem onClick={handleLogout}>{t("logout")}</MenuItem>
          </Menu>
        </Box>
      </Box>
    </Box>
  );
};

export default Topbar;
