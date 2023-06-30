import CAModal from "@components/Modal";
import { Box, Button, ModalProps, Typography } from "@mui/material";
import { AppState } from "@stores";
import { useDeleteConversationMutation } from "@stores/services/conversation";
import { commonActions } from "@stores/slices/common";
import { theme } from "@theme";
import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

interface DeleteConversationModalProps extends Omit<ModalProps, "children"> {
  conversationId: string;
}

const DeleteConversationModal = ({
  conversationId,
  ...props
}: DeleteConversationModalProps) => {
  const { t } = useTranslation();
  const user = useSelector((state: AppState) => state.auth);
  const { darkMode } = useSelector((state: AppState) => state.darkMode);
  const dispatch = useDispatch();

  const [deleteConversation, { isLoading }] = useDeleteConversationMutation();

  const handleDeleteConversation = () => {
    deleteConversation({
      userId: user.id,
      conversationId,
    })
      .unwrap()
      .then(() => {
        dispatch(
          commonActions.showAlertMessage({
            type: "success",
            message: "Delete conversation successfully!",
          })
        );
      });
  };
  return (
    <CAModal {...props}>
      <>
        <Typography
          color={darkMode ? theme.palette.common.white : undefined}
          variant="h6"
          mb={3}
        >
          {t("title.deleteConversation")}
        </Typography>
        <Box display="flex">
          <Button
            variant="text"
            sx={{ mr: 1 }}
            fullWidth
            disabled={isLoading}
            onClick={handleDeleteConversation}
          >
            {t("button.delete")}
          </Button>
          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              props.onClose?.({}, "escapeKeyDown");
            }}
          >
            {t("button.cancel")}
          </Button>
        </Box>
      </>
    </CAModal>
  );
};

export default DeleteConversationModal;
