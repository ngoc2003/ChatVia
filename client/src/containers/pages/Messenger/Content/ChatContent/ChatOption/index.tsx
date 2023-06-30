import React from "react";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import { Box, IconButton, Menu, MenuItem } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "@stores";
import { theme } from "@theme";
import {
  useDeleteMessageMutation,
  usePinMessageMutation,
} from "@stores/services/message";
import { commonActions } from "@stores/slices/common";
import { MessageType } from "@typing/common";
import { useTranslation } from "react-i18next";

interface ChatOptionProps {
  messageId: string;
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
  canDelete: boolean;
}

const ChatOption = ({ messageId, setMessages, canDelete }: ChatOptionProps) => {
  const { t } = useTranslation();
  const { darkMode } = useSelector((state: AppState) => state.darkMode);
  const user = useSelector((state: AppState) => state.auth);
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [deleteMessage] = useDeleteMessageMutation();
  const [pinMessage] = usePinMessageMutation();

  const handlePin = () => {
    pinMessage({
      messageId,
    })
      .unwrap()
      .then(() => {
        dispatch(
          commonActions.showAlertMessage({
            type: "success",
            message: "Pin message successfully!",
          })
        );
        setMessages((prev) =>
          prev.map((item) => ({
            ...item,
            ...(item._id === messageId && { isPin: true }),
          }))
        );
      });
  };

  const handleDelete = () => {
    if (canDelete) {
      deleteMessage({
        userId: user.id,
        messageId,
      })
        .unwrap()
        .then(() => {
          setMessages((prev) =>
            prev.filter((message) => message._id !== messageId)
          );
          dispatch(
            commonActions.showAlertMessage({
              type: "success",
              message: "Delete message successfully!",
            })
          );
        });
    } else {
      dispatch(
        commonActions.showAlertMessage({
          type: "error",
          message: "Please do not delete the latest message!",
        })
      );
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <IconButton onClick={handleClick}>
        <MoreVertOutlinedIcon
          sx={{
            opacity: 0,
          }}
          color="primary"
          fontSize="small"
        />
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
            setAnchorEl(null);
            handlePin();
          }}
        >
          {t("button.pin")}
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            handleDelete();
          }}
        >
          {t("button.delete")}
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ChatOption;
