import { Box, BoxProps, Typography } from "@mui/material";
import { theme } from "@theme";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { AppState } from "@stores";
import { useTranslation } from "next-i18next";
import { useGetUserByIdQuery } from "@stores/services/user";
import Image from "next/image";
import EditIcon from "@mui/icons-material/Edit";
import UpdateProfile from "@containers/Modals/UpdateProfile";
import { UserType } from "@typing/common";
import { CAAccordion } from "@components/Accordion";
import LeftSideContainer from "@containers/layouts/LeftSideContainer";

const MyProfile = (props: BoxProps) => {
  const { t } = useTranslation();
  const user = useSelector((state: AppState) => state.auth);
  const [isOpenUpdateProfile, setIsOpenUpdateProfile] =
    useState<boolean>(false);
  const { darkMode } = useSelector((state: AppState) => state.darkMode);
  const { data } = useGetUserByIdQuery({
    userId: user.id as string,
  });

  const handleCloseUpdateProfile = () => {
    setIsOpenUpdateProfile(false);
  };

  if (!data) {
    return <></>;
  }

  const listData = [
    {
      title: t("title.about"),
      details: [
        {
          title: t("field.username"),
          content: data.username,
        },
        {
          title: t("field.email"),
          content: data.email,
        },
        {
          title: t("field.gender"),
          content: data?.gender ?? "",
        },
        {
          title: t("field.location"),
          content: data?.location ?? "",
        },
      ],
    },
    {
      title: t("title.socialProfile"),
      details: [
        {
          title: t("field.facebook"),
          href: data?.facebookLink ?? "",
        },
      ],
    },
  ];

  return (
    <>
      <UpdateProfile
        user={data as UserType}
        open={isOpenUpdateProfile}
        onClose={handleCloseUpdateProfile}
      />
      <LeftSideContainer
        title={t("title.myProfile")}
        icon={<EditIcon color="primary" />}
        onClickIcon={() => {
          setIsOpenUpdateProfile(true);
        }}
        {...props}
      >
        <Box textAlign="center">
          <Image
            style={{ borderRadius: 9999 }}
            height={96}
            width={96}
            src={data?.avatar || "/images/avatar-default.svg"}
            alt="avatar"
          />
          <Typography
            mt={3}
            mb={1}
            fontWeight={600}
            color={darkMode ? theme.palette.common.white : undefined}
          >
            {data.username}
          </Typography>
          <Typography
            fontStyle="italic"
            variant="body2"
            color={
              darkMode ? theme.palette.text.secondary : theme.palette.grey[600]
            }
          >
            {data?.description || t("noDescriptionYet")}
          </Typography>
        </Box>
        <Box
          my={3}
          sx={{
            width: "100%",
            ".MuiPaper-root": {
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
      </LeftSideContainer>
    </>
  );
};

export default MyProfile;
