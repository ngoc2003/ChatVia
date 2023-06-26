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
import { useTranslation } from "react-i18next";
import { CAAccordion } from "@components/Accordion";

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
  const { t } = useTranslation();
  const { darkMode } = useSelector((state: AppState) => state.darkMode);
  const { isDesktopLg } = useResponsive();

  const handleCloseDrawer = () => {
    setIsOpenUserDetail(false);
  };

  if (!friendInformation) {
    return <></>;
  }

  const listData = [
    {
      title: t("title.about"),
      details: [
        {
          title: t("field.username"),
          content: friendInformation.name,
        },
        {
          title: t("field.email"),
          content: friendInformation.email,
        },
        {
          title: t("field.gender"),
          content: friendInformation?.gender ?? "",
        },
        {
          title: t("field.location"),
          content: friendInformation?.location ?? "",
        },
      ],
    },
    {
      title: t("title.socialProfile"),
      details: [
        {
          title: t("field.facebook"),
          href: friendInformation?.facebookLink ?? "",
        },
      ],
    },
  ];

  return (
    <Drawer
      sx={{
        "> .MuiPaper-root": {
          bgcolor: darkMode ? theme.palette.darkTheme.main : undefined,
          width: isDesktopLg ? 380 : "100vw",
          px: 2,
        },
      }}
      anchor="right"
      open={isOpenUserDetail}
      onClose={handleCloseDrawer}
    >
      <Box textAlign="right">
        <Box py={2}>
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
            style={{ borderRadius: 9999 }}
            src={friendInformation?.avatar ?? "/images/avatar-default.svg"}
            height={80}
            width={80}
            alt={friendInformation?.name}
          />
          <Typography
            color={darkMode ? theme.palette.common.white : undefined}
            mt={3}
            mb={2}
          >
            {friendInformation?.name}
          </Typography>
          <Typography
            fontStyle="italic"
            variant="body2"
            color={
              darkMode ? theme.palette.text.secondary : theme.palette.grey[600]
            }
          >
            {friendInformation?.description ?? t("noDescriptionYet")}
          </Typography>
        </Box>
        <Box
          my={3}
          sx={{
            width: "100%",
            ".MuiPaper-root": {
              textAlign: "left",
              boxShadow: "none",
              bgcolor: darkMode ? theme.palette.darkTheme.dark : undefined,
              border: `1px solid ${
                darkMode
                  ? theme.palette.darkTheme.light
                  : theme.palette.grey[300]
              }`,
              "&::before": {
                display: "none",
              },
            },
          }}
        >
          <CAAccordion list={listData} />
        </Box>
      </Box>
    </Drawer>
  );
};

export default Online;
