import React, { useState } from "react";
import Image from "next/image";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();
import { useRouter } from "next/router";
import { Avatar, Box, Menu, MenuItem } from "@mui/material";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import MarkChatUnreadOutlinedIcon from "@mui/icons-material/MarkChatUnreadOutlined";
import { useTranslation } from "next-i18next";
import useGetCookieData from "@hooks/useGetCookieData";
import { theme } from "@theme";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "@stores";
import PersonIcon from "@mui/icons-material/Person";
import useResponsive from "@hooks/useResponsive";
import { IconWrapper } from "./IconWrapper";
import { commonActions } from "@stores/slices/common";
import SmsOutlinedIcon from "@mui/icons-material/SmsOutlined";
import SettingModal from "@containers/Modals/Setting";

const topLink = [
  {
    icon: <MarkChatUnreadOutlinedIcon />,
    path: "/",
  },
  {
    icon: <SmsOutlinedIcon />,
    path: "/pending",
  },
  {
    icon: <PersonIcon />,
    path: "/me",
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
  const { clearCookieData } = useGetCookieData();
  const { isDesktopLg, isTablet } = useResponsive();
  const user = useSelector((state: AppState) => state.auth);
  const { darkMode } = useSelector((state: AppState) => state.darkMode);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [openSettingModal, setOpenSettingModal] = useState<boolean>(false);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleOpenSettingModal = () => {
    setOpenSettingModal(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    router.push("/auth");
    dispatch(
      commonActions.showAlertMessage({
        type: "success",
        message: "Log out successfully!",
      })
    );
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
        <Image
          src="/images/Logo.png"
          width={30}
          height={30}
          alt="logo"
          priority={true}
        />
      )}
      <SettingModal
        open={openSettingModal}
        onClose={() => setOpenSettingModal(false)}
      />
      <Box
        display="flex"
        justifyContent="space-evenly"
        {...(!isDesktopLg ? { flex: 1 } : { width: 450 })}
      >
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
        <Box ml={3}>
          <Avatar
            onClick={handleClick}
            src={user?.avatar || "/images/avatar-default.svg"}
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
            <MenuItem onClick={handleOpenSettingModal}>{t("setting")}</MenuItem>
            <MenuItem onClick={handleLogout}>{t("logout")}</MenuItem>
          </Menu>
        </Box>
      </Box>
    </Box>
  );
};

export default Topbar;
