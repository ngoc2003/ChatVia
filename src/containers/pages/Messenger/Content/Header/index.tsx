import useResponsive from "@hooks/useResponsive";
import {
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { FriendInformationType } from "@pages";
import { AppState } from "@stores";
import { theme } from "@theme";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import DeleteConversationModal from "@containers/Modals/DeleteConversation";
import { useTranslation } from "react-i18next";

interface ContentHeaderProps {
  conversationId: string;
  friendInformation: FriendInformationType | null;
  handleCloseDrawer?: () => void;
  setIsOpenUserDetail: React.Dispatch<React.SetStateAction<boolean>>;
}
// eslint-disable-next-line react/display-name
const ContentHeader = React.forwardRef<HTMLElement, ContentHeaderProps>(
  (
    {
      friendInformation,
      handleCloseDrawer,
      setIsOpenUserDetail,
      conversationId,
    },
    ref
  ) => {
    const { t } = useTranslation();
    const { darkMode } = useSelector((state: AppState) => state.darkMode);
    const { isDesktopLg } = useResponsive();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [openDeleteConversationModal, setOpenDeleteConversationModel] =
      useState<boolean>(false);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const handleCloseDeleteConversationModal = () => {
      setOpenDeleteConversationModel(false);
    };

    return (
      <>
        <DeleteConversationModal
          open={openDeleteConversationModal}
          onClose={handleCloseDeleteConversationModal}
          conversationId={conversationId}
        />
        <Box
          borderBottom={`0.5px solid ${
            darkMode ? theme.palette.darkTheme.light : theme.palette.grey[400]
          }`}
          ref={ref}
          p={2}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box display="flex" alignItems="center">
            {!isDesktopLg && (
              <KeyboardArrowLeftOutlinedIcon
                onClick={() => {
                  if (handleCloseDrawer) {
                    handleCloseDrawer();
                  }
                }}
                sx={{ mr: 1 }}
              />
            )}
            <Avatar
              sx={{ width: 40, height: 40, mr: 1 }}
              src={friendInformation?.avatar || "/images/avatar-default.svg"}
            />
            <Typography
              ml={1}
              color={darkMode ? theme.palette.common.white : undefined}
              fontWeight={600}
            >
              {friendInformation?.name}
            </Typography>
          </Box>
          <Box>
            <IconButton
              color={darkMode ? "primary" : "default"}
              onClick={handleClick}
            >
              <MoreVertOutlinedIcon fontSize="small" />
            </IconButton>
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
              <MenuItem
                onClick={() => {
                  setIsOpenUserDetail(true);
                  setAnchorEl(null);
                }}
              >
                {t("profile")}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setAnchorEl(null);
                  setOpenDeleteConversationModel(true);
                }}
              >
                {t("button.delete")}
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </>
    );
  }
);

export default ContentHeader;
