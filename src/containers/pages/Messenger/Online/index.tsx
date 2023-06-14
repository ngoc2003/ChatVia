import useResponsive from "@hooks/useResponsive";
import { Box, Drawer, IconButton, Typography } from "@mui/material";
import { BoxProps } from "@mui/system";
import { FriendInformationType } from "@pages";
import { AppState } from "@stores";
import { theme } from "@theme";
import Image from "next/image";
import React from "react";
import { useSelector } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";

interface OnlineProps extends BoxProps {
  friendInformation: FriendInformationType | null;
  isOpenUserDetail: boolean;
  setIsOpenUserDetail: React.Dispatch<React.SetStateAction<boolean>>;
}

const Online = ({
  friendInformation,
  isOpenUserDetail,
  setIsOpenUserDetail,
  ...props
}: OnlineProps) => {
  const { darkMode } = useSelector((state: AppState) => state.darkMode);
  const { isDesktopLg } = useResponsive();

  const handleCloseDrawer = () => {
    setIsOpenUserDetail(false);
  };

  if (!friendInformation) {
    return <></>;
  }

  return (
    <Drawer
      sx={{
        ".MuiPaper-root": {
          bgcolor: darkMode ? theme.palette.darkTheme.main : undefined,
          width: isDesktopLg ? 380 : "100vw",
        },
      }}
      anchor="right"
      open={isOpenUserDetail}
      onClose={handleCloseDrawer}
    >
      <Box textAlign="right">
        <Box p={2}>
          <IconButton color="primary" onClick={handleCloseDrawer}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box
          {...props}
          p={3}
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Image
            src="/images/avatar-default.svg"
            height={80}
            width={80}
            alt={friendInformation?.name}
          />
          <Typography
            color={darkMode ? theme.palette.common.white : undefined}
            mt={3}
          >
            {friendInformation?.name}
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Online;
