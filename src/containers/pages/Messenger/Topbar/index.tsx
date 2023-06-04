import useGetCookieData from "@hooks/useGetCookieData";
import { Avatar, Box, Menu, MenuItem } from "@mui/material";
import { theme } from "@theme";
import Image from "next/image";
import React from "react";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

const Topbar = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { clearCookieData } = useGetCookieData();
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    clearCookieData(publicRuntimeConfig.ACCESS_TOKEN_SECRET as string);
    handleClose();
  };
  return (
    <Box
      p={2}
      width="100%"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      bgcolor={theme.palette.common.white}
      sx={{
        borderBottom: 1,
        borderColor: theme.palette.grey[200],
      }}
    >
      <Image src="/images/Logo.png" width={30} height={30} alt="logo" />
      <Box>
        <Avatar
          onClick={handleClick}
          src="/images/avatar-default.svg"
          sx={{ cursor: "pointer", width: 30, height: 30 }}
        />
        <Menu
          sx={{}}
          anchorEl={anchorEl}
          open={!!anchorEl}
          onClose={handleClose}
        >
          <MenuItem onClick={handleLogout}>Log out</MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default Topbar;
